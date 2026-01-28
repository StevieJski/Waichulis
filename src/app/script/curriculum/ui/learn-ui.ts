/**
 * Learn Tab UI
 * Main UI component for the curriculum learning system
 */

import { BB } from '../../bb/bb';
import { LANG } from '../../language/language';
import { KL } from '../../klecks/kl';
import { css } from '../../bb/base/base';
import { progressStore, TProgressStoreListener } from '../storage/progress-store';
import {
    kindergartenCurriculum,
    getExerciseById,
    getLessonById,
    getUnitById,
    getTotalExerciseCount,
} from '../data/kindergarten';
import {
    TGradeLevel,
    TUnit,
    TLesson,
    TExercise,
    TCurriculumProgress,
} from '../types';
import { SettingsPanel } from './settings-panel';
import * as classes from './learn-ui.module.scss';

// ============================================================================
// Types
// ============================================================================

export type TLearnUiParams = {
    onStartExercise: (exercise: TExercise) => void;
};

type TViewState = {
    selectedUnit: TUnit;
    expandedLessonId: string | null;
    showSettings: boolean;
};

// ============================================================================
// Learn UI Class
// ============================================================================

export class LearnUi {
    private readonly rootEl: HTMLElement;
    private readonly params: TLearnUiParams;
    private viewState: TViewState;
    private progress: TCurriculumProgress | undefined;
    private progressListener: TProgressStoreListener;

    // UI elements that need updating
    private lessonListEl: HTMLElement | null = null;
    private overallProgressEl: HTMLElement | null = null;
    private settingsPanelEl: HTMLElement | null = null;

    // ----------------------------------- Constructor -----------------------------------

    constructor(params: TLearnUiParams) {
        this.params = params;
        this.viewState = {
            selectedUnit: 'line',
            expandedLessonId: null,
            showSettings: false,
        };

        this.rootEl = BB.el({
            className: classes.learnRoot,
        });

        // Listen for progress changes
        this.progressListener = (progress) => {
            this.progress = progress;
            this.updateUI();
        };
        progressStore.addListener(this.progressListener);

        // Initialize
        this.init();
    }

    // ----------------------------------- Initialization -----------------------------------

    private async init(): Promise<void> {
        // Load progress
        await progressStore.init();
        this.progress = await progressStore.getCurrentProgress();

        // If no session exists, start one
        if (!this.progress) {
            this.progress = await progressStore.startNewSession('kindergarten');
        }

        // Set initial selected unit based on progress
        if (this.progress.currentLessonId) {
            const lesson = getLessonById(this.progress.currentLessonId);
            if (lesson) {
                this.viewState.selectedUnit = lesson.unit;
            }
        }

        this.render();
    }

    // ----------------------------------- Rendering -----------------------------------

    private render(): void {
        this.rootEl.innerHTML = '';

        // Grade selector (currently only kindergarten)
        this.rootEl.append(this.createGradeSection());

        // Unit tabs
        this.rootEl.append(this.createUnitTabs());

        // Lesson list
        this.lessonListEl = this.createLessonList();
        this.rootEl.append(this.lessonListEl);

        // Overall progress
        this.overallProgressEl = this.createOverallProgress();
        this.rootEl.append(this.overallProgressEl);

        // Action buttons
        this.rootEl.append(this.createActionButtons());

        // Settings panel (hidden by default)
        this.settingsPanelEl = this.createSettingsPanel();
        this.settingsPanelEl.style.display = 'none';
        this.rootEl.append(this.settingsPanelEl);
    }

    private createGradeSection(): HTMLElement {
        const section = BB.el({
            className: classes.gradeSection,
        });

        const label = BB.el({
            className: classes.gradeLabel,
            content: LANG('learn-grade-level') + ':',
        });

        const gradeSelect = new KL.Select({
            optionArr: [['kindergarten', LANG('learn-grade-kindergarten')]],
            initValue: 'kindergarten',
            onChange: () => {
                // Only kindergarten supported for now
            },
            name: 'grade-level',
        });

        section.append(label, gradeSelect.getElement());
        return section;
    }

