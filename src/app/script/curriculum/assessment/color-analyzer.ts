/**
 * Color Analyzer
 * Analyzes color accuracy using CIEDE2000 Delta-E color difference
 */

import {
    TColorConfig,
    TColorMetrics,
    TColorRegion,
    TRgb,
} from '../types';

// ============================================================================
// Color Space Conversions
// ============================================================================

/**
 * Convert RGB to XYZ color space
 */
function rgbToXyz(rgb: TRgb): { x: number; y: number; z: number } {
    // Normalize RGB values to 0-1
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    // Apply gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Scale
    r *= 100;
    g *= 100;
    b *= 100;

    // Convert to XYZ using sRGB matrix
    return {
        x: r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
        y: r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
        z: r * 0.0193339 + g * 0.1191920 + b * 0.9503041,
    };
}

/**
 * Convert XYZ to Lab color space
 * Reference white: D65 (daylight)
 */
function xyzToLab(xyz: { x: number; y: number; z: number }): { L: number; a: number; b: number } {
    // D65 reference white
    const refX = 95.047;
    const refY = 100.0;
    const refZ = 108.883;

    let x = xyz.x / refX;
    let y = xyz.y / refY;
    let z = xyz.z / refZ;

    const epsilon = 0.008856;
    const kappa = 903.3;

    x = x > epsilon ? Math.pow(x, 1 / 3) : (kappa * x + 16) / 116;
    y = y > epsilon ? Math.pow(y, 1 / 3) : (kappa * y + 16) / 116;
    z = z > epsilon ? Math.pow(z, 1 / 3) : (kappa * z + 16) / 116;

    return {
        L: 116 * y - 16,
        a: 500 * (x - y),
        b: 200 * (y - z),
    };
}

/**
 * Convert RGB to Lab
 */
function rgbToLab(rgb: TRgb): { L: number; a: number; b: number } {
    return xyzToLab(rgbToXyz(rgb));
}

// ============================================================================
// CIEDE2000 Delta-E Calculation
// ============================================================================

/**
 * Calculate CIEDE2000 color difference
 * Returns a value where 0 = identical, higher = more different
 * Generally: <1 not perceptible, 1-2 barely perceptible, 2-10 perceptible,
 * 11-49 colors are more similar than opposite, 100 = exact opposite
 */
export function deltaE2000(lab1: { L: number; a: number; b: number }, lab2: { L: number; a: number; b: number }): number {
    const { L: L1, a: a1, b: b1 } = lab1;
    const { L: L2, a: a2, b: b2 } = lab2;

    // Parametric weighting factors
    const kL = 1;
    const kC = 1;
    const kH = 1;

    // Calculate C1, C2
    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    const Cb = (C1 + C2) / 2;

    // Calculate G
    const G = 0.5 * (1 - Math.sqrt(Math.pow(Cb, 7) / (Math.pow(Cb, 7) + Math.pow(25, 7))));

    // Calculate a'
    const a1Prime = a1 * (1 + G);
    const a2Prime = a2 * (1 + G);

    // Calculate C'
    const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
    const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);

    // Calculate h'
    let h1Prime = Math.atan2(b1, a1Prime) * (180 / Math.PI);
    if (h1Prime < 0) h1Prime += 360;

    let h2Prime = Math.atan2(b2, a2Prime) * (180 / Math.PI);
    if (h2Prime < 0) h2Prime += 360;

    // Calculate deltaL', deltaC', deltaH'
    const deltaLPrime = L2 - L1;
    const deltaCPrime = C2Prime - C1Prime;

    let deltahPrime: number;
    if (C1Prime * C2Prime === 0) {
        deltahPrime = 0;
    } else if (Math.abs(h2Prime - h1Prime) <= 180) {
        deltahPrime = h2Prime - h1Prime;
    } else if (h2Prime - h1Prime > 180) {
        deltahPrime = h2Prime - h1Prime - 360;
    } else {
        deltahPrime = h2Prime - h1Prime + 360;
    }

    const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin((deltahPrime * Math.PI) / 360);

    // Calculate L', C', h' averages
    const LPrimeBar = (L1 + L2) / 2;
    const CPrimeBar = (C1Prime + C2Prime) / 2;

    let hPrimeBar: number;
    if (C1Prime * C2Prime === 0) {
        hPrimeBar = h1Prime + h2Prime;
    } else if (Math.abs(h1Prime - h2Prime) <= 180) {
        hPrimeBar = (h1Prime + h2Prime) / 2;
    } else if (h1Prime + h2Prime < 360) {
        hPrimeBar = (h1Prime + h2Prime + 360) / 2;
    } else {
        hPrimeBar = (h1Prime + h2Prime - 360) / 2;
    }

    // Calculate T
    const T =
        1 -
        0.17 * Math.cos(((hPrimeBar - 30) * Math.PI) / 180) +
        0.24 * Math.cos((2 * hPrimeBar * Math.PI) / 180) +
        0.32 * Math.cos(((3 * hPrimeBar + 6) * Math.PI) / 180) -
        0.2 * Math.cos(((4 * hPrimeBar - 63) * Math.PI) / 180);

    // Calculate SL, SC, SH
    const SL = 1 + (0.015 * Math.pow(LPrimeBar - 50, 2)) / Math.sqrt(20 + Math.pow(LPrimeBar - 50, 2));
    const SC = 1 + 0.045 * CPrimeBar;
    const SH = 1 + 0.015 * CPrimeBar * T;

    // Calculate RT
    const deltaTheta = 30 * Math.exp(-Math.pow((hPrimeBar - 275) / 25, 2));
    const RC = 2 * Math.sqrt(Math.pow(CPrimeBar, 7) / (Math.pow(CPrimeBar, 7) + Math.pow(25, 7)));
    const RT = -RC * Math.sin((2 * deltaTheta * Math.PI) / 180);

    // Calculate final Delta E
    const deltaE = Math.sqrt(
        Math.pow(deltaLPrime / (kL * SL), 2) +
        Math.pow(deltaCPrime / (kC * SC), 2) +
        Math.pow(deltaHPrime / (kH * SH), 2) +
        RT * (deltaCPrime / (kC * SC)) * (deltaHPrime / (kH * SH))
    );

    return deltaE;
}

