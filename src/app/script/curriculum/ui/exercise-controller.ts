/**
 * Exercise Controller
 * Orchestrates the complete exercise flow: setup, drawing, assessment, and results
 */

import { BB } from '../../bb/bb';
import {
    TExercise,
    TStrokeData,
    TFullAssessment,
    TGradeLevel,
} from '../types';
import { progressStore } from '../storage/progress-store';
import { assessmentOrchestrator } from '../assessment/assessment-orchestrator';
import { llmClient } from '../api/llm-client';
import { ExerciseOverlay } from '../tools/exercise-overlay';
import { ExercisePanel } from './exercise-panel';
import { showAssessmentModal } from './assessment-modal';
import {
    getExerciseById,
    getLessonById,
    getCurriculum,
    getGradeForExercise,
} from '../data/index';

// ============================================================================
// Types
// ============================================================================

export type TExerciseControllerParams = {
    containerEl: HTMLElement;
    canvasEl: HTMLCanvasElement;
    gradeLevel: TGradeLevel;
    onExerciseStart: (exercise: TExercise) => void;
    onExerciseEnd: () => void;
    onStrokeStart: (x: number, y: number, pressure: number) => void;
    onStrokeMove: (x: number, y: number, pressure: number, isCoalesced: boolean) => void;
    onStrokeEnd: () => void;
    onClearCanvas: () => void;
    getCanvasImageData: () => ImageData;
};

export type TExerciseState = 'idle' | 'active' | 'submitting' | 'results';

// ============================================================================
// Exercise Controller Class
// ============================================================================

export class ExerciseController {
    private params: TExerciseControllerParams;
    private state: TExerciseState = 'idle';
    private currentExercise: TExercise | null = null;
    private overlay: ExerciseOverlay | null = null;
    private panel: ExercisePanel | null = null;
    private attemptNumber: number = 0;

    // Stroke tracking
    private strokeData: TStrokeData = {
        strokes: [],
        startTime: 0,
        endTime: 0,
    };
    private currentStrokePoints: { x: number; y: number; pressure: number; timestamp: number }[] = [];
    private hasDrawn: boolean = false;

    constructor(params: TExerciseControllerParams) {
        this.params = params;
    }

    // ----------------------------------- Public API -----------------------------------

    /**
     * Start an exercise
     */
    startExercise(exercise: TExercise): void {
        if (this.state !== 'idle') {
            this.endExercise();
        }

        this.currentExercise = exercise;
        this.state = 'active';
        this.attemptNumber = assessmentOrchestrator.getAttemptCount(exercise.id) + 1;
        this.resetStrokeData();

        // Create overlay
        const canvasWidth = exercise.config.canvasWidth;
        const canvasHeight = exercise.config.canvasHeight;
        this.overlay = new ExerciseOverlay(canvasWidth, canvasHeight);
        this.overlay.setExercise(exercise);

        // Position overlay over canvas
        const overlayEl = this.overlay.getElement();
        overlayEl.style.position = 'absolute';
        overlayEl.style.top = '0';
        overlayEl.style.left = '0';
        this.params.containerEl.style.position = 'relative';
        this.params.containerEl.appendChild(overlayEl);

        // Create exercise panel
        this.panel = new ExercisePanel({
            onSubmit: () => this.submitExercise(),
            onCancel: () => this.endExercise(),
            onClear: () => this.clearAttempt(),
            onGetHelp: () => this.showHelp(),
        });
        this.panel.setExercise(exercise);
        this.panel.setVisible(true);
        this.params.containerEl.appendChild(this.panel.getElement());

        // Notify callback
        this.params.onExerciseStart(exercise);
    }

    /**
     * End the current exercise
     */
    endExercise(): void {
        this.state = 'idle';
        this.currentExercise = null;

        // Clean up overlay
        if (this.overlay) {
            this.overlay.destroy();
            this.overlay = null;
        }

        // Clean up panel
        if (this.panel) {
            this.panel.destroy();
            this.panel = null;
        }

        this.resetStrokeData();
        this.params.onExerciseEnd();
    }

