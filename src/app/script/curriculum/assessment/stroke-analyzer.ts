/**
 * Stroke Analyzer
 * Analyzes user strokes against target paths using Dynamic Time Warping (DTW)
 */

import {
    TLineConfig,
    TLineMetrics,
    TPoint,
    TStroke,
    TStrokeData,
} from '../types';

// ============================================================================
// SVG Path Parsing
// ============================================================================

/**
 * Parse SVG path data into an array of points
 */
export function parseSvgPath(pathData: string): TPoint[] {
    const points: TPoint[] = [];
    const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];

    let currentX = 0;
    let currentY = 0;
    let startX = 0;
    let startY = 0;

    for (const cmd of commands) {
        const type = cmd[0].toUpperCase();
        const isRelative = cmd[0] === cmd[0].toLowerCase();
        const args = cmd
            .slice(1)
            .trim()
            .split(/[\s,]+/)
            .map(parseFloat)
            .filter((n) => !isNaN(n));

        switch (type) {
            case 'M': // Move to
                if (isRelative) {
                    currentX += args[0];
                    currentY += args[1];
                } else {
                    currentX = args[0];
                    currentY = args[1];
                }
                startX = currentX;
                startY = currentY;
                points.push({ x: currentX, y: currentY });
                break;

            case 'L': // Line to
                if (isRelative) {
                    currentX += args[0];
                    currentY += args[1];
                } else {
                    currentX = args[0];
                    currentY = args[1];
                }
                points.push({ x: currentX, y: currentY });
                break;

            case 'H': // Horizontal line
                currentX = isRelative ? currentX + args[0] : args[0];
                points.push({ x: currentX, y: currentY });
                break;

            case 'V': // Vertical line
                currentY = isRelative ? currentY + args[0] : args[0];
                points.push({ x: currentX, y: currentY });
                break;

            case 'Q': // Quadratic bezier
                {
                    const cx = isRelative ? currentX + args[0] : args[0];
                    const cy = isRelative ? currentY + args[1] : args[1];
                    const endX = isRelative ? currentX + args[2] : args[2];
                    const endY = isRelative ? currentY + args[3] : args[3];

                    // Sample the bezier curve
                    const samples = sampleQuadraticBezier(
                        { x: currentX, y: currentY },
                        { x: cx, y: cy },
                        { x: endX, y: endY },
                        10
                    );
                    points.push(...samples.slice(1));
                    currentX = endX;
                    currentY = endY;
                }
                break;

            case 'C': // Cubic bezier
                {
                    const c1x = isRelative ? currentX + args[0] : args[0];
                    const c1y = isRelative ? currentY + args[1] : args[1];
                    const c2x = isRelative ? currentX + args[2] : args[2];
                    const c2y = isRelative ? currentY + args[3] : args[3];
                    const endX = isRelative ? currentX + args[4] : args[4];
                    const endY = isRelative ? currentY + args[5] : args[5];

                    const samples = sampleCubicBezier(
                        { x: currentX, y: currentY },
                        { x: c1x, y: c1y },
                        { x: c2x, y: c2y },
                        { x: endX, y: endY },
                        10
                    );
                    points.push(...samples.slice(1));
                    currentX = endX;
                    currentY = endY;
                }
                break;

            case 'Z': // Close path
                if (currentX !== startX || currentY !== startY) {
                    points.push({ x: startX, y: startY });
                    currentX = startX;
                    currentY = startY;
                }
                break;
        }
    }

    return points;
}

function sampleQuadraticBezier(
    p0: TPoint,
    p1: TPoint,
    p2: TPoint,
    segments: number
): TPoint[] {
    const points: TPoint[] = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const oneMinusT = 1 - t;
        points.push({
            x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
            y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y,
        });
    }
    return points;
}

function sampleCubicBezier(
    p0: TPoint,
    p1: TPoint,
    p2: TPoint,
    p3: TPoint,
    segments: number
): TPoint[] {
    const points: TPoint[] = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const oneMinusT = 1 - t;
        const t2 = t * t;
        const t3 = t2 * t;
        const oneMinusT2 = oneMinusT * oneMinusT;
        const oneMinusT3 = oneMinusT2 * oneMinusT;
        points.push({
            x: oneMinusT3 * p0.x + 3 * oneMinusT2 * t * p1.x + 3 * oneMinusT * t2 * p2.x + t3 * p3.x,
            y: oneMinusT3 * p0.y + 3 * oneMinusT2 * t * p1.y + 3 * oneMinusT * t2 * p2.y + t3 * p3.y,
        });
    }
    return points;
}

// ============================================================================
// Dynamic Time Warping (DTW)
// ============================================================================

/**
 * Calculate Euclidean distance between two points
 */
