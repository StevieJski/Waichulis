/**
 * Demo Player
 * UI component for playing exercise demonstration animations
 *
 * Displays an overlay on the canvas with animated stroke demonstrations
 * showing how to complete exercises.
 */

import { BB } from '../../bb/bb';
import { LANG } from '../../language/language';
import { TExercise, TAnimationConfig, TDemoPlayerState } from '../types';
import { StrokeAnimator, generateAnimationFromPath } from '../animations/stroke-animator';

// ============================================================================
// Types
// ============================================================================

export type TDemoPlayerParams = {
    width: number;
    height: number;
    onClose?: () => void;
};

// ============================================================================
// Demo Player Class
// ============================================================================

export class DemoPlayer {
    private readonly rootEl: HTMLDivElement;
    private readonly params: TDemoPlayerParams;
    private readonly animator: StrokeAnimator;
    private readonly overlayEl: HTMLDivElement;
    private readonly controlsEl: HTMLDivElement;

    private playBtn: HTMLButtonElement | null = null;
    private progressBar: HTMLDivElement | null = null;
    private currentExercise: TExercise | null = null;
    private isVisible: boolean = false;

    constructor(params: TDemoPlayerParams) {
        this.params = params;

        // Create root container (overlay)
        this.rootEl = BB.el({
            css: {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                zIndex: '150',
                display: 'none',
            },
        }) as HTMLDivElement;

        // Create animation container
        this.overlayEl = BB.el({
            css: {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
            },
        }) as HTMLDivElement;
        this.rootEl.appendChild(this.overlayEl);

        // Initialize stroke animator
        this.animator = new StrokeAnimator({
            width: params.width,
            height: params.height,
            onStateChange: (state) => this.handleStateChange(state),
            onComplete: () => this.handleAnimationComplete(),
        });
        this.overlayEl.appendChild(this.animator.getElement());

        // Create controls
        this.controlsEl = this.createControls();
        this.rootEl.appendChild(this.controlsEl);
    }

    // ----------------------------------- Public API -----------------------------------

    getElement(): HTMLElement {
        return this.rootEl;
    }

    /**
     * Show demo for an exercise
     */
    showDemo(exercise: TExercise): void {
        this.currentExercise = exercise;

        // Get or generate animation config
        let animationConfig = exercise.demonstrationAnimation;

        if (!animationConfig) {
            // Generate animation from exercise config
            animationConfig = this.generateAnimationForExercise(exercise);
        }

        if (animationConfig) {
            this.animator.loadAnimation(animationConfig);
            this.setVisible(true);
            this.animator.play();
        }
    }

    /**
     * Hide the demo player
     */
    hide(): void {
        this.animator.stop();
        this.setVisible(false);
        this.currentExercise = null;
        if (this.params.onClose) {
            this.params.onClose();
        }
    }

    /**
     * Update size to match canvas
     */
    setSize(width: number, height: number): void {
        this.animator.setSize(width, height);
    }

    /**
     * Update transform to match canvas viewport
     */
    setTransform(x: number, y: number, scale: number, angleDeg: number = 0): void {
        this.animator.setTransform(x, y, scale, angleDeg);
    }

    /**
     * Check if demo is visible
     */
    isShowing(): boolean {
        return this.isVisible;
    }

    /**
     * Destroy the demo player
     */
    destroy(): void {
        this.animator.destroy();
        if (this.rootEl.parentNode) {
            this.rootEl.parentNode.removeChild(this.rootEl);
        }
    }

    // ----------------------------------- Controls -----------------------------------

    private createControls(): HTMLDivElement {
        const container = BB.el({
            css: {
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                backgroundColor: 'var(--kl-color-bg, white)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            },
        }) as HTMLDivElement;

        // Title
        const title = BB.el({
            css: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'var(--kl-color-text, #333)',
                marginBottom: '4px',
            },
            content: 'Watch Demo',
        });
        container.appendChild(title);

        // Progress bar
        const progressContainer = BB.el({
            css: {
                width: '200px',
                height: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
            },
        });

        this.progressBar = BB.el({
            css: {
                width: '0%',
                height: '100%',
                backgroundColor: 'var(--kl-color-primary, #2196F3)',
                transition: 'width 0.1s linear',
            },
        }) as HTMLDivElement;
        progressContainer.appendChild(this.progressBar);
        container.appendChild(progressContainer);

        // Button row
        const buttonRow = BB.el({
            css: {
                display: 'flex',
                gap: '12px',
            },
        });

        // Play/Pause button
        this.playBtn = BB.el({
            tagName: 'button',
            css: this.getButtonStyle(),
            content: '⏸ Pause',
            onClick: () => this.togglePlayPause(),
        }) as HTMLButtonElement;
        buttonRow.appendChild(this.playBtn);

        // Restart button
        const restartBtn = BB.el({
            tagName: 'button',
            css: this.getButtonStyle(),
            content: '↺ Restart',
            onClick: () => this.restart(),
        }) as HTMLButtonElement;
        buttonRow.appendChild(restartBtn);

        // Close button
        const closeBtn = BB.el({
            tagName: 'button',
            css: {
                ...this.getButtonStyle(),
                backgroundColor: 'var(--kl-color-error, #f44336)',
            },
            content: '✕ Close',
            onClick: () => this.hide(),
        }) as HTMLButtonElement;
        buttonRow.appendChild(closeBtn);

        container.appendChild(buttonRow);

        return container;
    }

