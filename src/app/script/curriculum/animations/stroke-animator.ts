/**
 * Stroke Animator
 * SVG-based animation engine for exercise demonstrations
 *
 * Provides animated stroke drawing for line exercises, dot highlighting
 * for connect-the-dots, and shape construction animations.
 */

import {
    TAnimationConfig,
    TAnimationStep,
    TPoint,
    TDemoPlayerState,
} from '../types';

// ============================================================================
// Types
// ============================================================================

export type TStrokeAnimatorParams = {
    width: number;
    height: number;
    onStateChange?: (state: TDemoPlayerState) => void;
    onComplete?: () => void;
};

export type TStrokeStyle = {
    color: string;
    width: number;
    lineCap?: 'butt' | 'round' | 'square';
    lineJoin?: 'miter' | 'round' | 'bevel';
};

// ============================================================================
// Default Styles
// ============================================================================

const DEFAULT_STROKE_STYLE: TStrokeStyle = {
    color: '#2196F3',
    width: 4,
    lineCap: 'round',
    lineJoin: 'round',
};

const DEFAULT_DOT_STYLE: TStrokeStyle = {
    color: '#4CAF50',
    width: 2,
    lineCap: 'round',
    lineJoin: 'round',
};

// ============================================================================
// Stroke Animator Class
// ============================================================================

export class StrokeAnimator {
    private readonly svgEl: SVGSVGElement;
    private readonly params: TStrokeAnimatorParams;
    private readonly animationGroup: SVGGElement;

    private currentAnimation: TAnimationConfig | null = null;
    private currentStepIndex: number = 0;
    private animationFrameId: number | null = null;
    private startTime: number = 0;
    private isPlaying: boolean = false;
    private isPaused: boolean = false;
    private currentPath: SVGPathElement | null = null;
    private pathData: string = '';
    private currentPosition: TPoint = { x: 0, y: 0 };

    private strokeStyle: TStrokeStyle = { ...DEFAULT_STROKE_STYLE };
    private dotStyle: TStrokeStyle = { ...DEFAULT_DOT_STYLE };

    constructor(params: TStrokeAnimatorParams) {
        this.params = params;

        // Create SVG element
        this.svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgEl.setAttribute('width', String(params.width));
        this.svgEl.setAttribute('height', String(params.height));
        this.svgEl.setAttribute('viewBox', `0 0 ${params.width} ${params.height}`);
        this.svgEl.style.position = 'absolute';
        this.svgEl.style.top = '0';
        this.svgEl.style.left = '0';
        this.svgEl.style.pointerEvents = 'none';
        this.svgEl.style.zIndex = '200';

        // Create animation group
        this.animationGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.svgEl.appendChild(this.animationGroup);
    }

    // ----------------------------------- Public API -----------------------------------

    getElement(): SVGSVGElement {
        return this.svgEl;
    }

