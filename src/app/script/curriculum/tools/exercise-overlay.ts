/**
 * Exercise Overlay
 * Renders SVG guides, targets, and visual feedback for exercises
 */

import { BB } from '../../bb/bb';
import {
    TExercise,
    TLineConfig,
    TDotsConfig,
    TShapeConfig,
    TColorConfig,
    TDot,
    TPoint,
} from '../types';

// ============================================================================
// Types
// ============================================================================

export type TOverlayColors = {
    guide: string;
    guideFill: string;
    startPoint: string;
    endPoint: string;
    dotNormal: string;
    dotHit: string;
    feedback: {
        good: string;
        okay: string;
        poor: string;
    };
};

const DEFAULT_COLORS: TOverlayColors = {
    guide: 'rgba(100, 100, 100, 0.5)',
    guideFill: 'rgba(200, 200, 200, 0.2)',
    startPoint: '#4CAF50', // green
    endPoint: '#f44336', // red
    dotNormal: '#2196F3', // blue
    dotHit: '#4CAF50', // green
    feedback: {
        good: '#4CAF50',
        okay: '#FFC107',
        poor: '#f44336',
    },
};

// ============================================================================
// Exercise Overlay Class
// ============================================================================

export class ExerciseOverlay {
    private svgEl: SVGSVGElement;
    private guideGroup: SVGGElement;
    private feedbackGroup: SVGGElement;
    private exercise: TExercise | null = null;
    private hitDots: Set<string> = new Set();
    private colors: TOverlayColors;