    /**
     * Get current state
     */
    getState(): TExerciseState {
        return this.state;
    }

    /**
     * Check if exercise mode is active
     */
    isActive(): boolean {
        return this.state === 'active';
    }

    /**
     * Handle stroke start event
     */
    handleStrokeStart(x: number, y: number, pressure: number): void {
        if (this.state !== 'active') return;

        const timestamp = Date.now();

        if (this.strokeData.strokes.length === 0) {
            this.strokeData.startTime = timestamp;
        }

        this.currentStrokePoints = [{ x, y, pressure, timestamp }];
        this.hasDrawn = true;

        if (this.panel) {
            this.panel.setHasDrawn(true);
        }

        // Check for dot hits
        this.checkDotHit(x, y);

        // Show real-time feedback
        this.showRealTimeFeedback(x, y);

        // Forward to callback
        this.params.onStrokeStart(x, y, pressure);
    }

    /**
     * Handle stroke move event
     */
    handleStrokeMove(x: number, y: number, pressure: number, isCoalesced: boolean): void {
        if (this.state !== 'active') return;

        const timestamp = Date.now();
        this.currentStrokePoints.push({ x, y, pressure, timestamp });

        // Check for dot hits
        this.checkDotHit(x, y);

        // Show real-time feedback (not on coalesced events)
        if (!isCoalesced) {
            this.showRealTimeFeedback(x, y);
        }

        // Forward to callback
        this.params.onStrokeMove(x, y, pressure, isCoalesced);
    }

    /**
     * Handle stroke end event
     */
    handleStrokeEnd(): void {
        if (this.state !== 'active') return;

        // Save current stroke
        if (this.currentStrokePoints.length > 0) {
            this.strokeData.strokes.push({
                id: `stroke-${this.strokeData.strokes.length}`,
                points: [...this.currentStrokePoints],
                color: { r: 0, g: 0, b: 0 }, // Default, could be passed from brush
                size: 5,
            });
            this.strokeData.endTime = Date.now();
            this.currentStrokePoints = [];
        }

        // Forward to callback
        this.params.onStrokeEnd();
    }

    // ----------------------------------- Private Methods -----------------------------------

    private resetStrokeData(): void {
        this.strokeData = {
            strokes: [],
            startTime: 0,
            endTime: 0,
        };
        this.currentStrokePoints = [];
        this.hasDrawn = false;
    }

    private clearAttempt(): void {
        this.resetStrokeData();
        this.params.onClearCanvas();

        if (this.panel) {
            this.panel.setHasDrawn(false);
        }

        if (this.overlay) {
            this.overlay.clearFeedback();
        }

        // Reset dot hits if connect-the-dots
        if (this.currentExercise && this.overlay) {
            this.overlay.setExercise(this.currentExercise);
        }
    }

    private async submitExercise(): Promise<void> {
        if (!this.currentExercise || this.state !== 'active') return;

        this.state = 'submitting';

        // Get canvas image data for color exercises
        let canvasSnapshot: ImageData | undefined;
        if (this.currentExercise.config.type === 'color') {
            canvasSnapshot = this.params.getCanvasImageData();
        }

        try {
            // Run assessment
            const assessment = await assessmentOrchestrator.assess(
                this.currentExercise,
                this.strokeData,
                canvasSnapshot,
                this.params.gradeLevel
            );

            // Record progress
            await progressStore.recordExerciseAttempt(
                this.currentExercise.id,
                this.currentExercise.lessonId,
                this.currentExercise.unit,
                assessment
            );

            // Show results
            this.state = 'results';
            await this.showResults(assessment);
        } catch (error) {
            console.error('ExerciseController: Assessment failed', error);
            this.state = 'active';
            // Could show error modal here
        }
    }