function pointDistance(p1: TPoint, p2: TPoint): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Dynamic Time Warping algorithm
 * Returns the DTW distance and the warping path
 */
export function dtw(
    seq1: TPoint[],
    seq2: TPoint[]
): { distance: number; path: [number, number][] } {
    const n = seq1.length;
    const m = seq2.length;

    if (n === 0 || m === 0) {
        return { distance: Infinity, path: [] };
    }

    // Cost matrix
    const cost: number[][] = Array(n)
        .fill(null)
        .map(() => Array(m).fill(Infinity));

    // Initialize first cell
    cost[0][0] = pointDistance(seq1[0], seq2[0]);

    // Fill first column
    for (let i = 1; i < n; i++) {
        cost[i][0] = cost[i - 1][0] + pointDistance(seq1[i], seq2[0]);
    }

    // Fill first row
    for (let j = 1; j < m; j++) {
        cost[0][j] = cost[0][j - 1] + pointDistance(seq1[0], seq2[j]);
    }

    // Fill rest of the matrix
    for (let i = 1; i < n; i++) {
        for (let j = 1; j < m; j++) {
            const d = pointDistance(seq1[i], seq2[j]);
            cost[i][j] = d + Math.min(cost[i - 1][j], cost[i][j - 1], cost[i - 1][j - 1]);
        }
    }

    // Backtrack to find the path
    const path: [number, number][] = [];
    let i = n - 1;
    let j = m - 1;
    path.push([i, j]);

    while (i > 0 || j > 0) {
        if (i === 0) {
            j--;
        } else if (j === 0) {
            i--;
        } else {
            const minCost = Math.min(cost[i - 1][j], cost[i][j - 1], cost[i - 1][j - 1]);
            if (cost[i - 1][j - 1] === minCost) {
                i--;
                j--;
            } else if (cost[i - 1][j] === minCost) {
                i--;
            } else {
                j--;
            }
        }
        path.push([i, j]);
    }

    path.reverse();
    return { distance: cost[n - 1][m - 1], path };
}

// ============================================================================
// Stroke Analysis
// ============================================================================

/**
 * Resample a stroke to have evenly spaced points
 */
export function resampleStroke(stroke: TStroke, numPoints: number): TPoint[] {
    const points = stroke.points.map((p) => ({ x: p.x, y: p.y }));
    if (points.length < 2) return points;

    // Calculate total length
    let totalLength = 0;
    for (let i = 1; i < points.length; i++) {
        totalLength += pointDistance(points[i - 1], points[i]);
    }

    if (totalLength === 0) return [points[0]];

    const interval = totalLength / (numPoints - 1);
    const resampled: TPoint[] = [points[0]];
    let accumulatedLength = 0;
    let prevPoint = points[0];

    for (let i = 1; i < points.length && resampled.length < numPoints; i++) {
        const segmentLength = pointDistance(prevPoint, points[i]);

        while (accumulatedLength + segmentLength >= interval * resampled.length && resampled.length < numPoints) {
            const t = (interval * resampled.length - accumulatedLength) / segmentLength;
            resampled.push({
                x: prevPoint.x + t * (points[i].x - prevPoint.x),
                y: prevPoint.y + t * (points[i].y - prevPoint.y),
            });
        }

        accumulatedLength += segmentLength;
        prevPoint = points[i];
    }

    // Ensure we have exactly numPoints
    while (resampled.length < numPoints) {
        resampled.push(points[points.length - 1]);
    }

    return resampled;
}

/**
 * Calculate smoothness of a stroke (lower angle variance = smoother)
 */
export function calculateSmoothness(stroke: TStroke): number {
    const points = stroke.points;
    if (points.length < 3) return 100;

    const angles: number[] = [];
    for (let i = 1; i < points.length - 1; i++) {
        const dx1 = points[i].x - points[i - 1].x;
        const dy1 = points[i].y - points[i - 1].y;
        const dx2 = points[i + 1].x - points[i].x;
        const dy2 = points[i + 1].y - points[i].y;

        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (len1 > 0 && len2 > 0) {
            const dot = dx1 * dx2 + dy1 * dy2;
            const cosAngle = Math.max(-1, Math.min(1, dot / (len1 * len2)));
            const angle = Math.acos(cosAngle);
            angles.push(angle);
        }
    }

    if (angles.length === 0) return 100;

    // Calculate variance of angles
    const mean = angles.reduce((a, b) => a + b, 0) / angles.length;
    const variance = angles.reduce((sum, angle) => sum + (angle - mean) ** 2, 0) / angles.length;

    // Convert variance to a 0-100 score (lower variance = higher score)
    // Typical variance for smooth lines is < 0.1, for jagged lines > 0.5
    const maxVariance = 0.5;
    const smoothness = Math.max(0, 100 * (1 - Math.sqrt(variance) / Math.sqrt(maxVariance)));

    return Math.round(smoothness);
}

