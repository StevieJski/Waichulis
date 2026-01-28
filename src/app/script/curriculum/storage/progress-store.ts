/**
 * Progress Store
 * IndexedDB wrapper for storing curriculum progress
 */

import { KL_INDEXED_DB, CURRICULUM_STORE } from '../../klecks/storage/kl-indexed-db';
import {
    TCurriculumProgress,
    TExerciseProgress,
    TFullAssessment,
    TGradeLevel,
    TLessonProgress,
    TStoredProgress,
    TUnit,
    TUnitProgress,
} from '../types';

// ============================================================================
// UUID Generation
// ============================================================================

function generateUUID(): string {
    // Use crypto.randomUUID if available, otherwise fallback
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// ============================================================================
// Progress Store Class
// ============================================================================

export type TProgressStoreListener = (progress: TCurriculumProgress | undefined) => void;

export class ProgressStore {
    private currentSessionId: string | undefined;
    private cachedProgress: TCurriculumProgress | undefined;
    private listeners: TProgressStoreListener[] = [];
    private initialized = false;

    // ----------------------------------- Initialization -----------------------------------

    /**
     * Initialize the store and load existing progress if available
     */
    async init(): Promise<void> {
        if (this.initialized) return;

        try {
            // Try to load the most recent progress
            const allProgress = (await KL_INDEXED_DB.getAll(CURRICULUM_STORE)) as TStoredProgress[];

            if (allProgress.length > 0) {
                // Sort by timestamp descending and get most recent
                allProgress.sort((a, b) => b.timestamp - a.timestamp);
                this.cachedProgress = allProgress[0].progress;
                this.currentSessionId = this.cachedProgress.sessionId;
            }

            this.initialized = true;
        } catch (e) {
            console.error('ProgressStore: Failed to initialize', e);
            this.initialized = true; // Mark as initialized even on error to prevent repeated attempts
        }
    }

    // ----------------------------------- Session Management -----------------------------------

    /**
     * Start a new learning session
     */
    async startNewSession(gradeLevel: TGradeLevel): Promise<TCurriculumProgress> {
        const sessionId = generateUUID();
        const now = Date.now();

        const progress: TCurriculumProgress = {
            sessionId,
            gradeLevel,
            unitProgress: {
                dot: this.createEmptyUnitProgress('dot'),
                line: this.createEmptyUnitProgress('line'),
                shape: this.createEmptyUnitProgress('shape'),
                color: this.createEmptyUnitProgress('color'),
            },
            createdAt: now,
            updatedAt: now,
        };

        await this.saveProgress(progress);
        this.currentSessionId = sessionId;
        this.cachedProgress = progress;
        this.notifyListeners();

        return progress;
    }

    /**
     * Get the current session's progress
     */
    async getCurrentProgress(): Promise<TCurriculumProgress | undefined> {
        if (!this.initialized) {
            await this.init();
        }
        return this.cachedProgress;
    }

    /**
     * Check if there's an existing session
     */
    async hasExistingSession(): Promise<boolean> {
        if (!this.initialized) {
            await this.init();
        }
        return this.cachedProgress !== undefined;
    }

    // ----------------------------------- Progress Updates -----------------------------------

    /**
     * Record an exercise attempt
     */
    async recordExerciseAttempt(
        exerciseId: string,
        lessonId: string,
        unitId: TUnit,
        assessment: TFullAssessment
    ): Promise<void> {
        if (!this.cachedProgress) {
            throw new Error('No active session. Call startNewSession first.');
        }

        const progress = this.cachedProgress;
        const unitProgress = progress.unitProgress[unitId];

        // Ensure lesson progress exists
        if (!unitProgress.lessonProgress[lessonId]) {
            unitProgress.lessonProgress[lessonId] = {
                lessonId,
                unitId,
                exerciseProgress: {},
                completed: false,
                startedAt: Date.now(),
            };
        }

        const lessonProgress = unitProgress.lessonProgress[lessonId];

        // Ensure exercise progress exists
        if (!lessonProgress.exerciseProgress[exerciseId]) {
            lessonProgress.exerciseProgress[exerciseId] = {
                exerciseId,
                lessonId,
                attempts: 0,
                bestScore: 0,
                passed: false,
                assessments: [],
            };
        }

        const exerciseProgress = lessonProgress.exerciseProgress[exerciseId];

        // Update exercise progress
        exerciseProgress.attempts++;
        exerciseProgress.lastAttempt = assessment.timestamp;
        exerciseProgress.assessments.push(assessment);

        if (assessment.score > exerciseProgress.bestScore) {
            exerciseProgress.bestScore = assessment.score;
        }

        if (assessment.passed && !exerciseProgress.passed) {
            exerciseProgress.passed = true;
        }

        // Update current position
        progress.currentLessonId = lessonId;
        progress.currentExerciseId = exerciseId;
        progress.updatedAt = Date.now();

        // Check for lesson/unit completion
        this.checkLessonCompletion(lessonProgress);
        this.checkUnitCompletion(unitProgress);

        await this.saveProgress(progress);
        this.notifyListeners();
    }

    /**
     * Set the current exercise being worked on
     */
    async setCurrentExercise(lessonId: string, exerciseId: string): Promise<void> {
        if (!this.cachedProgress) return;

        this.cachedProgress.currentLessonId = lessonId;
        this.cachedProgress.currentExerciseId = exerciseId;
        this.cachedProgress.updatedAt = Date.now();

        await this.saveProgress(this.cachedProgress);
    }

    // ----------------------------------- Progress Queries -----------------------------------

    /**
     * Get progress for a specific exercise
     */
    getExerciseProgress(exerciseId: string, lessonId: string, unitId: TUnit): TExerciseProgress | undefined {
        if (!this.cachedProgress) return undefined;

        const unitProgress = this.cachedProgress.unitProgress[unitId];
        const lessonProgress = unitProgress?.lessonProgress[lessonId];
        return lessonProgress?.exerciseProgress[exerciseId];
    }

    /**
     * Get progress for a specific lesson
     */
    getLessonProgress(lessonId: string, unitId: TUnit): TLessonProgress | undefined {
        if (!this.cachedProgress) return undefined;

        return this.cachedProgress.unitProgress[unitId]?.lessonProgress[lessonId];
    }

    /**
     * Get progress for a specific unit
     */
    getUnitProgress(unitId: TUnit): TUnitProgress | undefined {
        if (!this.cachedProgress) return undefined;

        return this.cachedProgress.unitProgress[unitId];
    }

    /**
     * Get completion percentage for a lesson
     */
    getLessonCompletionPercent(lessonId: string, unitId: TUnit, totalExercises: number): number {
        const lessonProgress = this.getLessonProgress(lessonId, unitId);
        if (!lessonProgress || totalExercises === 0) return 0;

        const passedCount = Object.values(lessonProgress.exerciseProgress).filter((e) => e.passed).length;
        return Math.round((passedCount / totalExercises) * 100);
    }

    /**
     * Get completion percentage for a unit
     */
    getUnitCompletionPercent(unitId: TUnit, totalLessons: number): number {
        const unitProgress = this.getUnitProgress(unitId);
        if (!unitProgress || totalLessons === 0) return 0;

        const completedCount = Object.values(unitProgress.lessonProgress).filter((l) => l.completed).length;
        return Math.round((completedCount / totalLessons) * 100);
    }

    /**
     * Get overall curriculum completion percentage
     */
    getOverallCompletionPercent(totalExercises: number): number {
        if (!this.cachedProgress || totalExercises === 0) return 0;

        let passedCount = 0;
        for (const unitProgress of Object.values(this.cachedProgress.unitProgress)) {
            for (const lessonProgress of Object.values(unitProgress.lessonProgress)) {
                passedCount += Object.values(lessonProgress.exerciseProgress).filter((e) => e.passed).length;
            }
        }

        return Math.round((passedCount / totalExercises) * 100);
    }

    // ----------------------------------- Listeners -----------------------------------

    /**
     * Add a listener for progress changes
     */
    addListener(listener: TProgressStoreListener): void {
        this.listeners.push(listener);
    }

    /**
     * Remove a listener
     */
    removeListener(listener: TProgressStoreListener): void {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    }

    // ----------------------------------- Data Management -----------------------------------

    /**
     * Clear all progress data
     */
    async clearAllProgress(): Promise<void> {
        try {
            const allProgress = (await KL_INDEXED_DB.getAll(CURRICULUM_STORE)) as TStoredProgress[];
            for (const progress of allProgress) {
                await KL_INDEXED_DB.remove(CURRICULUM_STORE, progress.id);
            }
            this.cachedProgress = undefined;
            this.currentSessionId = undefined;
            this.notifyListeners();
        } catch (e) {
            console.error('ProgressStore: Failed to clear progress', e);
            throw e;
        }
    }

    /**
     * Export progress data as JSON
     */
    async exportProgress(): Promise<string> {
        if (!this.cachedProgress) {
            throw new Error('No progress to export');
        }
        return JSON.stringify(this.cachedProgress, null, 2);
    }

    /**
     * Import progress data from JSON
     */
    async importProgress(jsonData: string): Promise<void> {
        try {
            const progress = JSON.parse(jsonData) as TCurriculumProgress;
            // Validate basic structure
            if (!progress.sessionId || !progress.gradeLevel || !progress.unitProgress) {
                throw new Error('Invalid progress data format');
            }
            await this.saveProgress(progress);
            this.cachedProgress = progress;
            this.currentSessionId = progress.sessionId;
            this.notifyListeners();
        } catch (e) {
            console.error('ProgressStore: Failed to import progress', e);
            throw e;
        }
    }

    // ----------------------------------- Private Helpers -----------------------------------

    private createEmptyUnitProgress(unitId: TUnit): TUnitProgress {
        return {
            unitId,
            lessonProgress: {},
            completed: false,
        };
    }

    private async saveProgress(progress: TCurriculumProgress): Promise<void> {
        const stored: TStoredProgress = {
            id: progress.sessionId,
            progress,
            timestamp: Date.now(),
        };

        try {
            await KL_INDEXED_DB.set(CURRICULUM_STORE, progress.sessionId, stored);
        } catch (e) {
            console.error('ProgressStore: Failed to save progress', e);
            throw e;
        }
    }

    private checkLessonCompletion(lessonProgress: TLessonProgress): void {
        // A lesson is complete when all exercises are passed
        // Note: We need to know total exercises to properly check this
        // For now, mark as complete if we have at least one passed exercise
        // The UI can handle showing actual percentage
        const allPassed = Object.values(lessonProgress.exerciseProgress).every((e) => e.passed);
        const hasAnyExercise = Object.keys(lessonProgress.exerciseProgress).length > 0;

        if (allPassed && hasAnyExercise && !lessonProgress.completed) {
            lessonProgress.completed = true;
            lessonProgress.completedAt = Date.now();
        }
    }

    private checkUnitCompletion(unitProgress: TUnitProgress): void {
        // A unit is complete when all lessons are complete
        const allComplete = Object.values(unitProgress.lessonProgress).every((l) => l.completed);
        const hasAnyLesson = Object.keys(unitProgress.lessonProgress).length > 0;

        if (allComplete && hasAnyLesson && !unitProgress.completed) {
            unitProgress.completed = true;
            unitProgress.completedAt = Date.now();
        }
    }

    private notifyListeners(): void {
        for (const listener of this.listeners) {
            try {
                listener(this.cachedProgress);
            } catch (e) {
                console.error('ProgressStore: Listener error', e);
            }
        }
    }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const progressStore = new ProgressStore();
