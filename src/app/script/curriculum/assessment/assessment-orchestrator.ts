/**
 * Assessment Orchestrator
 * Combines local assessment algorithms with LLM feedback
 */

import {
    TExercise,
    TStrokeData,
    TFullAssessment,
    TLocalAssessment,
    TAssessmentMetrics,
    TFeedbackResponse,
    TLineConfig,
    TShapeConfig,
    TColorConfig,
    TDotsConfig,
    TLineMetrics,
    TShapeMetrics,
    TColorMetrics,
    TDotsMetrics,
    TGradeLevel,
} from '../types';
import { strokeAnalyzer } from './stroke-analyzer';
import { shapeAnalyzer } from './shape-analyzer';
import { colorAnalyzer } from './color-analyzer';
import { llmClient } from '../api/llm-client';
import { getFallbackFeedback } from '../api/prompt-templates';

// ============================================================================
// Connect-the-Dots Analyzer (inline for simplicity)
// ============================================================================

function analyzeDotsExercise(
    strokeData: TStrokeData,
    config: TDotsConfig
): { metrics: TDotsMetrics; score: number } {
    const dots = config.dots;
    const hitDots = new Set<string>();
    const hitOrder: string[] = [];

    // Combine all stroke points
    const allPoints: { x: number; y: number }[] = [];
    for (const stroke of strokeData.strokes) {
        for (const point of stroke.points) {
            allPoints.push({ x: point.x, y: point.y });
        }
    }

    // Check which dots were hit and in what order
    for (const point of allPoints) {
        for (const dot of dots) {
            if (hitDots.has(dot.id)) continue;

            const dist = Math.sqrt((point.x - dot.x) ** 2 + (point.y - dot.y) ** 2);
            if (dist <= config.dotRadius) {
                hitDots.add(dot.id);
                hitOrder.push(dot.id);
                break;
            }
        }
    }

    const dotsHit = hitDots.size;
    const totalDots = dots.length;

    // Calculate order accuracy
    let orderAccuracy = 100;
    if (config.requireOrder && dotsHit > 0) {
        let correctOrderCount = 0;
        const expectedOrder = dots.map((d) => d.id);

        for (let i = 0; i < hitOrder.length; i++) {
            const expectedIdx = expectedOrder.indexOf(hitOrder[i]);
            if (i === 0 || expectedIdx > expectedOrder.indexOf(hitOrder[i - 1])) {
                correctOrderCount++;
            }
        }

        orderAccuracy = Math.round((correctOrderCount / dotsHit) * 100);
    }

    // Connection accuracy (how direct were the connections)
    // For simplicity, base this on the hit rate
    const connectionAccuracy = Math.round((dotsHit / totalDots) * 100);

    const metrics: TDotsMetrics = {
        dotsHit,
        totalDots,
        orderAccuracy,
        connectionAccuracy,
    };

    // Calculate score: dots hit 50%, order 30%, connections 20%
    const hitScore = (dotsHit / totalDots) * 100;
    const score = Math.round(hitScore * 0.5 + orderAccuracy * 0.3 + connectionAccuracy * 0.2);

    return { metrics, score };
}

// ============================================================================
// Assessment Orchestrator Class
// ============================================================================

export class AssessmentOrchestrator {
    private attemptCounts: Map<string, number> = new Map();

    /**
     * Assess an exercise attempt
     */
    async assess(
        exercise: TExercise,
        strokeData: TStrokeData,
        canvasSnapshot?: ImageData,
        gradeLevel: TGradeLevel = 'kindergarten'
    ): Promise<TFullAssessment> {
        // Track attempt count
        const attemptCount = (this.attemptCounts.get(exercise.id) || 0) + 1;
        this.attemptCounts.set(exercise.id, attemptCount);

        // Run local assessment
        const localResult = this.runLocalAssessment(exercise, strokeData, canvasSnapshot);

        // Get LLM feedback (async, with fallback)
        let feedback: TFeedbackResponse;
        try {
            feedback = await this.getLLMFeedback(
                exercise,
                localResult,
                attemptCount,
                gradeLevel,
                canvasSnapshot
            );
        } catch (error) {
            console.warn('AssessmentOrchestrator: LLM feedback failed, using fallback', error);
            feedback = getFallbackFeedback(
                localResult.score,
                exercise.unit,
                exercise.feedbackHints
            );
        }

        return {
            score: localResult.score,
            metrics: localResult.metrics,
            passed: localResult.score >= exercise.passingScore,
            feedback,
            timestamp: Date.now(),
        };
    }

