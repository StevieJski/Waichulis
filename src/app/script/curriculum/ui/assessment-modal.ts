/**
 * Assessment Modal
 * Displays exercise assessment results with score, feedback, and actions
 */

import { BB } from '../../bb/bb';
import { LANG } from '../../language/language';
import { TExercise, TFullAssessment } from '../types';

// ============================================================================
// Types
// ============================================================================

export type TAssessmentModalParams = {
    target: HTMLElement;
    exercise: TExercise;
    assessment: TFullAssessment;
    attemptNumber: number;
    onTryAgain: () => void;
    onNextExercise: () => void;
    onClose: () => void;
};

// ============================================================================
// Assessment Modal Class
// ============================================================================

export class AssessmentModal {
    private readonly rootEl: HTMLDivElement;
    private readonly overlayEl: HTMLDivElement;
    private readonly modalEl: HTMLDivElement;
    private readonly params: TAssessmentModalParams;

    constructor(params: TAssessmentModalParams) {
        this.params = params;

        // Create overlay
        this.overlayEl = BB.el({
            css: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: '10000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
            onClick: (e: MouseEvent) => {
                if (e.target === this.overlayEl) {
                    this.close();
                }
            },
        }) as HTMLDivElement;

        // Create modal container
        this.modalEl = BB.el({
            css: {
                backgroundColor: 'var(--kl-color-bg, white)',
                borderRadius: '12px',
                padding: '24px',
                minWidth: '300px',
                maxWidth: '400px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            },
        }) as HTMLDivElement;

        this.rootEl = this.overlayEl;
        this.overlayEl.appendChild(this.modalEl);
        this.render();
        params.target.appendChild(this.rootEl);
    }

    private render(): void {
        const { exercise, assessment, attemptNumber } = this.params;

        // Clear existing content
        this.modalEl.innerHTML = '';

        // Score section
        const scoreSection = this.createScoreSection(assessment.score, assessment.passed);
        this.modalEl.appendChild(scoreSection);

        // Status message
        const statusEl = BB.el({
            css: {
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: assessment.passed
                    ? 'var(--kl-color-success, #4CAF50)'
                    : 'var(--kl-color-warning, #FF9800)',
            },
            content: assessment.passed ? LANG('learn-exercise-passed') : LANG('learn-exercise-keep-practicing'),
        });
        this.modalEl.appendChild(statusEl);

        // Feedback section
        const feedbackSection = this.createFeedbackSection(assessment);
        this.modalEl.appendChild(feedbackSection);

        // Attempt info
        const attemptInfo = BB.el({
            css: {
                textAlign: 'center',
                fontSize: '12px',
                opacity: '0.7',
                marginTop: '12px',
                marginBottom: '16px',
            },
            content: `Attempt #${attemptNumber}`,
        });
        this.modalEl.appendChild(attemptInfo);

        // Action buttons
        const buttonsSection = this.createButtonsSection(assessment.passed);
        this.modalEl.appendChild(buttonsSection);
    }

    private createScoreSection(score: number, passed: boolean): HTMLElement {
        const section = BB.el({
            css: {
                textAlign: 'center',
                marginBottom: '20px',
            },
        });

        // Score circle
        const circleSize = 100;
        const strokeWidth = 8;
        const radius = (circleSize - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const progress = (score / 100) * circumference;

        const color = passed ? 'var(--kl-color-success, #4CAF50)' : 'var(--kl-color-warning, #FF9800)';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', String(circleSize));
        svg.setAttribute('height', String(circleSize));
        svg.style.display = 'block';
        svg.style.margin = '0 auto';

        // Background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('cx', String(circleSize / 2));
        bgCircle.setAttribute('cy', String(circleSize / 2));
        bgCircle.setAttribute('r', String(radius));
        bgCircle.setAttribute('fill', 'none');
        bgCircle.setAttribute('stroke', 'var(--kl-color-ui-border, #e0e0e0)');
        bgCircle.setAttribute('stroke-width', String(strokeWidth));
        svg.appendChild(bgCircle);

        // Progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('cx', String(circleSize / 2));
        progressCircle.setAttribute('cy', String(circleSize / 2));
        progressCircle.setAttribute('r', String(radius));
        progressCircle.setAttribute('fill', 'none');
        progressCircle.setAttribute('stroke', color);
        progressCircle.setAttribute('stroke-width', String(strokeWidth));
        progressCircle.setAttribute('stroke-linecap', 'round');
        progressCircle.setAttribute('stroke-dasharray', `${progress} ${circumference}`);
        progressCircle.setAttribute('transform', `rotate(-90 ${circleSize / 2} ${circleSize / 2})`);
        progressCircle.style.transition = 'stroke-dasharray 0.5s ease';
        svg.appendChild(progressCircle);

        // Score text
        const scoreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        scoreText.setAttribute('x', String(circleSize / 2));
        scoreText.setAttribute('y', String(circleSize / 2 + 8));
        scoreText.setAttribute('text-anchor', 'middle');
        scoreText.setAttribute('font-size', '28');
        scoreText.setAttribute('font-weight', 'bold');
        scoreText.setAttribute('fill', color);
        scoreText.textContent = String(score);
        svg.appendChild(scoreText);

        section.appendChild(svg);

        // Score label
        const label = BB.el({
            css: {
                fontSize: '14px',
                marginTop: '8px',
                opacity: '0.8',
            },
            content: LANG('learn-exercise-score'),
        });
        section.appendChild(label);

        return section;
    }

    private createFeedbackSection(assessment: TFullAssessment): HTMLElement {
        const section = BB.el({
            css: {
                backgroundColor: 'var(--kl-color-bg-active, #f5f5f5)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
            },
        });

        const { feedback } = assessment;

        // Encouragement
        if (feedback.encouragement) {
            const encouragement = BB.el({
                css: {
                    fontSize: '16px',
                    marginBottom: '12px',
                    textAlign: 'center',
                },
                content: feedback.encouragement,
            });
            section.appendChild(encouragement);
        }

        // Specific praise
        if (feedback.specificPraise && feedback.specificPraise.length > 0) {
            const praiseList = BB.el({
                css: {
                    marginBottom: '12px',
                },
            });

            for (const praise of feedback.specificPraise) {
                const item = BB.el({
                    css: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        marginBottom: '4px',
                        fontSize: '13px',
                    },
                });

                const icon = BB.el({
                    css: {
                        color: 'var(--kl-color-success, #4CAF50)',
                        fontWeight: 'bold',
                    },
                    content: '\u2713',
                });
                item.appendChild(icon);

                const text = BB.el({
                    content: praise,
                });
                item.appendChild(text);

                praiseList.appendChild(item);
            }

            section.appendChild(praiseList);
        }

        // Improvement tips
        if (feedback.improvementTips && feedback.improvementTips.length > 0) {
            const tipsList = BB.el({
                css: {
                    marginBottom: '8px',
                },
            });

            for (const tip of feedback.improvementTips) {
                const item = BB.el({
                    css: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        marginBottom: '4px',
                        fontSize: '13px',
                    },
                });

                const icon = BB.el({
                    css: {
                        color: 'var(--kl-color-warning, #FF9800)',
                    },
                    content: '\u2794',
                });
                item.appendChild(icon);

                const text = BB.el({
                    content: tip,
                });
                item.appendChild(text);

                tipsList.appendChild(item);
            }

            section.appendChild(tipsList);
        }

        // Next step hint
        if (feedback.nextStepHint) {
            const hint = BB.el({
                css: {
                    fontSize: '13px',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    opacity: '0.8',
                    marginTop: '8px',
                },
                content: feedback.nextStepHint,
            });
            section.appendChild(hint);
        }

        return section;
    }