    private createUnitTabs(): HTMLElement {
        const tabs = BB.el({
            className: classes.unitTabs,
        });

        const units: { id: TUnit; label: string }[] = [
            { id: 'line', label: LANG('learn-unit-line') },
            { id: 'shape', label: LANG('learn-unit-shape') },
            { id: 'color', label: LANG('learn-unit-color') },
        ];

        for (const unit of units) {
            const tab = BB.el({
                tagName: 'button',
                className: `${classes.unitTab} ${this.viewState.selectedUnit === unit.id ? classes.active : ''}`,
                content: unit.label,
                onClick: () => {
                    this.viewState.selectedUnit = unit.id;
                    this.viewState.expandedLessonId = null;
                    this.updateUI();
                },
            });
            tabs.append(tab);
        }

        return tabs;
    }

    private createLessonList(): HTMLElement {
        const list = BB.el({
            className: classes.lessonList,
        });

        const unit = getUnitById(this.viewState.selectedUnit);
        if (!unit) {
            list.append(
                BB.el({
                    className: classes.emptyState,
                    content: 'No lessons available.',
                })
            );
            return list;
        }

        for (const lesson of unit.lessons) {
            list.append(this.createLessonCard(lesson));
        }

        return list;
    }

    private createLessonCard(lesson: TLesson): HTMLElement {
        const isExpanded = this.viewState.expandedLessonId === lesson.id;
        const lessonProgress = progressStore.getLessonProgress(lesson.id, lesson.unit);
        const completionPercent = progressStore.getLessonCompletionPercent(
            lesson.id,
            lesson.unit,
            lesson.exercises.length
        );
        const isComplete = completionPercent === 100;

        const card = BB.el({
            className: `${classes.lessonCard} ${isComplete ? classes.completed : ''}`,
        });

        // Title with expand indicator and badge
        const titleRow = BB.el({
            className: classes.lessonTitle,
        });

        // Expand/collapse chevron
        const chevron = BB.el({
            className: classes.lessonChevron,
            content: isExpanded ? '\u25BC' : '\u25B6', // ▼ or ▶
        });
        titleRow.append(chevron);

        titleRow.append(document.createTextNode(lesson.title));

        if (isComplete) {
            const badge = BB.el({
                className: `${classes.badge} ${classes.badgeComplete}`,
                content: LANG('learn-complete'),
            });
            titleRow.append(badge);
        } else if (!lessonProgress) {
            const badge = BB.el({
                className: `${classes.badge} ${classes.badgeNew}`,
                content: LANG('learn-new'),
            });
            titleRow.append(badge);
        }

        card.append(titleRow);

        // Hint text when collapsed
        if (!isExpanded) {
            const hint = BB.el({
                className: classes.lessonHint,
                content: `${lesson.exercises.length} exercises - click to expand`,
            });
            card.append(hint);
        }

        // Description
        const description = BB.el({
            className: classes.lessonDescription,
            content: lesson.description,
        });
        card.append(description);

        // Progress bar
        const progressBar = BB.el({
            className: classes.lessonProgress,
        });
        const progressFill = BB.el({
            className: classes.lessonProgressFill,
            css: {
                width: `${completionPercent}%`,
            },
        });
        progressBar.append(progressFill);
        card.append(progressBar);

        // Click to expand/collapse
        card.onclick = () => {
            this.viewState.expandedLessonId = isExpanded ? null : lesson.id;
            this.updateUI();
        };

        // Expanded exercise list
        if (isExpanded) {
            const exerciseList = this.createExerciseList(lesson);
            card.append(exerciseList);
        }

        return card;
    }

    private createExerciseList(lesson: TLesson): HTMLElement {
        const list = BB.el({
            className: classes.exerciseList,
        });

        for (const exercise of lesson.exercises) {
            const exerciseProgress = progressStore.getExerciseProgress(
                exercise.id,
                lesson.id,
                lesson.unit
            );
            const isPassed = exerciseProgress?.passed ?? false;

            const item = BB.el({
                className: `${classes.exerciseItem} ${isPassed ? classes.passed : ''}`,
            });

            // Icon
            const icon = BB.el({
                className: `${classes.exerciseIcon} ${isPassed ? classes.passed : ''}`,
                content: isPassed ? '\u2713' : '\u25B6', // ▶ play icon if not passed
            });
            item.append(icon);

            // Title
            const title = BB.el({
                className: classes.exerciseTitle,
                content: exercise.title,
            });
            item.append(title);

            // Difficulty indicator
            const difficulty = BB.el({
                className: classes.exerciseDifficulty,
                content: '\u2B50'.repeat(exercise.difficulty),
            });
            item.append(difficulty);

            // Start button
            const startBtn = BB.el({
                tagName: 'button',
                className: classes.exerciseStartBtn,
                content: isPassed ? 'Retry' : 'Start',
                onClick: (e: MouseEvent) => {
                    e.stopPropagation();
                    this.startExercise(exercise);
                },
            });
            item.append(startBtn);

            // Click anywhere on row to start exercise
            item.onclick = (e) => {
                e.stopPropagation();
                this.startExercise(exercise);
            };

            list.append(item);
        }

        return list;
    }