    setSize(width: number, height: number): void {
        this.svgEl.setAttribute('width', String(width));
        this.svgEl.setAttribute('height', String(height));
        this.svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    setTransform(x: number, y: number, scale: number, angleDeg: number = 0): void {
        const transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${angleDeg}deg)`;
        this.animationGroup.style.transform = transform;
        this.animationGroup.style.transformOrigin = '0 0';
    }

    setStrokeStyle(style: Partial<TStrokeStyle>): void {
        this.strokeStyle = { ...this.strokeStyle, ...style };
    }

    setDotStyle(style: Partial<TStrokeStyle>): void {
        this.dotStyle = { ...this.dotStyle, ...style };
    }

    /**
     * Load an animation configuration
     */
    loadAnimation(animation: TAnimationConfig): void {
        this.stop();
        this.currentAnimation = animation;
        this.currentStepIndex = 0;
        this.notifyStateChange();
    }

    /**
     * Play the loaded animation
     */
    play(): void {
        if (!this.currentAnimation) return;

        if (this.isPaused) {
            // Resume from pause
            this.isPaused = false;
            this.isPlaying = true;
            this.animate();
        } else {
            // Start fresh
            this.clear();
            this.isPlaying = true;
            this.isPaused = false;
            this.currentStepIndex = 0;
            this.startTime = performance.now();
            this.animate();
        }

        this.notifyStateChange();
    }

    /**
     * Pause the animation
     */
    pause(): void {
        this.isPaused = true;
        this.isPlaying = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.notifyStateChange();
    }

    /**
     * Stop and reset the animation
     */
    stop(): void {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStepIndex = 0;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.clear();
        this.notifyStateChange();
    }

    /**
     * Reset to beginning without clearing
     */
    reset(): void {
        this.stop();
        this.clear();
    }

    /**
     * Check if animation is currently playing
     */
    isAnimating(): boolean {
        return this.isPlaying;
    }

    /**
     * Get current state
     */
    getState(): TDemoPlayerState {
        return {
            isPlaying: this.isPlaying,
            currentStep: this.currentStepIndex,
            progress: this.calculateProgress(),
        };
    }

    /**
     * Clear all animations from the SVG
     */
    clear(): void {
        while (this.animationGroup.firstChild) {
            this.animationGroup.removeChild(this.animationGroup.firstChild);
        }
        this.currentPath = null;
        this.pathData = '';
        this.currentPosition = { x: 0, y: 0 };
    }

    /**
     * Set visibility
     */
    setVisible(visible: boolean): void {
        this.svgEl.style.display = visible ? '' : 'none';
    }

    /**
     * Destroy the animator
     */
    destroy(): void {
        this.stop();
        if (this.svgEl.parentNode) {
            this.svgEl.parentNode.removeChild(this.svgEl);
        }
    }

    // ----------------------------------- Animation Loop -----------------------------------

    private animate = (): void => {
        if (!this.isPlaying || !this.currentAnimation) return;

        const currentTime = performance.now();
        const elapsed = currentTime - this.startTime;

        // Process animation steps
        this.processAnimation(elapsed);

        // Continue animation loop
        if (this.isPlaying) {
            this.animationFrameId = requestAnimationFrame(this.animate);
        }
    };

    private processAnimation(elapsed: number): void {
        if (!this.currentAnimation) return;

        const { steps, duration, loop } = this.currentAnimation;

        // Check if animation is complete
        if (elapsed >= duration) {
            if (loop) {
                // Reset and loop
                this.clear();
                this.startTime = performance.now();
                this.currentStepIndex = 0;
            } else {
                // Animation complete
                this.isPlaying = false;
                if (this.params.onComplete) {
                    this.params.onComplete();
                }
                this.notifyStateChange();
            }
            return;
        }

        // Calculate which step we should be on
        let accumulatedTime = 0;
        let targetStep = 0;

        for (let i = 0; i < steps.length; i++) {
            accumulatedTime += steps[i].duration;
            if (elapsed < accumulatedTime) {
                targetStep = i;
                break;
            }
            if (i === steps.length - 1) {
                targetStep = steps.length - 1;
            }
        }

        // Process steps up to target
        while (this.currentStepIndex <= targetStep) {
            const step = steps[this.currentStepIndex];
            this.executeStep(step);
            this.currentStepIndex++;
        }

        // For the current step, calculate interpolation
        if (targetStep < steps.length) {
            const step = steps[targetStep];
            let stepStartTime = 0;
            for (let i = 0; i < targetStep; i++) {
                stepStartTime += steps[i].duration;
            }
            const stepProgress = step.duration > 0
                ? (elapsed - stepStartTime) / step.duration
                : 1;

            this.interpolateStep(step, Math.min(1, Math.max(0, stepProgress)));
        }

        this.notifyStateChange();
    }

    private executeStep(step: TAnimationStep): void {
        const { action, params } = step;

        switch (action) {
            case 'moveTo':
                this.handleMoveTo(params as Record<string, number>);
                break;
            case 'lineTo':
                // lineTo is interpolated, initial position is set
                break;
            case 'curveTo':
                // curveTo is interpolated
                break;
            case 'highlightDot':
                this.handleHighlightDot(params);
                break;
            case 'connectDots':
                // connectDots is interpolated
                break;
            case 'fill':
                this.handleFill(params);
                break;
            case 'pause':
                // No action needed, just wait
                break;
        }
    }

    private interpolateStep(step: TAnimationStep, progress: number): void {
        const { action, params } = step;

        switch (action) {
            case 'lineTo':
                this.interpolateLineTo(params as Record<string, number>, progress);
                break;
            case 'curveTo':
                this.interpolateCurveTo(params as Record<string, number>, progress);
                break;
            case 'connectDots':
                this.interpolateConnectDots(params, progress);
                break;
        }
    }

    // ----------------------------------- Step Handlers -----------------------------------

    private handleMoveTo(params: Record<string, number>): void {
        const x = params.x ?? 0;
        const y = params.y ?? 0;
        this.currentPosition = { x, y };

        // Start a new path
        this.currentPath = this.createPath();
        this.pathData = `M ${x} ${y}`;
        this.currentPath.setAttribute('d', this.pathData);
        this.animationGroup.appendChild(this.currentPath);
    }

    private interpolateLineTo(params: Record<string, number>, progress: number): void {
        const targetX = params.x ?? this.currentPosition.x;
        const targetY = params.y ?? this.currentPosition.y;

        const x = this.lerp(this.currentPosition.x, targetX, progress);
        const y = this.lerp(this.currentPosition.y, targetY, progress);

        if (this.currentPath) {
            this.currentPath.setAttribute('d', `${this.pathData} L ${x} ${y}`);
        }

        if (progress >= 1) {
            this.pathData = `${this.pathData} L ${targetX} ${targetY}`;
            this.currentPosition = { x: targetX, y: targetY };
        }
    }

    private interpolateCurveTo(params: Record<string, number>, progress: number): void {
        const cx1 = params.cx1 ?? this.currentPosition.x;
        const cy1 = params.cy1 ?? this.currentPosition.y;
        const cx2 = params.cx2 ?? params.x ?? this.currentPosition.x;
        const cy2 = params.cy2 ?? params.y ?? this.currentPosition.y;
        const targetX = params.x ?? this.currentPosition.x;
        const targetY = params.y ?? this.currentPosition.y;

        // Cubic bezier interpolation
        const point = this.bezierPoint(
            this.currentPosition,
            { x: cx1, y: cy1 },
            { x: cx2, y: cy2 },
            { x: targetX, y: targetY },
            progress
        );

        if (this.currentPath) {
            // Approximate with line segments for smooth animation
            const partialPath = this.pathData + ` L ${point.x} ${point.y}`;
            this.currentPath.setAttribute('d', partialPath);
        }

        if (progress >= 1) {
            this.pathData = `${this.pathData} C ${cx1} ${cy1} ${cx2} ${cy2} ${targetX} ${targetY}`;
            this.currentPosition = { x: targetX, y: targetY };
        }
    }

    private handleHighlightDot(params: Record<string, number | string>): void {
        const x = (params.x as number) ?? 0;
        const y = (params.y as number) ?? 0;

        // Create a pulsing circle at the dot position
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', String(x));
        circle.setAttribute('cy', String(y));
        circle.setAttribute('r', '20');
        circle.setAttribute('fill', this.dotStyle.color);
        circle.setAttribute('fill-opacity', '0.3');
        circle.setAttribute('stroke', this.dotStyle.color);
        circle.setAttribute('stroke-width', String(this.dotStyle.width));

        // Add pulse animation
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'r');
        animate.setAttribute('values', '15;25;15');
        animate.setAttribute('dur', '0.5s');
        animate.setAttribute('repeatCount', '2');
        circle.appendChild(animate);

        this.animationGroup.appendChild(circle);

        // Update current position for subsequent lines
        this.currentPosition = { x, y };

        // Start new path from this dot
        this.currentPath = this.createPath();
        this.pathData = `M ${x} ${y}`;
        this.currentPath.setAttribute('d', this.pathData);
        this.animationGroup.appendChild(this.currentPath);
    }

    private interpolateConnectDots(params: Record<string, number | string>, progress: number): void {
        const fromX = params.fromX as number ?? this.currentPosition.x;
        const fromY = params.fromY as number ?? this.currentPosition.y;
        const toX = params.toX as number ?? fromX;
        const toY = params.toY as number ?? fromY;

        const x = this.lerp(fromX, toX, progress);
        const y = this.lerp(fromY, toY, progress);

        if (this.currentPath) {
            this.currentPath.setAttribute('d', `${this.pathData} L ${x} ${y}`);
        }

        if (progress >= 1) {
            this.pathData = `${this.pathData} L ${toX} ${toY}`;
            this.currentPosition = { x: toX, y: toY };
        }
    }

    private handleFill(params: Record<string, number | string>): void {
        const regionId = params.regionId as string;
        const color = params.color as string ?? this.strokeStyle.color;

        // Create a filled shape indicator
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(params.x ?? 0));
        rect.setAttribute('y', String(params.y ?? 0));
        rect.setAttribute('width', String(params.width ?? 50));
        rect.setAttribute('height', String(params.height ?? 50));
        rect.setAttribute('fill', color);
        rect.setAttribute('fill-opacity', '0.5');
        rect.setAttribute('data-region', regionId);

        this.animationGroup.appendChild(rect);
    }

    // ----------------------------------- SVG Helpers -----------------------------------

    private createPath(): SVGPathElement {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', this.strokeStyle.color);
        path.setAttribute('stroke-width', String(this.strokeStyle.width));
        path.setAttribute('stroke-linecap', this.strokeStyle.lineCap ?? 'round');
        path.setAttribute('stroke-linejoin', this.strokeStyle.lineJoin ?? 'round');
        return path;
    }

    // ----------------------------------- Math Helpers -----------------------------------

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    private bezierPoint(
        p0: TPoint,
        p1: TPoint,
        p2: TPoint,
        p3: TPoint,
        t: number
    ): TPoint {
        const t2 = t * t;
        const t3 = t2 * t;
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;

        return {
            x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
            y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
        };
    }

    // ----------------------------------- State Management -----------------------------------

    private calculateProgress(): number {
        if (!this.currentAnimation) return 0;

        let stepProgress = 0;
        for (let i = 0; i < this.currentStepIndex; i++) {
            stepProgress += this.currentAnimation.steps[i].duration;
        }

        return this.currentAnimation.duration > 0
            ? stepProgress / this.currentAnimation.duration
            : 0;
    }

    private notifyStateChange(): void {
        if (this.params.onStateChange) {
            this.params.onStateChange(this.getState());
        }
    }
}

// ============================================================================
// Helper: Generate animation from path
// ============================================================================

/**
 * Parse an SVG path string and generate animation steps
 */
export function generateAnimationFromPath(
    pathData: string,
    duration: number = 2000
): TAnimationConfig {
    const steps: TAnimationStep[] = [];
    const commands = pathData.match(/[MLCQZA][^MLCQZA]*/gi) || [];

    let totalLength = 0;

    // First pass: calculate total path length (approximate)
    commands.forEach((cmd) => {
        const type = cmd[0].toUpperCase();
        if (type === 'L' || type === 'M') {
            totalLength += 1;
        } else if (type === 'C' || type === 'Q') {
            totalLength += 2;
        }
    });

    const stepDuration = totalLength > 0 ? duration / totalLength : duration;

    // Second pass: generate steps
    commands.forEach((cmd) => {
        const type = cmd[0].toUpperCase();
        const coords = cmd
            .slice(1)
            .trim()
            .split(/[\s,]+/)
            .map(Number);

        if (type === 'M') {
            steps.push({
                action: 'moveTo',
                params: { x: coords[0], y: coords[1] },
                duration: 0,
            });
        } else if (type === 'L') {
            steps.push({
                action: 'lineTo',
                params: { x: coords[0], y: coords[1] },
                duration: stepDuration,
            });
        } else if (type === 'C') {
            steps.push({
                action: 'curveTo',
                params: {
                    cx1: coords[0],
                    cy1: coords[1],
                    cx2: coords[2],
                    cy2: coords[3],
                    x: coords[4],
                    y: coords[5],
                },
                duration: stepDuration * 2,
            });
        } else if (type === 'Q') {
            steps.push({
                action: 'curveTo',
                params: {
                    cx1: coords[0],
                    cy1: coords[1],
                    x: coords[2],
                    y: coords[3],
                },
                duration: stepDuration * 1.5,
            });
        }
    });

    return {
        type: 'stroke',
        steps,
        duration,
        loop: true,
    };
}