    private createButtonsSection(passed: boolean): HTMLElement {
        const section = BB.el({
            css: {
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
            },
        });

        // Try Again button (always shown)
        const tryAgainBtn = BB.el({
            tagName: 'button',
            css: {
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
            },
            content: LANG('learn-exercise-try-again'),
            onClick: () => {
                this.close();
                this.params.onTryAgain();
            },
        });
        section.appendChild(tryAgainBtn);

        // Next Exercise button (only if passed)
        if (passed) {
            const nextBtn = BB.el({
                tagName: 'button',
                css: {
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'var(--kl-color-primary, #2196F3)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                content: LANG('learn-exercise-next'),
                onClick: () => {
                    this.close();
                    this.params.onNextExercise();
                },
            });
            section.appendChild(nextBtn);
        }

        return section;
    }

    private close(): void {
        if (this.rootEl.parentNode) {
            this.rootEl.parentNode.removeChild(this.rootEl);
        }
        this.params.onClose();
    }

    destroy(): void {
        this.close();
    }
}

/**
 * Show assessment modal as a promise
 */
export function showAssessmentModal(params: Omit<TAssessmentModalParams, 'onClose'>): Promise<'tryAgain' | 'next' | 'closed'> {
    return new Promise((resolve) => {
        new AssessmentModal({
            ...params,
            onTryAgain: () => resolve('tryAgain'),
            onNextExercise: () => resolve('next'),
            onClose: () => resolve('closed'),
        });
    });
}