    /**
     * Run local assessment based on exercise type
     */
    private runLocalAssessment(
        exercise: TExercise,
        strokeData: TStrokeData,
        canvasSnapshot?: ImageData
    ): TLocalAssessment {
        const config = exercise.config;

        switch (config.type) {
            case 'line': {
                const metrics = strokeAnalyzer.analyze(strokeData, config as TLineConfig);
                const score = strokeAnalyzer.calculateScore(metrics);
                return {
                    score,
                    metrics,
                    passed: score >= exercise.passingScore,
                };
            }

            case 'dots': {
                const { metrics, score } = analyzeDotsExercise(strokeData, config as TDotsConfig);
                return {
                    score,
                    metrics,
                    passed: score >= exercise.passingScore,
                };
            }

            case 'shape': {
                const metrics = shapeAnalyzer.analyze(strokeData, config as TShapeConfig);
                const score = shapeAnalyzer.calculateScore(metrics);
                return {
                    score,
                    metrics,
                    passed: score >= exercise.passingScore,
                };
            }

            case 'color': {
                if (!canvasSnapshot) {
                    // No image data for color analysis
                    return {
                        score: 0,
                        metrics: {
                            colorAccuracy: 0,
                            coverage: 0,
                            regionScores: [],
                        } as TColorMetrics,
                        passed: false,
                    };
                }
                const metrics = colorAnalyzer.analyze(canvasSnapshot, config as TColorConfig);
                const score = colorAnalyzer.calculateScore(metrics);
                return {
                    score,
                    metrics,
                    passed: score >= exercise.passingScore,
                };
            }

            default:
                return {
                    score: 0,
                    metrics: {} as TAssessmentMetrics,
                    passed: false,
                };
        }
    }

    /**
     * Get LLM feedback for the assessment
     */
    private async getLLMFeedback(
        exercise: TExercise,
        localResult: TLocalAssessment,
        attemptNumber: number,
        gradeLevel: TGradeLevel,
        canvasSnapshot?: ImageData
    ): Promise<TFeedbackResponse> {
        // Convert canvas to base64 if available and LLM supports vision
        let drawingImage: string | undefined;
        if (canvasSnapshot && llmClient.isAvailable()) {
            drawingImage = this.imageDataToBase64(canvasSnapshot);
        }

        return await llmClient.getFeedback({
            exerciseType: exercise.unit,
            exerciseTitle: exercise.title,
            localScore: localResult.score,
            localMetrics: localResult.metrics,
            attemptNumber,
            drawingImage,
            studentGradeLevel: gradeLevel,
            feedbackHints: exercise.feedbackHints,
        });
    }

    /**
     * Convert ImageData to base64 PNG string
     */
    private imageDataToBase64(imageData: ImageData): string {
        const canvas = document.createElement('canvas');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    }

    /**
     * Get the current attempt count for an exercise
     */
    getAttemptCount(exerciseId: string): number {
        return this.attemptCounts.get(exerciseId) || 0;
    }

    /**
     * Reset attempt count for an exercise
     */
    resetAttemptCount(exerciseId: string): void {
        this.attemptCounts.delete(exerciseId);
    }

    /**
     * Reset all attempt counts
     */
    resetAllAttemptCounts(): void {
        this.attemptCounts.clear();
    }
}

// Singleton instance
export const assessmentOrchestrator = new AssessmentOrchestrator();
