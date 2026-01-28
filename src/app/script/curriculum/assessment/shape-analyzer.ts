/**
 * Shape Analyzer
 * Analyzes user-drawn shapes against target shape configurations
 */

import {
    TPoint,
    TBounds,
    TShapeConfig,
    TShapeMetrics,
    TStroke,
    TStrokeData,
} from '../types';

// ============================================================================
// Geometry Utilities
// ============================================================================

/**
 * Calculate distance between two points
 */
function pointDistance(p1: TPoint, p2: TPoint): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the centroid of a set of points
 */
function calculateCentroid(points: TPoint[]): TPoint {
    if (points.length === 0) return { x: 0, y: 0 };

    const sum = points.reduce(
        (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
        { x: 0, y: 0 }
    );

    return {
        x: sum.x / points.length,
        y: sum.y / points.length,
    };
}

/**
 * Calculate bounding box of a set of points
 */
function calculateBoundingBox(points: TPoint[]): TBounds {
    if (points.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const p of points) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

/**
 * Check if a shape is closed (endpoint near startpoint)
 */
function isShapeClosed(points: TPoint[], tolerance: number): boolean {
    if (points.length < 3) return false;

    const first = points[0];
    const last = points[points.length - 1];

    return pointDistance(first, last) <= tolerance;
}

/**
 * Calculate the closedness score (0-100)
 */
function calculateClosedness(points: TPoint[], maxGap: number): number {
    if (points.length < 3) return 0;

    const first = points[0];
    const last = points[points.length - 1];
    const gap = pointDistance(first, last);

    // If gap is 0, score is 100. If gap >= maxGap, score is 0.
    return Math.max(0, Math.min(100, 100 * (1 - gap / maxGap)));
}

// ============================================================================
// Corner Detection (for polygons)
// ============================================================================

/**
 * Detect corners in a stroke using angle-based approach
 */
function detectCorners(points: TPoint[], angleThreshold: number = Math.PI / 4): TPoint[] {
    if (points.length < 3) return points.slice();

    const corners: TPoint[] = [points[0]];

    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        // Calculate vectors
        const dx1 = curr.x - prev.x;
        const dy1 = curr.y - prev.y;
        const dx2 = next.x - curr.x;
        const dy2 = next.y - curr.y;

        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (len1 > 0 && len2 > 0) {
            const dot = dx1 * dx2 + dy1 * dy2;
            const cosAngle = Math.max(-1, Math.min(1, dot / (len1 * len2)));
            const angle = Math.acos(cosAngle);

            // If angle is sharp enough, it's a corner
            if (angle >= angleThreshold) {
                corners.push(curr);
            }
        }
    }

    corners.push(points[points.length - 1]);

    // Simplify corners by removing points too close together
    return simplifyCorners(corners, 20);
}

/**
 * Simplify corners by removing ones too close together
 */
function simplifyCorners(corners: TPoint[], minDistance: number): TPoint[] {
    if (corners.length <= 2) return corners;

    const simplified: TPoint[] = [corners[0]];

    for (let i = 1; i < corners.length; i++) {
        const last = simplified[simplified.length - 1];
        if (pointDistance(corners[i], last) >= minDistance) {
            simplified.push(corners[i]);
        }
    }

    return simplified;
}

/**
 * Match detected corners to expected corners
 */
function matchCorners(
    detected: TPoint[],
    expected: TPoint[],
    tolerance: number
): { matched: number; accuracy: number } {
    if (expected.length === 0) return { matched: 0, accuracy: 100 };

    let matchedCount = 0;
    let totalDistance = 0;
    const usedDetected = new Set<number>();

    for (const exp of expected) {
        let bestDist = Infinity;
        let bestIdx = -1;

        for (let i = 0; i < detected.length; i++) {
            if (usedDetected.has(i)) continue;
            const dist = pointDistance(detected[i], exp);
            if (dist < bestDist) {
                bestDist = dist;
                bestIdx = i;
            }
        }

        if (bestIdx !== -1 && bestDist <= tolerance) {
            matchedCount++;
            usedDetected.add(bestIdx);
            totalDistance += bestDist;
        }
    }

    // Calculate accuracy based on average distance
    const avgDist = matchedCount > 0 ? totalDistance / matchedCount : tolerance;
    const accuracy = Math.max(0, 100 * (1 - avgDist / tolerance));

    return {
        matched: matchedCount,
        accuracy: Math.round(accuracy),
    };
}

// ============================================================================
// Ellipse Fitting (for circles/ovals)
// ============================================================================

/**
 * Calculate how circular a shape is (0-100)
 * Uses the ratio of the standard deviation of distances from center
 */
function calculateRoundness(points: TPoint[], center: TPoint): number {
    if (points.length < 3) return 0;

    const distances = points.map((p) => pointDistance(p, center));
    const avgDist = distances.reduce((a, b) => a + b, 0) / distances.length;

    if (avgDist === 0) return 0;

    const variance = distances.reduce((sum, d) => sum + (d - avgDist) ** 2, 0) / distances.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient of variation (CV) - lower is more circular
    const cv = stdDev / avgDist;

    // Convert to 0-100 score (CV of 0 = 100, CV of 0.5+ = 0)
    return Math.max(0, Math.min(100, 100 * (1 - cv * 2)));
}

/**
 * Check if shape matches an ellipse with given center and radii
 */
function matchEllipse(
    points: TPoint[],
    center: TPoint,
    radiusX: number,
    radiusY: number,
    tolerance: number
): number {
    if (points.length < 3) return 0;

    let totalError = 0;

    for (const p of points) {
        // Calculate expected distance on ellipse at this angle
        const dx = p.x - center.x;
        const dy = p.y - center.y;
        const angle = Math.atan2(dy, dx);

        const expectedX = center.x + radiusX * Math.cos(angle);
        const expectedY = center.y + radiusY * Math.sin(angle);

        const error = pointDistance(p, { x: expectedX, y: expectedY });
        totalError += error;
    }

    const avgError = totalError / points.length;

    // Convert to 0-100 score
    return Math.max(0, Math.min(100, 100 * (1 - avgError / tolerance)));
}

// ============================================================================
// Shape Match Scoring
// ============================================================================

/**
 * Calculate how well a drawn shape matches the target bounds
 */
function calculateBoundsMatch(
    userBounds: TBounds,
    targetBounds: TBounds,
    tolerance: number
): number {
    // Compare position
    const posError = Math.sqrt(
        (userBounds.x - targetBounds.x) ** 2 + (userBounds.y - targetBounds.y) ** 2
    );

    // Compare size
    const sizeErrorW = Math.abs(userBounds.width - targetBounds.width);
    const sizeErrorH = Math.abs(userBounds.height - targetBounds.height);

    const avgTargetSize = (targetBounds.width + targetBounds.height) / 2;
    const normalizedError = (posError + sizeErrorW + sizeErrorH) / (avgTargetSize * 3);

    // Convert to 0-100 score
    return Math.max(0, Math.min(100, 100 * (1 - normalizedError / (tolerance / 100))));
}

/**
 * Calculate aspect ratio similarity
 */
function calculateAspectRatioMatch(
    userBounds: TBounds,
    targetBounds: TBounds
): number {
    if (targetBounds.width === 0 || userBounds.width === 0) return 0;

    const targetRatio = targetBounds.height / targetBounds.width;
    const userRatio = userBounds.height / userBounds.width;

    const ratioDiff = Math.abs(targetRatio - userRatio);

    // Score: ratio diff of 0 = 100, ratio diff of 1 = 0
    return Math.max(0, Math.min(100, 100 * (1 - ratioDiff)));
}

// ============================================================================
// Main Analyzer Class
// ============================================================================

export class ShapeAnalyzer {
    /**
     * Analyze strokes against a shape exercise configuration
     */
    analyze(strokeData: TStrokeData, config: TShapeConfig): TShapeMetrics {
        // Combine all stroke points
        const allPoints: TPoint[] = [];
        for (const stroke of strokeData.strokes) {
            for (const point of stroke.points) {
                allPoints.push({ x: point.x, y: point.y });
            }
        }

        if (allPoints.length < 3) {
            return {
                shapeMatch: 0,
                aspectRatio: 0,
                closedness: 0,
            };
        }

        // Calculate user shape properties
        const userBounds = calculateBoundingBox(allPoints);
        const userCentroid = calculateCentroid(allPoints);

        // Base metrics
        const boundsMatch = calculateBoundsMatch(userBounds, config.targetBounds, config.tolerance * 10);
        const aspectRatioMatch = calculateAspectRatioMatch(userBounds, config.targetBounds);

        // Calculate closedness using appropriate tolerance
        const maxGap = Math.max(config.targetBounds.width, config.targetBounds.height) * 0.15;
        const closedness = calculateClosedness(allPoints, maxGap);

        // Shape-specific analysis
        let shapeMatch: number;
        let cornerAccuracy: number | undefined;
        let roundness: number | undefined;

        switch (config.shapeType) {
            case 'circle':
            case 'oval':
                // For round shapes, measure roundness
                if (config.center && config.radiusX && config.radiusY) {
                    roundness = matchEllipse(
                        allPoints,
                        config.center,
                        config.radiusX,
                        config.radiusY,
                        config.tolerance * 5
                    );
                    shapeMatch = (boundsMatch + roundness + closedness) / 3;
                } else {
                    roundness = calculateRoundness(allPoints, userCentroid);
                    shapeMatch = (boundsMatch + roundness + closedness) / 3;
                }
                break;

            case 'triangle':
            case 'square':
            case 'diamond':
            case 'rectangle':
                // For polygons, detect and match corners
                if (config.expectedCorners) {
                    const detectedCorners = detectCorners(allPoints);
                    const cornerMatch = matchCorners(
                        detectedCorners,
                        config.expectedCorners,
                        config.tolerance * 3
                    );

                    const expectedCount = config.expectedCorners.length;
                    const countScore = Math.max(
                        0,
                        100 - Math.abs(detectedCorners.length - expectedCount) * 20
                    );

                    cornerAccuracy = (cornerMatch.accuracy + countScore) / 2;
                    shapeMatch = (boundsMatch + cornerAccuracy + closedness) / 3;
                } else {
                    shapeMatch = (boundsMatch + aspectRatioMatch + closedness) / 3;
                }
                break;

            default:
                shapeMatch = (boundsMatch + aspectRatioMatch + closedness) / 3;
        }

        return {
            shapeMatch: Math.round(shapeMatch),
            aspectRatio: Math.round(aspectRatioMatch),
            closedness: Math.round(closedness),
            cornerAccuracy,
            roundness,
        };
    }

    /**
     * Calculate overall score from metrics
     */
    calculateScore(metrics: TShapeMetrics): number {
        // Weighted average based on available metrics
        let totalWeight = 0;
        let weightedSum = 0;

        // Shape match is most important
        weightedSum += metrics.shapeMatch * 50;
        totalWeight += 50;

        // Closedness matters
        weightedSum += metrics.closedness * 30;
        totalWeight += 30;

        // Aspect ratio or specific accuracy
        if (metrics.cornerAccuracy !== undefined) {
            weightedSum += metrics.cornerAccuracy * 20;
            totalWeight += 20;
        } else if (metrics.roundness !== undefined) {
            weightedSum += metrics.roundness * 20;
            totalWeight += 20;
        } else {
            weightedSum += metrics.aspectRatio * 20;
            totalWeight += 20;
        }

        return Math.round(weightedSum / totalWeight);
    }
}

// Singleton instance
export const shapeAnalyzer = new ShapeAnalyzer();