/**
 * Calculate completeness (how much of the target path was covered)
 */
export function calculateCompleteness(
    userPoints: TPoint[],
    targetPoints: TPoint[],
    tolerance: number
): number {
    if (targetPoints.length === 0) return 100;

    let coveredCount = 0;

    for (const targetPoint of targetPoints) {
        for (const userPoint of userPoints) {
            if (pointDistance(targetPoint, userPoint) <= tolerance) {
                coveredCount++;
                break;
            }
        }
    }

    return Math.round((coveredCount / targetPoints.length) * 100);
}

// ============================================================================
// Main Analyzer Class
// ============================================================================

export class StrokeAnalyzer {
    /**
     * Analyze strokes against a line exercise configuration
     */
    analyze(strokeData: TStrokeData, config: TLineConfig): TLineMetrics {
        // Parse target path
        const targetPoints = parseSvgPath(config.targetPath);

        // Combine all user strokes into one sequence
        const userPoints: TPoint[] = [];
        for (const stroke of strokeData.strokes) {
            for (const point of stroke.points) {
                userPoints.push({ x: point.x, y: point.y });
            }
        }

        if (userPoints.length === 0) {
            return {
                pathAccuracy: 0,
                smoothness: 0,
                completeness: 0,
                avgDeviation: Infinity,
            };
        }

        // Resample both sequences for fair comparison
        const numSamples = Math.max(50, Math.min(targetPoints.length, userPoints.length));
        const resampledTarget = this.resamplePoints(targetPoints, numSamples);
        const resampledUser = this.resamplePoints(userPoints, numSamples);

        // Calculate DTW distance
        const { distance, path } = dtw(resampledUser, resampledTarget);

        // Calculate average deviation along the path
        let totalDeviation = 0;
        for (const [i, j] of path) {
            totalDeviation += pointDistance(resampledUser[i], resampledTarget[j]);
        }
        const avgDeviation = path.length > 0 ? totalDeviation / path.length : Infinity;

        // Convert to 0-100 score based on tolerance
        // If avgDeviation <= tolerance/2, score is 100
        // If avgDeviation >= tolerance*2, score is 0
        const pathAccuracy = Math.max(
            0,
            Math.min(100, 100 * (1 - (avgDeviation - config.tolerance / 2) / (config.tolerance * 1.5)))
        );

        // Calculate smoothness (average across all strokes)
        let totalSmoothness = 0;
        for (const stroke of strokeData.strokes) {
            totalSmoothness += calculateSmoothness(stroke);
        }
        const smoothness =
            strokeData.strokes.length > 0 ? totalSmoothness / strokeData.strokes.length : 0;

        // Calculate completeness
        const completeness = calculateCompleteness(userPoints, targetPoints, config.tolerance);

        return {
            pathAccuracy: Math.round(pathAccuracy),
            smoothness: Math.round(smoothness),
            completeness,
            avgDeviation: Math.round(avgDeviation * 10) / 10,
        };
    }

    /**
     * Calculate overall score from metrics
     */
    calculateScore(metrics: TLineMetrics): number {
        // Weighted average: path accuracy 50%, smoothness 25%, completeness 25%
        const score = metrics.pathAccuracy * 0.5 + metrics.smoothness * 0.25 + metrics.completeness * 0.25;
        return Math.round(Math.max(0, Math.min(100, score)));
    }

    private resamplePoints(points: TPoint[], numPoints: number): TPoint[] {
        if (points.length < 2) return points;

        // Calculate total length
        let totalLength = 0;
        for (let i = 1; i < points.length; i++) {
            totalLength += pointDistance(points[i - 1], points[i]);
        }

        if (totalLength === 0) return [points[0]];

        const interval = totalLength / (numPoints - 1);
        const resampled: TPoint[] = [points[0]];
        let accumulatedLength = 0;
        let prevPoint = points[0];

        for (let i = 1; i < points.length && resampled.length < numPoints; i++) {
            const segmentLength = pointDistance(prevPoint, points[i]);

            while (
                accumulatedLength + segmentLength >= interval * resampled.length &&
                resampled.length < numPoints
            ) {
                const t = (interval * resampled.length - accumulatedLength) / segmentLength;
                resampled.push({
                    x: prevPoint.x + t * (points[i].x - prevPoint.x),
                    y: prevPoint.y + t * (points[i].y - prevPoint.y),
                });
            }

            accumulatedLength += segmentLength;
            prevPoint = points[i];
        }

        while (resampled.length < numPoints) {
            resampled.push(points[points.length - 1]);
        }

        return resampled;
    }
}

// Singleton instance
export const strokeAnalyzer = new StrokeAnalyzer();