    private createOverallProgress(): HTMLElement {
        const container = BB.el({
            className: classes.overallProgress,
        });

        const totalExercises = getTotalExerciseCount();
        const completionPercent = progressStore.getOverallCompletionPercent(totalExercises);

        const label = BB.el({
            className: classes.overallProgressLabel,
        });
        label.append(
            document.createTextNode(LANG('learn-overall-progress')),
            BB.el({ content: `${completionPercent}%` })
        );
        container.append(label);

        const progressBar = BB.el({
            className: classes.overallProgressBar,
        });
        const progressFill = BB.el({
            className: classes.overallProgressFill,
            css: {
                width: `${completionPercent}%`,
            },
        });
        progressBar.append(progressFill);
        container.append(progressBar);

        return container;
    }

    private createActionButtons(): HTMLElement {
        const container = BB.el({
            className: classes.actionButtons,
        });

        // Continue/Start button
        const continueBtn = BB.el({
            tagName: 'button',
            className: classes.continueButton,
            content: this.progress?.currentExerciseId
                ? LANG('learn-continue')
                : LANG('learn-start'),
            onClick: () => this.continueOrStart(),
        });
        container.append(continueBtn);

        // Settings button
        const settingsBtn = BB.el({
            tagName: 'button',
            className: classes.settingsButton,
            content: '\u2699', // gear icon
            onClick: () => {
                this.viewState.showSettings = !this.viewState.showSettings;
                if (this.settingsPanelEl) {
                    this.settingsPanelEl.style.display = this.viewState.showSettings
                        ? 'block'
                        : 'none';
                }
            },
            custom: {
                title: LANG('learn-settings'),
            },
        });
        container.append(settingsBtn);

        return container;
    }

    private createSettingsPanel(): HTMLElement {
        const container = BB.el({
            className: classes.settingsPanel,
        });

        const settingsPanel = new SettingsPanel({
            onProgressCleared: async () => {
                this.progress = await progressStore.startNewSession('kindergarten');
                this.updateUI();
            },
        });

        container.append(settingsPanel.getElement());
        return container;
    }

    // ----------------------------------- Actions -----------------------------------

    private continueOrStart(): void {
        // Find the next exercise to do
        let nextExercise: TExercise | undefined;

        // If there's a current exercise, continue from there
        if (this.progress?.currentExerciseId) {
            nextExercise = getExerciseById(this.progress.currentExerciseId);
        }

        // Otherwise find the first incomplete exercise
        if (!nextExercise) {
            for (const unit of kindergartenCurriculum.units) {
                for (const lesson of unit.lessons) {
                    for (const exercise of lesson.exercises) {
                        const progress = progressStore.getExerciseProgress(
                            exercise.id,
                            lesson.id,
                            lesson.unit
                        );
                        if (!progress?.passed) {
                            nextExercise = exercise;
                            break;
                        }
                    }
                    if (nextExercise) break;
                }
                if (nextExercise) break;
            }
        }

        // If still no exercise, start from the beginning
        if (!nextExercise) {
            const firstUnit = kindergartenCurriculum.units[0];
            const firstLesson = firstUnit?.lessons[0];
            nextExercise = firstLesson?.exercises[0];
        }

        if (nextExercise) {
            this.startExercise(nextExercise);
        }
    }

    private startExercise(exercise: TExercise): void {
        // Update current position
        progressStore.setCurrentExercise(exercise.lessonId, exercise.id);

        // Notify parent to start exercise mode
        this.params.onStartExercise(exercise);
    }

    // ----------------------------------- UI Updates -----------------------------------

    private updateUI(): void {
        // Re-render the dynamic parts
        this.render();
    }

    // ----------------------------------- Public API -----------------------------------

    getElement(): HTMLElement {
        return this.rootEl;
    }

    setIsVisible(visible: boolean): void {
        this.rootEl.style.display = visible ? '' : 'none';
    }

    destroy(): void {
        progressStore.removeListener(this.progressListener);
    }

    /**
     * Called when an exercise is completed (from the exercise mode)
     */
    onExerciseCompleted(): void {
        this.updateUI();
    }
}
