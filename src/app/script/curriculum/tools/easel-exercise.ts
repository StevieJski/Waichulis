/**
 * Easel Exercise Tool
 * Custom easel tool for exercise mode that captures strokes and provides feedback
 */

import { BB } from '../../bb/bb';
import { TPointerEvent } from '../../bb/input/event.types';
import { createMatrixFromTransform } from '../../bb/transform/create-matrix-from-transform';
import { applyToPoint, inverse } from 'transformation-matrix';
import { TViewportTransform } from '../../klecks/ui/project-viewport/project-viewport';
import { TEaselInterface, TEaselTool } from '../../klecks/ui/easel/easel.types';
import { TVector2D } from '../../bb/bb-types';
import {
    TExercise,
    TStroke,
    TStrokeData,
    TStrokePoint,
    TDotsConfig,
    TLineConfig,
    TRgb,
} from '../types';
import { ExerciseOverlay } from './exercise-overlay';
import { parseSvgPath } from '../assessment/stroke-analyzer';

// ============================================================================
// Types
// ============================================================================

export type TEaselExerciseParams = {
    canvasWidth: number;
    canvasHeight: number;
    brushColor: TRgb;
    brushSize: number;
    onStrokeStart: (x: number, y: number, pressure: number) => void;
    onStrokeMove: (x: number, y: number, pressure: number, isCoalesced: boolean) => void;
    onStrokeEnd: () => void;
    onExerciseComplete: (strokeData: TStrokeData) => void;
    onDotHit?: (dotId: string) => void;
};

// ============================================================================
// Easel Exercise Tool Class
// ============================================================================

export class EaselExercise implements TEaselTool {
    private readonly svgEl: SVGElement;
    private readonly overlay: ExerciseOverlay;
    private easel: TEaselInterface = {} as TEaselInterface;
    private params: TEaselExerciseParams;

    private exercise: TExercise | null = null;
    private isDrawing: boolean = false;
    private strokeData: TStrokeData = {
        strokes: [],
        startTime: 0,
        endTime: 0,
    };
    private currentStroke: TStroke | null = null;

    // For connect-the-dots tracking
    private hitDots: Set<string> = new Set();
    private lastHitDot: string | null = null;

    // Real-time feedback
    private targetPath: TVector2D[] = [];
    private feedbackEnabled: boolean = true;

    constructor(params: TEaselExerciseParams) {
        this.params = params;

        // Create root SVG element
        this.svgEl = BB.createSvg({
            elementType: 'g',
        });

        // Create exercise overlay
        this.overlay = new ExerciseOverlay(params.canvasWidth, params.canvasHeight);
    }

    // ----------------------------------- Public API -----------------------------------

    /**
     * Set the current exercise
     */
    setExercise(exercise: TExercise): void {
        this.exercise = exercise;
        this.resetStrokeData();
        this.hitDots.clear();
        this.lastHitDot = null;

        // Configure overlay
        this.overlay.setExercise(exercise);

        // Parse target path for real-time feedback (line exercises)
        if (exercise.config.type === 'line') {
            const config = exercise.config as TLineConfig;
            this.targetPath = parseSvgPath(config.targetPath);
        } else {
            this.targetPath = [];
        }
    }

    /**
     * Clear the current exercise
     */
    clearExercise(): void {
        this.exercise = null;
        this.resetStrokeData();
        this.hitDots.clear();
        this.overlay.clearExercise();
        this.targetPath = [];
    }

    /**
     * Get the collected stroke data
     */
    getStrokeData(): TStrokeData {
        return {
            ...this.strokeData,
            endTime: Date.now(),
        };
    }

    /**
     * Reset stroke data for a new attempt
     */
    resetStrokeData(): void {
        this.strokeData = {
            strokes: [],
            startTime: 0,
            endTime: 0,
        };
        this.currentStroke = null;
    }

    /**
     * Get the overlay element
     */
    getOverlayElement(): SVGSVGElement {
        return this.overlay.getElement();
    }

    /**
     * Enable/disable real-time feedback
     */
    setFeedbackEnabled(enabled: boolean): void {
        this.feedbackEnabled = enabled;
    }

    /**
     * Update brush settings
     */
    setBrushSettings(color: TRgb, size: number): void {
        this.params.brushColor = color;
        this.params.brushSize = size;
    }

    /**
     * Update canvas size
     */
    setCanvasSize(width: number, height: number): void {
        this.params.canvasWidth = width;
        this.params.canvasHeight = height;
        this.overlay.setSize(width, height);
    }

    // ----------------------------------- TEaselTool Implementation -----------------------------------

    getSvgElement(): SVGElement {
        return this.svgEl;
    }

    setEaselInterface(easelInterface: TEaselInterface): void {
        this.easel = easelInterface;
    }

    activate(cursorPos?: TVector2D): void {
        this.easel.setCursor('crosshair');
    }

    getIsLocked(): boolean {
        return this.isDrawing;
    }