    private getButtonStyle(): Record<string, string> {
        return {
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'var(--kl-color-primary, #2196F3)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'opacity 0.2s',
        };
    }

    // ----------------------------------- Animation Helpers -----------------------------------

    private generateAnimationForExercise(exercise: TExercise): TAnimationConfig | null {
        const config = exercise.config;

        switch (config.type) {
            case 'line':
                // Generate from target path
                return generateAnimationFromPath(config.targetPath, 3000);

            case 'dots':
                // Generate from dots array
                return this.generateDotsAnimation(config.dots);

            case 'shape':
                // Generate shape tracing animation
                return this.generateShapeAnimation(config);

            case 'color':
                // Color exercises don't have stroke animations
                return null;
        }
    }

    private generateDotsAnimation(
        dots: Array<{ id: string; x: number; y: number; label?: string }>
    ): TAnimationConfig {
        const steps: TAnimationConfig['steps'] = [];
        const stepDuration = 800;

        dots.forEach((dot, index) => {
            // Highlight the dot
            steps.push({
                action: 'highlightDot',
                params: { id: dot.id, x: dot.x, y: dot.y },
                duration: stepDuration / 2,
            });

            // Connect to next dot (if not last)
            if (index < dots.length - 1) {
                const nextDot = dots[index + 1];
                steps.push({
                    action: 'connectDots',
                    params: {
                        fromX: dot.x,
                        fromY: dot.y,
                        toX: nextDot.x,
                        toY: nextDot.y,
                    },
                    duration: stepDuration / 2,
                });
            }
        });

        return {
            type: 'sequence',
            steps,
            duration: dots.length * stepDuration,
            loop: true,
        };
    }

    private generateShapeAnimation(config: {
        shapeType: string;
        targetBounds: { x: number; y: number; width: number; height: number };
        expectedCorners?: Array<{ x: number; y: number }>;
        center?: { x: number; y: number };
        radiusX?: number;
        radiusY?: number;
    }): TAnimationConfig {
        const steps: TAnimationConfig['steps'] = [];
        const stepDuration = 600;

        if (config.expectedCorners && config.expectedCorners.length > 0) {
            // Polygon shapes
            const corners = config.expectedCorners;

            // Move to first corner
            steps.push({
                action: 'moveTo',
                params: { x: corners[0].x, y: corners[0].y },
                duration: 0,
            });

            // Draw lines to each corner
            for (let i = 1; i < corners.length; i++) {
                steps.push({
                    action: 'lineTo',
                    params: { x: corners[i].x, y: corners[i].y },
                    duration: stepDuration,
                });
            }

            // Close the shape
            steps.push({
                action: 'lineTo',
                params: { x: corners[0].x, y: corners[0].y },
                duration: stepDuration,
            });
        } else if (config.center && config.radiusX && config.radiusY) {
            // Circle/oval shapes - approximate with points
            const cx = config.center.x;
            const cy = config.center.y;
            const rx = config.radiusX;
            const ry = config.radiusY;
            const segments = 12;

            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                const x = cx + Math.cos(angle) * rx;
                const y = cy + Math.sin(angle) * ry;

                if (i === 0) {
                    steps.push({
                        action: 'moveTo',
                        params: { x, y },
                        duration: 0,
                    });
                } else {
                    steps.push({
                        action: 'lineTo',
                        params: { x, y },
                        duration: stepDuration / 2,
                    });
                }
            }
        }

        return {
            type: 'stroke',
            steps,
            duration: steps.length * (stepDuration / 2),
            loop: true,
        };
    }

    // ----------------------------------- Event Handlers -----------------------------------

    private handleStateChange(state: TDemoPlayerState): void {
        // Update progress bar
        if (this.progressBar) {
            this.progressBar.style.width = `${state.progress * 100}%`;
        }

        // Update play button text
        if (this.playBtn) {
            this.playBtn.textContent = state.isPlaying ? '⏸ Pause' : '▶ Play';
        }
    }

    private handleAnimationComplete(): void {
        // Animation will loop automatically if configured
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }
    }

    private togglePlayPause(): void {
        const state = this.animator.getState();
        if (state.isPlaying) {
            this.animator.pause();
        } else {
            this.animator.play();
        }
    }

    private restart(): void {
        this.animator.stop();
        if (this.currentExercise) {
            const animation =
                this.currentExercise.demonstrationAnimation ||
                this.generateAnimationForExercise(this.currentExercise);
            if (animation) {
                this.animator.loadAnimation(animation);
                this.animator.play();
            }
        }
    }

    private setVisible(visible: boolean): void {
        this.isVisible = visible;
        this.rootEl.style.display = visible ? 'block' : 'none';
    }
}