/**
 * Calculate color difference between two RGB colors using CIEDE2000
 */
export function colorDifference(color1: TRgb, color2: TRgb): number {
    const lab1 = rgbToLab(color1);
    const lab2 = rgbToLab(color2);
    return deltaE2000(lab1, lab2);
}

/**
 * Convert Delta-E to a 0-100 score
 * deltaE of 0 = score 100, deltaE >= tolerance = score 0
 */
export function deltaEToScore(deltaE: number, tolerance: number): number {
    if (deltaE <= 0) return 100;
    if (deltaE >= tolerance) return 0;
    return Math.round(100 * (1 - deltaE / tolerance));
}

// ============================================================================
// Image Analysis
// ============================================================================

/**
 * Get the average color from an ImageData object within a region
 */
export function getAverageColorInRegion(
    imageData: ImageData,
    region: { x: number; y: number; width: number; height: number }
): TRgb | null {
    const data = imageData.data;
    const imgWidth = imageData.width;

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    const startX = Math.max(0, Math.floor(region.x));
    const startY = Math.max(0, Math.floor(region.y));
    const endX = Math.min(imgWidth, Math.floor(region.x + region.width));
    const endY = Math.min(imageData.height, Math.floor(region.y + region.height));

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const idx = (y * imgWidth + x) * 4;

            // Skip transparent pixels
            if (data[idx + 3] < 128) continue;

            totalR += data[idx];
            totalG += data[idx + 1];
            totalB += data[idx + 2];
            count++;
        }
    }

    if (count === 0) return null;

    return {
        r: Math.round(totalR / count),
        g: Math.round(totalG / count),
        b: Math.round(totalB / count),
    };
}

/**
 * Get the dominant color from an ImageData object within a region
 * Uses color binning for better accuracy
 */