    onPointer(e: TPointerEvent): void {
        const vTransform = this.easel.getTransform();
        const m = createMatrixFromTransform(vTransform);
        // Convert to canvas coordinates
        const p = applyToPoint(inverse(m), { x: e.relX, y: e.relY });
        const x = p.x;
        const y = p.y;
        const pressure = e.pressure ?? 1;
        const timestamp = Date.now();

        if (e.type === 'pointerdown' && e.button === 'left') {
            this.startStroke(x, y, pressure, timestamp);
            this.params.onStrokeStart(x, y, pressure);
            this.isDrawing = true;
            this.easel.setCursor('crosshair');
        }

        if (e.type === 'pointermove' && e.button === 'left' && this.isDrawing) {
            this.continueStroke(x, y, pressure, timestamp, e.isCoalesced ?? false);
            this.params.onStrokeMove(x, y, pressure, e.isCoalesced ?? false);
        }

        if (e.type === 'pointerup' && e.button === undefined && this.isDrawing) {
            this.endStroke(timestamp);
            this.params.onStrokeEnd();
            this.isDrawing = false;
        }
    }

    onPointerLeave(): void {
        this.easel.setCursor('crosshair');
    }

    onUpdateTransform(transform: TViewportTransform): void {
        // Could update overlay position based on transform if needed
    }

    // ----------------------------------- Stroke Handling -----------------------------------

    private startStroke(x: number, y: number, pressure: number, timestamp: number): void {
        if (this.strokeData.strokes.length === 0) {
            this.strokeData.startTime = timestamp;
        }

        this.currentStroke = {
            id: `stroke-${this.strokeData.strokes.length}`,
            points: [{ x, y, pressure, timestamp }],
            color: { ...this.params.brushColor },
            size: this.params.brushSize,
        };

        // Check for dot hits
        this.checkDotHit(x, y);

        // Real-time feedback
        if (this.feedbackEnabled && this.targetPath.length > 0) {
            this.showRealTimeFeedback(x, y);
        }
    }

    private continueStroke(
        x: number,
        y: number,
        pressure: number,
        timestamp: number,
        isCoalesced: boolean
    ): void {
        if (!this.currentStroke) return;

        this.currentStroke.points.push({ x, y, pressure, timestamp });

        // Check for dot hits
        this.checkDotHit(x, y);

        // Real-time feedback (not on coalesced events to save performance)
        if (this.feedbackEnabled && this.targetPath.length > 0 && !isCoalesced) {
            this.showRealTimeFeedback(x, y);
        }
    }

    private endStroke(timestamp: number): void {
        if (!this.currentStroke) return;

        this.strokeData.strokes.push(this.currentStroke);
        this.strokeData.endTime = timestamp;
        this.currentStroke = null;

        // Check if exercise is complete (for connect-the-dots)
        if (this.exercise?.config.type === 'dots') {
            const config = this.exercise.config as TDotsConfig;
            if (this.hitDots.size >= config.dots.length) {
                this.params.onExerciseComplete(this.getStrokeData());
            }
        }
    }

    // ----------------------------------- Dot Hit Detection -----------------------------------

    private checkDotHit(x: number, y: number): void {
        if (!this.exercise || this.exercise.config.type !== 'dots') return;

        const config = this.exercise.config as TDotsConfig;

        for (const dot of config.dots) {
            if (this.hitDots.has(dot.id)) continue;

            const dist = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
            if (dist <= config.dotRadius) {
                // Check order if required
                if (config.requireOrder) {
                    const dotIndex = config.dots.findIndex((d) => d.id === dot.id);
                    const lastHitIndex = this.lastHitDot
                        ? config.dots.findIndex((d) => d.id === this.lastHitDot)
                        : -1;

                    // Allow hitting if it's the next dot in sequence or the first dot
                    if (dotIndex !== lastHitIndex + 1 && this.hitDots.size > 0) {
                        continue;
                    }
                }

                this.hitDots.add(dot.id);
                this.lastHitDot = dot.id;
                this.overlay.markDotHit(dot.id);

                if (this.params.onDotHit) {
                    this.params.onDotHit(dot.id);
                }
                break;
            }
        }
    }

    // ----------------------------------- Real-time Feedback -----------------------------------

    private showRealTimeFeedback(x: number, y: number): void {
        if (this.targetPath.length === 0) return;

        // Find closest point on target path
        let minDist = Infinity;
        for (const targetPoint of this.targetPath) {
            const dist = Math.sqrt((x - targetPoint.x) ** 2 + (y - targetPoint.y) ** 2);
            if (dist < minDist) {
                minDist = dist;
            }
        }

        // Determine quality based on distance and exercise tolerance
        let quality: 'good' | 'okay' | 'poor';
        const config = this.exercise?.config as TLineConfig | undefined;
        const tolerance = config?.tolerance ?? 20;

        if (minDist <= tolerance * 0.5) {
            quality = 'good';
        } else if (minDist <= tolerance) {
            quality = 'okay';
        } else {
            quality = 'poor';
        }

        this.overlay.showPointFeedback({ x, y }, quality);
    }

    // ----------------------------------- Cleanup -----------------------------------

    destroy(): void {
        this.overlay.destroy();
    }
}