    private async showResults(assessment: TFullAssessment): Promise<void> {
        if (!this.currentExercise) return;

        const result = await showAssessmentModal({
            target: document.body,
            exercise: this.currentExercise,
            assessment,
            attemptNumber: this.attemptNumber,
            onTryAgain: () => {},
            onNextExercise: () => {},
        });

        if (result === 'tryAgain') {
            // Restart same exercise
            const exercise = this.currentExercise;
            this.endExercise();
            this.startExercise(exercise);
        } else if (result === 'next') {
            // Find and start next exercise
            const nextExercise = this.findNextExercise(this.currentExercise);
            this.endExercise();
            if (nextExercise) {
                this.startExercise(nextExercise);
            }
        } else {
            // Closed without action
            this.endExercise();
        }
    }

    private findNextExercise(currentExercise: TExercise): TExercise | null {
        const lesson = getLessonById(currentExercise.lessonId);
        if (!lesson) return null;

        const currentIndex = lesson.exercises.findIndex((e) => e.id === currentExercise.id);
        if (currentIndex >= 0 && currentIndex < lesson.exercises.length - 1) {
            return lesson.exercises[currentIndex + 1];
        }

        // Get the curriculum for this exercise's grade
        const gradeLevel = getGradeForExercise(currentExercise.id);
        if (!gradeLevel) return null;

        const curriculum = getCurriculum(gradeLevel);
        if (!curriculum) return null;

        // End of lesson - find next lesson
        const unit = curriculum.units.find((u) => u.id === lesson.unit);
        if (!unit) return null;

        const lessonIndex = unit.lessons.findIndex((l) => l.id === lesson.id);
        if (lessonIndex >= 0 && lessonIndex < unit.lessons.length - 1) {
            const nextLesson = unit.lessons[lessonIndex + 1];
            return nextLesson.exercises[0] || null;
        }

        // End of unit - find next unit
        const unitIndex = curriculum.units.findIndex((u) => u.id === unit.id);
        if (unitIndex >= 0 && unitIndex < curriculum.units.length - 1) {
            const nextUnit = curriculum.units[unitIndex + 1];
            if (nextUnit.lessons.length > 0 && nextUnit.lessons[0].exercises.length > 0) {
                return nextUnit.lessons[0].exercises[0];
            }
        }

        return null;
    }

    private async showHelp(): Promise<void> {
        if (!this.currentExercise) return;

        const exerciseProgress = progressStore.getExerciseProgress(
            this.currentExercise.id,
            this.currentExercise.lessonId,
            this.currentExercise.unit
        );

        const lastScore = exerciseProgress?.assessments.length
            ? exerciseProgress.assessments[exerciseProgress.assessments.length - 1].score
            : 0;

        try {
            const help = await llmClient.getHelp({
                exerciseType: this.currentExercise.unit,
                exerciseTitle: this.currentExercise.title,
                exerciseInstructions: this.currentExercise.instructions,
                feedbackHints: this.currentExercise.feedbackHints,
                attemptNumber: this.attemptNumber,
                lastScore,
                studentGradeLevel: this.params.gradeLevel,
            });

            // Show help in a simple alert for now (could be a modal)
            const helpText = [
                help.encouragement,
                '',
                'Tips:',
                ...help.tips.map((t) => `• ${t}`),
                '',
                help.demonstration,
            ].join('\n');

            alert(helpText);
        } catch (error) {
            console.error('ExerciseController: Failed to get help', error);
        }
    }

    private checkDotHit(x: number, y: number): void {
        if (!this.currentExercise || this.currentExercise.config.type !== 'dots') return;
        if (!this.overlay) return;

        const config = this.currentExercise.config;
        if (config.type !== 'dots') return;

        for (const dot of config.dots) {
            const dist = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
            if (dist <= config.dotRadius) {
                this.overlay.markDotHit(dot.id);
                break;
            }
        }
    }

    private showRealTimeFeedback(x: number, y: number): void {
        if (!this.currentExercise || !this.overlay) return;
        if (this.currentExercise.config.type !== 'line') return;

        // Real-time feedback is handled by the overlay
        // Could be enhanced here with more sophisticated feedback
    }

    destroy(): void {
        this.endExercise();
    }
}