export function getDominantColorInRegion(
    imageData: ImageData,
    region: { x: number; y: number; width: number; height: number },
    binSize: number = 32
): TRgb | null {
    const data = imageData.data;
    const imgWidth = imageData.width;

    // Color bins
    const bins: Map<string, { count: number; r: number; g: number; b: number }> = new Map();

    const startX = Math.max(0, Math.floor(region.x));
    const startY = Math.max(0, Math.floor(region.y));
    const endX = Math.min(imgWidth, Math.floor(region.x + region.width));
    const endY = Math.min(imageData.height, Math.floor(region.y + region.height));

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const idx = (y * imgWidth + x) * 4;

            // Skip transparent pixels and white/near-white (background)
            if (data[idx + 3] < 128) continue;
            if (data[idx] > 240 && data[idx + 1] > 240 && data[idx + 2] > 240) continue;

            // Bin the color
            const binR = Math.floor(data[idx] / binSize) * binSize;
            const binG = Math.floor(data[idx + 1] / binSize) * binSize;
            const binB = Math.floor(data[idx + 2] / binSize) * binSize;
            const key = `${binR},${binG},${binB}`;

            const existing = bins.get(key);
            if (existing) {
                existing.count++;
                existing.r += data[idx];
                existing.g += data[idx + 1];
                existing.b += data[idx + 2];
            } else {
                bins.set(key, {
                    count: 1,
                    r: data[idx],
                    g: data[idx + 1],
                    b: data[idx + 2],
                });
            }
        }
    }

    if (bins.size === 0) return null;

    // Find the most common bin
    let maxCount = 0;
    let dominantBin: { count: number; r: number; g: number; b: number } | null = null;

    for (const bin of bins.values()) {
        if (bin.count > maxCount) {
            maxCount = bin.count;
            dominantBin = bin;
        }
    }

    if (!dominantBin) return null;

    return {
        r: Math.round(dominantBin.r / dominantBin.count),
        g: Math.round(dominantBin.g / dominantBin.count),
        b: Math.round(dominantBin.b / dominantBin.count),
    };
}

/**
 * Calculate the coverage percentage (non-white/transparent pixels) in a region
 */
export function calculateCoverage(
    imageData: ImageData,
    region: { x: number; y: number; width: number; height: number }
): number {
    const data = imageData.data;
    const imgWidth = imageData.width;

    let filledCount = 0;
    let totalCount = 0;

    const startX = Math.max(0, Math.floor(region.x));
    const startY = Math.max(0, Math.floor(region.y));
    const endX = Math.min(imgWidth, Math.floor(region.x + region.width));
    const endY = Math.min(imageData.height, Math.floor(region.y + region.height));

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const idx = (y * imgWidth + x) * 4;
            totalCount++;

            // Consider filled if not transparent and not white
            if (data[idx + 3] >= 128) {
                if (!(data[idx] > 245 && data[idx + 1] > 245 && data[idx + 2] > 245)) {
                    filledCount++;
                }
            }
        }
    }

    if (totalCount === 0) return 0;
    return Math.round((filledCount / totalCount) * 100);
}

// ============================================================================
// Main Analyzer Class
// ============================================================================

export class ColorAnalyzer {
    /**
     * Analyze color accuracy in an image against a color exercise configuration
     */
    analyze(imageData: ImageData, config: TColorConfig): TColorMetrics {
        const regionScores: { regionId: string; score: number }[] = [];
        let totalColorScore = 0;
        let totalCoverage = 0;

        for (const region of config.regions) {
            // Get the dominant color in this region
            const userColor = getDominantColorInRegion(imageData, region.bounds);

            if (userColor) {
                // Calculate Delta-E color difference
                const deltaE = colorDifference(userColor, region.targetColor);
                const colorScore = deltaEToScore(deltaE, config.tolerance);

                regionScores.push({
                    regionId: region.id,
                    score: colorScore,
                });

                totalColorScore += colorScore;
            } else {
                // No color found in region
                regionScores.push({
                    regionId: region.id,
                    score: 0,
                });
            }

            // Calculate coverage for this region
            const coverage = calculateCoverage(imageData, region.bounds);
            totalCoverage += coverage;
        }

        const numRegions = config.regions.length;
        const avgColorAccuracy = numRegions > 0 ? totalColorScore / numRegions : 0;
        const avgCoverage = numRegions > 0 ? totalCoverage / numRegions : 0;

        return {
            colorAccuracy: Math.round(avgColorAccuracy),
            coverage: Math.round(avgCoverage),
            regionScores,
        };
    }

    /**
     * Calculate overall score from metrics
     */
    calculateScore(metrics: TColorMetrics): number {
        // Weighted: color accuracy 70%, coverage 30%
        const score = metrics.colorAccuracy * 0.7 + metrics.coverage * 0.3;
        return Math.round(Math.max(0, Math.min(100, score)));
    }

    /**
     * Analyze a single region for quick feedback
     */
    analyzeRegion(
        imageData: ImageData,
        region: TColorRegion,
        tolerance: number
    ): { colorScore: number; coverage: number; userColor: TRgb | null } {
        const userColor = getDominantColorInRegion(imageData, region.bounds);
        const coverage = calculateCoverage(imageData, region.bounds);

        let colorScore = 0;
        if (userColor) {
            const deltaE = colorDifference(userColor, region.targetColor);
            colorScore = deltaEToScore(deltaE, tolerance);
        }

        return { colorScore, coverage, userColor };
    }
}

// Singleton instance
export const colorAnalyzer = new ColorAnalyzer();
