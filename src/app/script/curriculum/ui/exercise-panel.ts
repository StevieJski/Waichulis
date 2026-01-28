/**
 * Exercise Panel
 * Displays exercise instructions, controls, and progress during exercise mode
 */

import { BB } from '../../bb/bb';
import { LANG } from '../../language/language';
import { TExercise } from '../types';

// ============================================================================
// Types
// ============================================================================

export type TExercisePanelParams = {
    onSubmit: () => void;
    onCancel: () => void;
    onClear: () => void;
    onGetHelp: () => void;
};

// ============================================================================
// Exercise Panel Class
// ============================================================================

export class ExercisePanel {
    private readonly rootEl: HTMLDivElement;
    private readonly params: TExercisePanelParams;

    private titleEl: HTMLElement | null = null;
    private instructionsEl: HTMLElement | null = null;
    private difficultyEl: HTMLElement | null = null;
    private submitBtn: HTMLButtonElement | null = null;
    private exercise: TExercise | null = null;
    private hasDrawn: boolean = false;

    constructor(params: TExercisePanelParams) {
        this.params = params;

        this.rootEl = BB.el({
            css: {
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--kl-color-bg, white)',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                padding: '12px 16px',
                minWidth: '280px',
                maxWidth: '400px',
                zIndex: '100',
                display: 'none',
            },
        }) as HTMLDivElement;

        this.render();
    }

    // ----------------------------------- Public API -----------------------------------

    getElement(): HTMLElement {
        return this.rootEl;
    }

    setExercise(exercise: TExercise): void {
        this.exercise = exercise;
        this.hasDrawn = false;
        this.updateContent();
        this.updateSubmitButton();
    }

    clearExercise(): void {
        this.exercise = null;
        this.hasDrawn = false;
        this.updateContent();
    }

    setVisible(visible: boolean): void {
        this.rootEl.style.display = visible ? 'block' : 'none';
    }

    /**
     * Notify that user has started drawing
     */
    setHasDrawn(hasDrawn: boolean): void {
        this.hasDrawn = hasDrawn;
        this.updateSubmitButton();
    }

    // ----------------------------------- Rendering -----------------------------------

    private render(): void {
        // Header row (title + difficulty)
        const headerRow = BB.el({
            css: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
            },
        });

        this.titleEl = BB.el({
            css: {
                fontSize: '16px',
                fontWeight: 'bold',
            },
            content: '',
        });
        headerRow.appendChild(this.titleEl);

        this.difficultyEl = BB.el({
            css: {
                fontSize: '12px',
                opacity: '0.7',
            },
            content: '',
        });
        headerRow.appendChild(this.difficultyEl);

        this.rootEl.appendChild(headerRow);

        // Instructions
        this.instructionsEl = BB.el({
            css: {
                fontSize: '13px',
                marginBottom: '12px',
                lineHeight: '1.4',
            },
            content: '',
        });
        this.rootEl.appendChild(this.instructionsEl);

        // Buttons row
        const buttonsRow = BB.el({
            css: {
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end',
            },
        });

        // Cancel button
        const cancelBtn = BB.el({
            tagName: 'button',
            css: {
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
            },
            content: LANG('modal-cancel'),
            onClick: () => this.params.onCancel(),
        }) as HTMLButtonElement;
        buttonsRow.appendChild(cancelBtn);

        // Clear button
        const clearBtn = BB.el({
            tagName: 'button',
            css: {
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
            },
            content: 'Clear',
            onClick: () => this.params.onClear(),
        }) as HTMLButtonElement;
        buttonsRow.appendChild(clearBtn);

        // Help button
        const helpBtn = BB.el({
            tagName: 'button',
            css: {
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
            },
            content: LANG('learn-get-help'),
            onClick: () => this.params.onGetHelp(),
        }) as HTMLButtonElement;
        buttonsRow.appendChild(helpBtn);

        // Submit button
        this.submitBtn = BB.el({
            tagName: 'button',
            css: {
                padding: '6px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'var(--kl-color-primary, #2196F3)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                opacity: '0.5',
            },
            content: LANG('learn-exercise-submit'),
            onClick: () => {
                if (this.hasDrawn) {
                    this.params.onSubmit();
                }
            },
        }) as HTMLButtonElement;
        buttonsRow.appendChild(this.submitBtn);

        this.rootEl.appendChild(buttonsRow);
    }

    private updateContent(): void {
        if (!this.exercise) {
            if (this.titleEl) this.titleEl.textContent = '';
            if (this.instructionsEl) this.instructionsEl.textContent = '';
            if (this.difficultyEl) this.difficultyEl.textContent = '';
            return;
        }

        if (this.titleEl) {
            this.titleEl.textContent = this.exercise.title;
        }

        if (this.instructionsEl) {
            this.instructionsEl.textContent = this.exercise.instructions;
        }

        if (this.difficultyEl) {
            this.difficultyEl.textContent = '\u2B50'.repeat(this.exercise.difficulty);
        }
    }

    private updateSubmitButton(): void {
        if (!this.submitBtn) return;

        if (this.hasDrawn) {
            this.submitBtn.style.opacity = '1';
            this.submitBtn.style.cursor = 'pointer';
        } else {
            this.submitBtn.style.opacity = '0.5';
            this.submitBtn.style.cursor = 'not-allowed';
        }
    }

    destroy(): void {
        if (this.rootEl.parentNode) {
            this.rootEl.parentNode.removeChild(this.rootEl);
        }
    }
}