    constructor(width: number, height: number, colors?: Partial<TOverlayColors>) {
        this.colors = { ...DEFAULT_COLORS, ...colors };

        // Create root SVG element
        this.svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgEl.setAttribute('width', String(width));
        this.svgEl.setAttribute('height', String(height));
        this.svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
        this.svgEl.style.position = 'absolute';
        this.svgEl.style.top = '0';
        this.svgEl.style.left = '0';
        this.svgEl.style.pointerEvents = 'none';
        this.svgEl.style.overflow = 'visible';

        // Create groups for layering
        this.guideGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.feedbackGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        this.svgEl.appendChild(this.guideGroup);
        this.svgEl.appendChild(this.feedbackGroup);
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

    setExercise(exercise: TExercise): void {
        this.exercise = exercise;
        this.hitDots.clear();
        this.clearGuides();
        this.clearFeedback();
        this.renderGuides();
    }

    clearExercise(): void {
        this.exercise = null;
        this.hitDots.clear();
        this.clearGuides();
        this.clearFeedback();
    }

    /**
     * Mark a dot as hit (for connect-the-dots exercises)
     */
    markDotHit(dotId: string): void {
        this.hitDots.add(dotId);
        this.updateDotVisual(dotId, true);
    }

    /**
     * Show real-time feedback at a point
     */
    showPointFeedback(point: TPoint, quality: 'good' | 'okay' | 'poor'): void {
        const color = this.colors.feedback[quality];
        const circle = this.createCircle(point.x, point.y, 4, color, color, 0);
        circle.style.opacity = '0.7';
        this.feedbackGroup.appendChild(circle);

        // Auto-remove after animation
        setTimeout(() => {
            if (circle.parentNode) {
                circle.parentNode.removeChild(circle);
            }
        }, 500);
    }

    /**
     * Clear all feedback visuals
     */
    clearFeedback(): void {
        while (this.feedbackGroup.firstChild) {
            this.feedbackGroup.removeChild(this.feedbackGroup.firstChild);
        }
    }

    /**
     * Set visibility
     */
    setVisible(visible: boolean): void {
        this.svgEl.style.display = visible ? '' : 'none';
    }

    // ----------------------------------- Rendering -----------------------------------

    private clearGuides(): void {
        while (this.guideGroup.firstChild) {
            this.guideGroup.removeChild(this.guideGroup.firstChild);
        }
    }

    private renderGuides(): void {
        if (!this.exercise) return;

        const config = this.exercise.config;

        switch (config.type) {
            case 'line':
                this.renderLineGuide(config as TLineConfig);
                break;
            case 'dots':
                this.renderDotsGuide(config as TDotsConfig);
                break;
            case 'shape':
                this.renderShapeGuide(config as TShapeConfig);
                break;
            case 'color':
                this.renderColorGuide(config as TColorConfig);
                break;
        }
    }

    private renderLineGuide(config: TLineConfig): void {
        // Render the target path as a dashed guide
        const path = this.createPath(
            config.targetPath,
            'none',
            this.colors.guide,
            config.guideStrokeWidth,
            '10,5' // dash pattern
        );
        this.guideGroup.appendChild(path);

        // Render start point (green)
        const startCircle = this.createCircle(
            config.startPoint.x,
            config.startPoint.y,
            10,
            this.colors.startPoint,
            'white',
            2
        );
        this.guideGroup.appendChild(startCircle);

        // Render end point (red)
        const endCircle = this.createCircle(
            config.endPoint.x,
            config.endPoint.y,
            10,
            this.colors.endPoint,
            'white',
            2
        );
        this.guideGroup.appendChild(endCircle);

        // Add labels
        const startLabel = this.createText(
            config.startPoint.x,
            config.startPoint.y - 15,
            'START',
            '10px',
            this.colors.startPoint
        );
        this.guideGroup.appendChild(startLabel);

        const endLabel = this.createText(
            config.endPoint.x,
            config.endPoint.y - 15,
            'END',
            '10px',
            this.colors.endPoint
        );
        this.guideGroup.appendChild(endLabel);
    }

    private renderDotsGuide(config: TDotsConfig): void {
        // Render each dot
        for (const dot of config.dots) {
            this.renderDot(dot, config.dotRadius);
        }
    }

    private renderDot(dot: TDot, radius: number): void {
        const isHit = this.hitDots.has(dot.id);
        const fillColor = isHit ? this.colors.dotHit : this.colors.dotNormal;

        // Dot circle
        const circle = this.createCircle(
            dot.x,
            dot.y,
            radius,
            fillColor,
            'white',
            2
        );
        circle.setAttribute('data-dot-id', dot.id);
        this.guideGroup.appendChild(circle);

        // Label
        if (dot.label) {
            const label = this.createText(
                dot.x,
                dot.y + 4,
                dot.label,
                '12px',
                'white',
                'middle'
            );
            label.setAttribute('data-dot-id', dot.id);
            this.guideGroup.appendChild(label);
        }

        // Start/end indicators
        if (dot.isStart) {
            const startIndicator = this.createCircle(
                dot.x,
                dot.y,
                radius + 5,
                'none',
                this.colors.startPoint,
                2
            );
            this.guideGroup.appendChild(startIndicator);
        }
        if (dot.isEnd) {
            const endIndicator = this.createCircle(
                dot.x,
                dot.y,
                radius + 5,
                'none',
                this.colors.endPoint,
                2
            );
            this.guideGroup.appendChild(endIndicator);
        }
    }

    private updateDotVisual(dotId: string, isHit: boolean): void {
        const elements = this.guideGroup.querySelectorAll(`[data-dot-id="${dotId}"]`);
        elements.forEach((el) => {
            if (el.tagName === 'circle' && el.getAttribute('fill') !== 'none') {
                el.setAttribute('fill', isHit ? this.colors.dotHit : this.colors.dotNormal);
            }
        });
    }

    private renderShapeGuide(config: TShapeConfig): void {
        if (!config.showGuide) return;

        const { targetBounds } = config;

        // Different rendering based on shape type
        switch (config.shapeType) {
            case 'triangle':
                if (config.expectedCorners && config.expectedCorners.length >= 3) {
                    const points = config.expectedCorners.map((p) => `${p.x},${p.y}`).join(' ');
                    const polygon = this.createPolygon(
                        points,
                        this.colors.guideFill,
                        this.colors.guide,
                        2,
                        '10,5'
                    );
                    this.guideGroup.appendChild(polygon);
                }
                break;

            case 'square':
            case 'rectangle':
                const rect = this.createRect(
                    targetBounds.x,
                    targetBounds.y,
                    targetBounds.width,
                    targetBounds.height,
                    this.colors.guideFill,
                    this.colors.guide,
                    2,
                    '10,5'
                );
                this.guideGroup.appendChild(rect);
                break;

            case 'diamond':
                if (config.expectedCorners && config.expectedCorners.length >= 4) {
                    const points = config.expectedCorners.map((p) => `${p.x},${p.y}`).join(' ');
                    const polygon = this.createPolygon(
                        points,
                        this.colors.guideFill,
                        this.colors.guide,
                        2,
                        '10,5'
                    );
                    this.guideGroup.appendChild(polygon);
                }
                break;

            case 'circle':
            case 'oval':
                if (config.center && config.radiusX && config.radiusY) {
                    const ellipse = this.createEllipse(
                        config.center.x,
                        config.center.y,
                        config.radiusX,
                        config.radiusY,
                        this.colors.guideFill,
                        this.colors.guide,
                        2,
                        '10,5'
                    );
                    this.guideGroup.appendChild(ellipse);
                }
                break;
        }
    }

    private renderColorGuide(config: TColorConfig): void {
        // Render region outlines
        for (const region of config.regions) {
            if (region.outlinePath) {
                const path = this.createPath(
                    region.outlinePath,
                    this.colors.guideFill,
                    this.colors.guide,
                    1.5
                );
                this.guideGroup.appendChild(path);
            } else {
                // Fallback to bounds rectangle
                const rect = this.createRect(
                    region.bounds.x,
                    region.bounds.y,
                    region.bounds.width,
                    region.bounds.height,
                    this.colors.guideFill,
                    this.colors.guide,
                    1.5
                );
                this.guideGroup.appendChild(rect);
            }

            // Add region name label
            const label = this.createText(
                region.bounds.x + region.bounds.width / 2,
                region.bounds.y + region.bounds.height / 2,
                region.name,
                '14px',
                this.colors.guide,
                'middle'
            );
            this.guideGroup.appendChild(label);
        }
    }

    // ----------------------------------- SVG Element Helpers -----------------------------------

    private createPath(
        d: string,
        fill: string,
        stroke: string,
        strokeWidth: number,
        dashArray?: string
    ): SVGPathElement {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', fill);
        path.setAttribute('stroke', stroke);
        path.setAttribute('stroke-width', String(strokeWidth));
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        if (dashArray) {
            path.setAttribute('stroke-dasharray', dashArray);
        }
        return path;
    }

    private createCircle(
        cx: number,
        cy: number,
        r: number,
        fill: string,
        stroke: string,
        strokeWidth: number
    ): SVGCircleElement {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', String(cx));
        circle.setAttribute('cy', String(cy));
        circle.setAttribute('r', String(r));
        circle.setAttribute('fill', fill);
        circle.setAttribute('stroke', stroke);
        circle.setAttribute('stroke-width', String(strokeWidth));
        return circle;
    }

    private createEllipse(
        cx: number,
        cy: number,
        rx: number,
        ry: number,
        fill: string,
        stroke: string,
        strokeWidth: number,
        dashArray?: string
    ): SVGEllipseElement {
        const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        ellipse.setAttribute('cx', String(cx));
        ellipse.setAttribute('cy', String(cy));
        ellipse.setAttribute('rx', String(rx));
        ellipse.setAttribute('ry', String(ry));
        ellipse.setAttribute('fill', fill);
        ellipse.setAttribute('stroke', stroke);
        ellipse.setAttribute('stroke-width', String(strokeWidth));
        if (dashArray) {
            ellipse.setAttribute('stroke-dasharray', dashArray);
        }
        return ellipse;
    }

    private createRect(
        x: number,
        y: number,
        width: number,
        height: number,
        fill: string,
        stroke: string,
        strokeWidth: number,
        dashArray?: string
    ): SVGRectElement {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(x));
        rect.setAttribute('y', String(y));
        rect.setAttribute('width', String(width));
        rect.setAttribute('height', String(height));
        rect.setAttribute('fill', fill);
        rect.setAttribute('stroke', stroke);
        rect.setAttribute('stroke-width', String(strokeWidth));
        if (dashArray) {
            rect.setAttribute('stroke-dasharray', dashArray);
        }
        return rect;
    }

    private createPolygon(
        points: string,
        fill: string,
        stroke: string,
        strokeWidth: number,
        dashArray?: string
    ): SVGPolygonElement {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points);
        polygon.setAttribute('fill', fill);
        polygon.setAttribute('stroke', stroke);
        polygon.setAttribute('stroke-width', String(strokeWidth));
        if (dashArray) {
            polygon.setAttribute('stroke-dasharray', dashArray);
        }
        return polygon;
    }

    private createText(
        x: number,
        y: number,
        text: string,
        fontSize: string,
        fill: string,
        anchor: string = 'middle'
    ): SVGTextElement {
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', String(x));
        textEl.setAttribute('y', String(y));
        textEl.setAttribute('font-size', fontSize);
        textEl.setAttribute('fill', fill);
        textEl.setAttribute('text-anchor', anchor);
        textEl.setAttribute('font-family', 'sans-serif');
        textEl.setAttribute('font-weight', 'bold');
        textEl.textContent = text;
        return textEl;
    }

    destroy(): void {
        if (this.svgEl.parentNode) {
            this.svgEl.parentNode.removeChild(this.svgEl);
        }
    }
}
