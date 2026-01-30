/**
 * Kindergarten Curriculum Data
 * Visual Language I curriculum content for Kindergarten (ages 5-6)
 *
 * Based on the Visual Language Kindergarten curriculum PDF:
 * - Unit: DOT/LINE (~33 exercises)
 * - Unit: SHAPE (~12 exercises)
 * - Unit: COLOR (~14 exercises)
 *
 * Total: ~58 exercises matching source material
 */

import {
    TGradeCurriculum,
    TCurriculumUnit,
    TLesson,
    TExercise,
    TLineConfig,
    TDotsConfig,
    TShapeConfig,
    TColorConfig,
    TAnimationConfig,
} from '../types';

// ============================================================================
// Canvas Constants
// ============================================================================

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const GUIDE_STROKE_WIDTH = 3;
const DEFAULT_DOT_RADIUS = 15;

// ============================================================================
// Color Definitions
// ============================================================================

const COLORS = {
    red: { r: 255, g: 0, b: 0 },
    orange: { r: 255, g: 165, b: 0 },
    yellow: { r: 255, g: 255, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    purple: { r: 128, g: 0, b: 128 },
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    brown: { r: 139, g: 69, b: 19 },
    pink: { r: 255, g: 192, b: 203 },
};

// ============================================================================
// Animation Helper Functions
// ============================================================================

function createLineAnimation(targetPath: string, duration: number = 2000): TAnimationConfig {
    // Parse the path to extract points for animation steps
    const pathParts = targetPath.split(/[ML]/i).filter(Boolean);
    const steps: TAnimationConfig['steps'] = [];

    pathParts.forEach((part, index) => {
        const coords = part.trim().split(/[\s,]+/).map(Number);
        if (coords.length >= 2) {
            const x = coords[0];
            const y = coords[1];
            steps.push({
                action: index === 0 ? 'moveTo' : 'lineTo',
                params: { x, y },
                duration: index === 0 ? 0 : duration / pathParts.length,
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

function createDotsAnimation(dots: TDotsConfig['dots'], duration: number = 4000): TAnimationConfig {
    const steps: TAnimationConfig['steps'] = [];
    const stepDuration = duration / (dots.length * 2);

    dots.forEach((dot, index) => {
        // Highlight dot
        steps.push({
            action: 'highlightDot',
            params: { id: dot.id, x: dot.x, y: dot.y },
            duration: stepDuration,
        });
        // Connect to next dot (if not last)
        if (index < dots.length - 1) {
            const nextDot = dots[index + 1];
            steps.push({
                action: 'connectDots',
                params: { fromX: dot.x, fromY: dot.y, toX: nextDot.x, toY: nextDot.y },
                duration: stepDuration,
            });
        }
    });

    return {
        type: 'sequence',
        steps,
        duration,
        loop: true,
    };
}

// ============================================================================
// LINE UNIT - Lesson 1: Line Tracing (17 exercises)
// ============================================================================

// --- Straight Lines (3 exercises) ---

const straightLineHorizontal: TExercise = {
    id: 'k-line-straight-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Straight Lines - Horizontal',
    instructions: 'Trace the dashed lines from left to right.',
    difficulty: 1,
    config: {
        type: 'line',
        lineType: 'straight',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 120 L 550 120 M 50 200 L 550 200 M 50 280 L 550 280',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 20,
        startPoint: { x: 50, y: 120 },
        endPoint: { x: 550, y: 280 },
        guideStyle: 'dashed',
        multiLine: true,
    } as TLineConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'horizontal straight lines',
        commonMistakes: ['wobbling', 'lifting pen mid-stroke', 'going too fast'],
        successCriteria: 'Smooth, straight lines from left to right',
    },
    order: 1,
    demonstrationAnimation: createLineAnimation('M 50 120 L 550 120', 1500),
};

const straightLineVertical: TExercise = {
    id: 'k-line-straight-2',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Straight Lines - Vertical',
    instructions: 'Trace the dashed lines from top to bottom.',
    difficulty: 1,
    config: {
        type: 'line',
        lineType: 'straight',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 150 50 L 150 350 M 300 50 L 300 350 M 450 50 L 450 350',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 20,
        startPoint: { x: 150, y: 50 },
        endPoint: { x: 450, y: 350 },
        guideStyle: 'dashed',
        multiLine: true,
    } as TLineConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'vertical straight lines',
        commonMistakes: ['wobbling', 'not keeping the line straight'],
        successCriteria: 'Smooth, straight lines from top to bottom',
    },
    order: 2,
    demonstrationAnimation: createLineAnimation('M 150 50 L 150 350', 1500),
};

const straightLineDiagonal: TExercise = {
    id: 'k-line-straight-3',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Straight Lines - Diagonal',
    instructions: 'Trace the diagonal lines in both directions.',
    difficulty: 1,
    config: {
        type: 'line',
        lineType: 'straight',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 50 L 275 350 M 325 50 L 550 350 M 550 50 L 325 350 M 275 50 L 50 350',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 50, y: 50 },
        endPoint: { x: 550, y: 350 },
        guideStyle: 'dashed',
        multiLine: true,
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'diagonal straight lines',
        commonMistakes: ['curving the line', 'not following the angle'],
        successCriteria: 'Straight diagonal lines at consistent angles',
    },
    order: 3,
    demonstrationAnimation: createLineAnimation('M 50 50 L 275 350', 1500),
};

// --- Curved Lines (3 exercises) ---

const curvedLineLargeArc: TExercise = {
    id: 'k-line-curved-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Curved Line - Large Arc',
    instructions: 'Draw a smooth curved line following the dotted guide.',
    difficulty: 1,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 100 300 Q 300 50 500 300',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 100, y: 300 },
        endPoint: { x: 500, y: 300 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'curved lines',
        commonMistakes: ['making sharp angles', 'not following the curve', 'uneven pressure'],
        successCriteria: 'A smooth arc that follows the guide curve',
    },
    order: 4,
    demonstrationAnimation: createLineAnimation('M 100 300 L 300 50 L 500 300', 2000),
};

const curvedLineSmallArcs: TExercise = {
    id: 'k-line-curved-2',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Curved Lines - Row of Arcs',
    instructions: 'Trace the row of small arcs like a bumpy caterpillar.',
    difficulty: 1,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 250 Q 100 150 150 250 Q 200 150 250 250 Q 300 150 350 250 Q 400 150 450 250 Q 500 150 550 250',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 50, y: 250 },
        endPoint: { x: 550, y: 250 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'repeating curved lines',
        commonMistakes: ['arcs uneven', 'not touching the base line'],
        successCriteria: 'Even, smooth arcs in a row',
    },
    order: 5,
    demonstrationAnimation: createLineAnimation('M 50 250 L 100 150 L 150 250', 2500),
};

const curvedLineCircleArcs: TExercise = {
    id: 'k-line-curved-3',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Curved Lines - Circle Arcs',
    instructions: 'Trace the large semi-circles from left to right.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 100 200 A 100 100 0 0 1 300 200 M 300 200 A 100 100 0 0 1 500 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 30,
        startPoint: { x: 100, y: 200 },
        endPoint: { x: 500, y: 200 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'circular arcs',
        commonMistakes: ['arcs too flat', 'arcs too pointy'],
        successCriteria: 'Smooth, rounded semi-circles',
    },
    order: 6,
    demonstrationAnimation: createLineAnimation('M 100 200 L 200 100 L 300 200', 2000),
};

// --- Wavy Lines (3 exercises) ---

const wavyLineSimple: TExercise = {
    id: 'k-line-wavy-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Wavy Line - Simple Wave',
    instructions: 'Draw a simple wavy line like gentle ocean waves.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'wavy',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 200 Q 125 150 200 200 Q 275 250 350 200 Q 425 150 500 200 Q 575 250 550 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 30,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 550, y: 200 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'wavy lines',
        commonMistakes: ['waves too small', 'waves uneven', 'not flowing smoothly'],
        successCriteria: 'Smooth, even waves that flow from left to right',
    },
    order: 7,
    demonstrationAnimation: createLineAnimation('M 50 200 L 200 150 L 350 250 L 500 200', 2500),
};

const wavyLineTall: TExercise = {
    id: 'k-line-wavy-2',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Wavy Line - Tall Waves',
    instructions: 'Draw tall waves that reach high and low.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'wavy',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 200 Q 100 50 175 200 Q 250 350 325 200 Q 400 50 475 200 Q 550 350 550 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 35,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 550, y: 200 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'tall wavy lines',
        commonMistakes: ['waves not tall enough', 'uneven heights'],
        successCriteria: 'Tall, flowing waves with big peaks and valleys',
    },
    order: 8,
    demonstrationAnimation: createLineAnimation('M 50 200 L 175 50 L 325 350 L 475 50', 3000),
};

const wavyLineComplex: TExercise = {
    id: 'k-line-wavy-3',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Wavy Line - Complex Pattern',
    instructions: 'Draw a complex wavy pattern with varying wave sizes.',
    difficulty: 3,
    config: {
        type: 'line',
        lineType: 'wavy',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 200 Q 75 150 100 200 Q 150 280 200 200 Q 225 160 250 200 Q 325 300 400 200 Q 450 130 500 200 Q 525 230 550 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 35,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 550, y: 200 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: 'complex wavy lines',
        commonMistakes: ['not varying the wave heights', 'losing the rhythm'],
        successCriteria: 'Varied wave pattern with different sized waves',
    },
    order: 9,
    demonstrationAnimation: createLineAnimation('M 50 200 L 100 150 L 200 280 L 400 130 L 550 200', 3500),
};

// --- Zigzag Lines (3 exercises) ---

const zigzagLineMountain: TExercise = {
    id: 'k-line-zigzag-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Zigzag Line - Mountains',
    instructions: 'Draw a zigzag line with sharp mountain peaks.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'zigzag',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 300 L 150 100 L 250 300 L 350 100 L 450 300 L 550 100',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 50, y: 300 },
        endPoint: { x: 550, y: 100 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'zigzag lines',
        commonMistakes: ['rounding the corners', 'uneven peaks', 'not reaching the points'],
        successCriteria: 'Sharp angles with consistent peaks and valleys',
    },
    order: 10,
    demonstrationAnimation: createLineAnimation('M 50 300 L 150 100 L 250 300 L 350 100', 2500),
};

const zigzagLineVaried: TExercise = {
    id: 'k-line-zigzag-2',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Zigzag Line - Varied Heights',
    instructions: 'Draw a zigzag with varied peak heights.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'zigzag',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 250 L 100 100 L 175 250 L 250 150 L 325 250 L 400 50 L 475 250 L 550 180',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 30,
        startPoint: { x: 50, y: 250 },
        endPoint: { x: 550, y: 180 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'varied zigzag lines',
        commonMistakes: ['making all peaks the same', 'rounding corners'],
        successCriteria: 'Sharp zigzag with different height peaks',
    },
    order: 11,
    demonstrationAnimation: createLineAnimation('M 50 250 L 100 100 L 175 250 L 400 50 L 550 180', 3000),
};

const zigzagLineHorizontal: TExercise = {
    id: 'k-line-zigzag-3',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Zigzag Line - Horizontal Pattern',
    instructions: 'Draw a horizontal zigzag pattern like a heartbeat.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'zigzag',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 200 L 100 150 L 150 250 L 200 150 L 250 250 L 300 150 L 350 250 L 400 150 L 450 250 L 500 150 L 550 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 550, y: 200 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'horizontal zigzag',
        commonMistakes: ['uneven spacing', 'rounding the points'],
        successCriteria: 'Even zigzag pattern with consistent spacing',
    },
    order: 12,
    demonstrationAnimation: createLineAnimation('M 50 200 L 100 150 L 150 250 L 200 150', 2500),
};

// --- Broken Lines (3 exercises) ---

const brokenLineHorizontal: TExercise = {
    id: 'k-line-broken-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Broken Line - Horizontal Dashes',
    instructions: 'Draw a broken (dashed) line with short horizontal segments.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'broken',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 200 L 100 200 M 130 200 L 180 200 M 210 200 L 260 200 M 290 200 L 340 200 M 370 200 L 420 200 M 450 200 L 500 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 20,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 500, y: 200 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'broken lines',
        commonMistakes: ['segments too long', 'gaps uneven', 'not lifting pen'],
        successCriteria: 'Even dashes with consistent gaps between them',
    },
    order: 13,
    demonstrationAnimation: createLineAnimation('M 50 200 L 100 200', 1500),
};

const brokenLineVertical: TExercise = {
    id: 'k-line-broken-2',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Broken Line - Vertical Dashes',
    instructions: 'Draw vertical broken lines from top to bottom.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'broken',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 200 50 L 200 100 M 200 130 L 200 180 M 200 210 L 200 260 M 200 290 L 200 340 M 400 50 L 400 100 M 400 130 L 400 180 M 400 210 L 400 260 M 400 290 L 400 340',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 20,
        startPoint: { x: 200, y: 50 },
        endPoint: { x: 400, y: 340 },
        guideStyle: 'dashed',
        multiLine: true,
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'vertical broken lines',
        commonMistakes: ['segments uneven', 'not staying straight'],
        successCriteria: 'Even vertical dashes with consistent gaps',
    },
    order: 14,
    demonstrationAnimation: createLineAnimation('M 200 50 L 200 100', 1500),
};

const brokenLineDiagonal: TExercise = {
    id: 'k-line-broken-3',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Broken Line - Diagonal Dashes',
    instructions: 'Draw diagonal broken lines.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'broken',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 50 L 100 100 M 130 130 L 180 180 M 210 210 L 260 260 M 290 290 L 340 340 M 450 50 L 400 100 M 370 130 L 320 180 M 290 210 L 240 260 M 210 290 L 160 340',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 50, y: 50 },
        endPoint: { x: 340, y: 340 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'diagonal broken lines',
        commonMistakes: ['segments not aligned', 'varying angles'],
        successCriteria: 'Even diagonal dashes maintaining consistent angle',
    },
    order: 15,
    demonstrationAnimation: createLineAnimation('M 50 50 L 100 100', 1500),
};

// --- Spiral Lines (2 exercises) ---

const spiralLineSmall: TExercise = {
    id: 'k-line-spiral-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Spiral Line - Small Spiral',
    instructions: 'Draw a small spiral starting from the center.',
    difficulty: 3,
    config: {
        type: 'line',
        lineType: 'spiral',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 300 200 C 300 185 315 170 330 170 C 360 170 380 200 380 230 C 380 275 340 305 290 305 C 225 305 185 255 185 190',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 35,
        startPoint: { x: 300, y: 200 },
        endPoint: { x: 185, y: 190 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'spiral lines',
        commonMistakes: ['spirals too tight', 'not expanding evenly', 'crossing lines'],
        successCriteria: 'A smooth spiral that grows larger from center outward',
    },
    order: 16,
    demonstrationAnimation: createLineAnimation('M 300 200 L 330 170 L 380 230 L 290 305 L 185 190', 3000),
};

const spiralLineLarge: TExercise = {
    id: 'k-line-spiral-2',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Spiral Line - Large Spiral',
    instructions: 'Draw a large spiral with an inner circle starting point.',
    difficulty: 3,
    config: {
        type: 'line',
        lineType: 'spiral',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 300 200 C 300 180 320 160 340 160 C 380 160 400 200 400 240 C 400 300 340 340 280 340 C 200 340 160 280 160 200 C 160 100 240 60 340 60 C 460 60 520 160 520 280',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 40,
        startPoint: { x: 300, y: 200 },
        endPoint: { x: 520, y: 280 },
        guideStyle: 'dashed',
    } as TLineConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: 'large spiral lines',
        commonMistakes: ['loops too close', 'not growing evenly'],
        successCriteria: 'A smooth, expanding spiral with even spacing between loops',
    },
    order: 17,
    demonstrationAnimation: createLineAnimation('M 300 200 L 340 160 L 400 240 L 280 340 L 160 200 L 340 60 L 520 280', 4000),
};

// ============================================================================
// DOT UNIT - Lesson 2: Connect-the-Dots Letters (4 exercises)
// ============================================================================

const connectDotsMatchAE: TExercise = {
    id: 'k-dots-match-ae',
    unit: 'dot',
    lessonId: 'k-connect-dots-letters',
    title: 'Match Letters A-E',
    instructions: 'Connect each letter on the left to its matching letter on the right.',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'A1', x: 100, y: 80, label: 'A' },
            { id: 'B1', x: 100, y: 140, label: 'B' },
            { id: 'C1', x: 100, y: 200, label: 'C' },
            { id: 'D1', x: 100, y: 260, label: 'D' },
            { id: 'E1', x: 100, y: 320, label: 'E' },
            { id: 'C2', x: 500, y: 80, label: 'C' },
            { id: 'A2', x: 500, y: 140, label: 'A' },
            { id: 'E2', x: 500, y: 200, label: 'E' },
            { id: 'B2', x: 500, y: 260, label: 'B' },
            { id: 'D2', x: 500, y: 320, label: 'D' },
        ],
        requireOrder: false,
        dotRadius: 20,
        resultingShape: 'matching letters',
    } as TDotsConfig,
    passingScore: 80,
    feedbackHints: {
        skillName: 'letter matching',
        commonMistakes: ['connecting wrong letters', 'missing connections'],
        successCriteria: 'All matching letters connected correctly',
    },
    order: 1,
};

const connectDotsMatchFJ: TExercise = {
    id: 'k-dots-match-fj',
    unit: 'dot',
    lessonId: 'k-connect-dots-letters',
    title: 'Match Letters F-J',
    instructions: 'Connect each letter on the left to its matching letter on the right.',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'F1', x: 100, y: 80, label: 'F' },
            { id: 'G1', x: 100, y: 140, label: 'G' },
            { id: 'H1', x: 100, y: 200, label: 'H' },
            { id: 'I1', x: 100, y: 260, label: 'I' },
            { id: 'J1', x: 100, y: 320, label: 'J' },
            { id: 'H2', x: 500, y: 80, label: 'H' },
            { id: 'J2', x: 500, y: 140, label: 'J' },
            { id: 'F2', x: 500, y: 200, label: 'F' },
            { id: 'I2', x: 500, y: 260, label: 'I' },
            { id: 'G2', x: 500, y: 320, label: 'G' },
        ],
        requireOrder: false,
        dotRadius: 20,
        resultingShape: 'matching letters',
    } as TDotsConfig,
    passingScore: 80,
    feedbackHints: {
        skillName: 'letter matching',
        commonMistakes: ['connecting wrong letters', 'confusing similar letters'],
        successCriteria: 'All matching letters connected correctly',
    },
    order: 2,
};

const connectDotsMatch15: TExercise = {
    id: 'k-dots-match-15',
    unit: 'dot',
    lessonId: 'k-connect-dots-letters',
    title: 'Match Numbers 1-5',
    instructions: 'Connect each number on the left to its matching number on the right.',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '11', x: 100, y: 80, label: '1' },
            { id: '21', x: 100, y: 140, label: '2' },
            { id: '31', x: 100, y: 200, label: '3' },
            { id: '41', x: 100, y: 260, label: '4' },
            { id: '51', x: 100, y: 320, label: '5' },
            { id: '32', x: 500, y: 80, label: '3' },
            { id: '52', x: 500, y: 140, label: '5' },
            { id: '12', x: 500, y: 200, label: '1' },
            { id: '42', x: 500, y: 260, label: '4' },
            { id: '22', x: 500, y: 320, label: '2' },
        ],
        requireOrder: false,
        dotRadius: 20,
        resultingShape: 'matching numbers',
    } as TDotsConfig,
    passingScore: 80,
    feedbackHints: {
        skillName: 'number matching',
        commonMistakes: ['connecting wrong numbers'],
        successCriteria: 'All matching numbers connected correctly',
    },
    order: 3,
};

const connectDotsMatchColors: TExercise = {
    id: 'k-dots-match-colors',
    unit: 'dot',
    lessonId: 'k-connect-dots-letters',
    title: 'Match Colors',
    instructions: 'Connect each colored dot to its matching colored dot.',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'red1', x: 100, y: 100, label: 'R' },
            { id: 'blue1', x: 100, y: 180, label: 'B' },
            { id: 'yellow1', x: 100, y: 260, label: 'Y' },
            { id: 'green1', x: 100, y: 340, label: 'G' },
            { id: 'yellow2', x: 500, y: 100, label: 'Y' },
            { id: 'green2', x: 500, y: 180, label: 'G' },
            { id: 'red2', x: 500, y: 260, label: 'R' },
            { id: 'blue2', x: 500, y: 340, label: 'B' },
        ],
        requireOrder: false,
        dotRadius: 22,
        resultingShape: 'matching colors',
    } as TDotsConfig,
    passingScore: 80,
    feedbackHints: {
        skillName: 'color matching',
        commonMistakes: ['connecting wrong colors'],
        successCriteria: 'All matching colors connected correctly',
    },
    order: 4,
};

// ============================================================================
// DOT UNIT - Lesson 3: Count and Match (4 exercises)
// ============================================================================

const dotsCountMatch1: TExercise = {
    id: 'k-dots-count-match-1',
    unit: 'dot',
    lessonId: 'k-connect-dots-numbers',
    title: 'Count and Match - Dots',
    instructions: 'Connect each number to the group with that many dots.',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'num1', x: 80, y: 100, label: '1' },
            { id: 'num2', x: 80, y: 200, label: '2' },
            { id: 'num3', x: 80, y: 300, label: '3' },
            { id: 'dots2', x: 520, y: 100, label: '••' },
            { id: 'dots3', x: 520, y: 200, label: '•••' },
            { id: 'dots1', x: 520, y: 300, label: '•' },
        ],
        requireOrder: false,
        dotRadius: 25,
        resultingShape: 'number matching',
    } as TDotsConfig,
    passingScore: 80,
    feedbackHints: {
        skillName: 'counting',
        commonMistakes: ['miscounting dots', 'connecting wrong numbers'],
        successCriteria: 'Each number connected to the matching dot count',
    },
    order: 1,
};

const dotsCountMatch2: TExercise = {
    id: 'k-dots-count-match-2',
    unit: 'dot',
    lessonId: 'k-connect-dots-numbers',
    title: 'Count and Match - Acorns',
    instructions: 'Connect each number to the group with that many acorns.',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'num2', x: 80, y: 100, label: '2' },
            { id: 'num4', x: 80, y: 200, label: '4' },
            { id: 'num5', x: 80, y: 300, label: '5' },
            { id: 'acorns5', x: 520, y: 100, label: '5x' },
            { id: 'acorns2', x: 520, y: 200, label: '2x' },
            { id: 'acorns4', x: 520, y: 300, label: '4x' },
        ],
        requireOrder: false,
        dotRadius: 25,
        resultingShape: 'counting acorns',
    } as TDotsConfig,
    passingScore: 80,
    feedbackHints: {
        skillName: 'counting objects',
        commonMistakes: ['miscounting', 'skipping objects'],
        successCriteria: 'Each number connected to matching acorn count',
    },
    order: 2,
};

const dotsCountMatch3: TExercise = {
    id: 'k-dots-count-match-3',
    unit: 'dot',
    lessonId: 'k-connect-dots-numbers',
    title: 'Count and Match - Apples',
    instructions: 'Connect each number to the group with that many apples.',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'num3', x: 80, y: 100, label: '3' },
            { id: 'num1', x: 80, y: 200, label: '1' },
            { id: 'num4', x: 80, y: 300, label: '4' },
            { id: 'apples1', x: 520, y: 100, label: '1x' },
            { id: 'apples4', x: 520, y: 200, label: '4x' },
            { id: 'apples3', x: 520, y: 300, label: '3x' },
        ],
        requireOrder: false,
        dotRadius: 25,
        resultingShape: 'counting apples',
    } as TDotsConfig,
    passingScore: 80,
    feedbackHints: {
        skillName: 'counting objects',
        commonMistakes: ['miscounting'],
        successCriteria: 'Each number connected to matching apple count',
    },
    order: 3,
};

const dotsCountMatch4: TExercise = {
    id: 'k-dots-count-match-4',
    unit: 'dot',
    lessonId: 'k-connect-dots-numbers',
    title: 'Count and Match - Bananas',
    instructions: 'Connect each number to the group with that many bananas.',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'num6', x: 80, y: 100, label: '6' },
            { id: 'num3', x: 80, y: 200, label: '3' },
            { id: 'num5', x: 80, y: 300, label: '5' },
            { id: 'bananas3', x: 520, y: 100, label: '3x' },
            { id: 'bananas5', x: 520, y: 200, label: '5x' },
            { id: 'bananas6', x: 520, y: 300, label: '6x' },
        ],
        requireOrder: false,
        dotRadius: 25,
        resultingShape: 'counting bananas',
    } as TDotsConfig,
    passingScore: 80,
    feedbackHints: {
        skillName: 'counting to 6',
        commonMistakes: ['miscounting larger numbers'],
        successCriteria: 'Each number connected to matching banana count',
    },
    order: 4,
};

// ============================================================================
// DOT UNIT - Lesson 4: Connect-the-Dots Pictures (12 exercises)
// ============================================================================

const dotsFlower: TExercise = {
    id: 'k-dots-flower',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Flower',
    instructions: 'Connect dots A-B-C to complete the flower!',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'A', x: 300, y: 100, label: 'A', isStart: true },
            { id: 'B', x: 300, y: 200, label: 'B' },
            { id: 'C', x: 300, y: 350, label: 'C', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'flower stem',
        backgroundImage: 'flower-petals.svg',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'connect-the-dots',
        commonMistakes: ['skipping dots', 'wrong order'],
        successCriteria: 'All dots connected A to C to complete the flower',
    },
    order: 1,
};

const dotsSnowman: TExercise = {
    id: 'k-dots-snowman',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Snowman',
    instructions: 'Connect dots A-B-C-D to build a snowman!',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'A', x: 300, y: 60, label: 'A', isStart: true },
            { id: 'B', x: 300, y: 140, label: 'B' },
            { id: 'C', x: 300, y: 240, label: 'C' },
            { id: 'D', x: 300, y: 360, label: 'D', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'snowman',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'connect-the-dots',
        commonMistakes: ['connecting out of order'],
        successCriteria: 'All dots connected A through D',
    },
    order: 2,
};

const dotsHouse: TExercise = {
    id: 'k-dots-house',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'House',
    instructions: 'Connect dots A-B-C-D-E to build a house!',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'A', x: 300, y: 50, label: 'A', isStart: true },
            { id: 'B', x: 150, y: 150, label: 'B' },
            { id: 'C', x: 150, y: 350, label: 'C' },
            { id: 'D', x: 450, y: 350, label: 'D' },
            { id: 'E', x: 450, y: 150, label: 'E', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'house',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'connect-the-dots',
        commonMistakes: ['missing the roof point', 'wrong sequence'],
        successCriteria: 'All dots connected to form a house shape',
    },
    order: 3,
};

const dotsBoy: TExercise = {
    id: 'k-dots-boy',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Boy',
    instructions: 'Connect dots A through G to draw a boy!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'A', x: 300, y: 40, label: 'A', isStart: true },
            { id: 'B', x: 250, y: 100, label: 'B' },
            { id: 'C', x: 200, y: 180, label: 'C' },
            { id: 'D', x: 300, y: 200, label: 'D' },
            { id: 'E', x: 400, y: 180, label: 'E' },
            { id: 'F', x: 350, y: 100, label: 'F' },
            { id: 'G', x: 300, y: 350, label: 'G', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'boy figure',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'connect-the-dots',
        commonMistakes: ['skipping dots', 'wrong sequence'],
        successCriteria: 'All dots connected A through G',
    },
    order: 4,
};

const dotsTrain: TExercise = {
    id: 'k-dots-train',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Train',
    instructions: 'Connect dots A through F to complete the train!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'A', x: 80, y: 200, label: 'A', isStart: true },
            { id: 'B', x: 180, y: 200, label: 'B' },
            { id: 'C', x: 180, y: 120, label: 'C' },
            { id: 'D', x: 350, y: 120, label: 'D' },
            { id: 'E', x: 350, y: 200, label: 'E' },
            { id: 'F', x: 520, y: 200, label: 'F', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'train',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'connect-the-dots',
        commonMistakes: ['missing train car shape'],
        successCriteria: 'All dots connected to form a train',
    },
    order: 5,
};

const dotsFish: TExercise = {
    id: 'k-dots-fish',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Fish',
    instructions: 'Connect dots A through H to complete the fish!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: 'A', x: 80, y: 200, label: 'A', isStart: true },
            { id: 'B', x: 150, y: 120, label: 'B' },
            { id: 'C', x: 280, y: 100, label: 'C' },
            { id: 'D', x: 400, y: 140, label: 'D' },
            { id: 'E', x: 500, y: 200, label: 'E' },
            { id: 'F', x: 400, y: 260, label: 'F' },
            { id: 'G', x: 280, y: 300, label: 'G' },
            { id: 'H', x: 150, y: 280, label: 'H', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'fish',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'connect-the-dots',
        commonMistakes: ['skipping dots', 'wrong order'],
        successCriteria: 'All dots connected A through H to form a fish',
    },
    order: 6,
};

const dotsAirplane: TExercise = {
    id: 'k-dots-airplane',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Airplane',
    instructions: 'Connect dots 1 through 10 to build an airplane!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 50, y: 200, label: '1', isStart: true },
            { id: '2', x: 120, y: 200, label: '2' },
            { id: '3', x: 150, y: 150, label: '3' },
            { id: '4', x: 200, y: 200, label: '4' },
            { id: '5', x: 350, y: 200, label: '5' },
            { id: '6', x: 400, y: 120, label: '6' },
            { id: '7', x: 450, y: 200, label: '7' },
            { id: '8', x: 520, y: 200, label: '8' },
            { id: '9', x: 550, y: 180, label: '9' },
            { id: '10', x: 520, y: 250, label: '10', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'airplane',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'counting to 10',
        commonMistakes: ['skipping numbers', 'wrong order'],
        successCriteria: 'All dots connected 1 through 10',
    },
    order: 7,
};

const dotsKite: TExercise = {
    id: 'k-dots-kite',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Kite',
    instructions: 'Connect dots 1 through 10 to make a kite!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 300, y: 50, label: '1', isStart: true },
            { id: '2', x: 200, y: 150, label: '2' },
            { id: '3', x: 300, y: 250, label: '3' },
            { id: '4', x: 400, y: 150, label: '4' },
            { id: '5', x: 300, y: 50, label: '5' },
            { id: '6', x: 300, y: 280, label: '6' },
            { id: '7', x: 280, y: 310, label: '7' },
            { id: '8', x: 300, y: 340, label: '8' },
            { id: '9', x: 320, y: 310, label: '9' },
            { id: '10', x: 300, y: 380, label: '10', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'kite with tail',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'counting to 10',
        commonMistakes: ['skipping numbers', 'wrong order'],
        successCriteria: 'All dots connected to form a kite with tail',
    },
    order: 8,
};

const dotsTulip: TExercise = {
    id: 'k-dots-tulip',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Tulip',
    instructions: 'Connect dots 1 through 10 to draw a tulip flower!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 220, y: 150, label: '1', isStart: true },
            { id: '2', x: 260, y: 80, label: '2' },
            { id: '3', x: 300, y: 50, label: '3' },
            { id: '4', x: 340, y: 80, label: '4' },
            { id: '5', x: 380, y: 150, label: '5' },
            { id: '6', x: 340, y: 180, label: '6' },
            { id: '7', x: 300, y: 200, label: '7' },
            { id: '8', x: 260, y: 180, label: '8' },
            { id: '9', x: 300, y: 280, label: '9' },
            { id: '10', x: 300, y: 380, label: '10', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'tulip flower',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'counting to 10',
        commonMistakes: ['skipping numbers'],
        successCriteria: 'All dots connected to form a tulip',
    },
    order: 9,
};

const dotsDog: TExercise = {
    id: 'k-dots-dog',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Dog',
    instructions: 'Connect dots 1 through 10 to draw a cute dog!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 100, y: 150, label: '1', isStart: true },
            { id: '2', x: 150, y: 100, label: '2' },
            { id: '3', x: 200, y: 80, label: '3' },
            { id: '4', x: 300, y: 100, label: '4' },
            { id: '5', x: 400, y: 150, label: '5' },
            { id: '6', x: 450, y: 200, label: '6' },
            { id: '7', x: 400, y: 280, label: '7' },
            { id: '8', x: 300, y: 300, label: '8' },
            { id: '9', x: 200, y: 280, label: '9' },
            { id: '10', x: 150, y: 200, label: '10', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'dog',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'counting to 10',
        commonMistakes: ['skipping numbers'],
        successCriteria: 'All dots connected to form a dog',
    },
    order: 10,
};

const dotsDuck: TExercise = {
    id: 'k-dots-duck',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Duck',
    instructions: 'Connect dots 1 through 9 to draw a duck!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 80, y: 180, label: '1', isStart: true },
            { id: '2', x: 120, y: 120, label: '2' },
            { id: '3', x: 180, y: 100, label: '3' },
            { id: '4', x: 280, y: 120, label: '4' },
            { id: '5', x: 380, y: 150, label: '5' },
            { id: '6', x: 480, y: 200, label: '6' },
            { id: '7', x: 400, y: 280, label: '7' },
            { id: '8', x: 250, y: 300, label: '8' },
            { id: '9', x: 120, y: 250, label: '9', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'duck',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'counting to 9',
        commonMistakes: ['skipping numbers'],
        successCriteria: 'All dots connected to form a duck',
    },
    order: 11,
};

const dotsOwl: TExercise = {
    id: 'k-dots-owl',
    unit: 'dot',
    lessonId: 'k-connect-dots-pictures',
    title: 'Owl',
    instructions: 'Connect dots 1 through 10 to draw a wise owl!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 200, y: 80, label: '1', isStart: true },
            { id: '2', x: 150, y: 140, label: '2' },
            { id: '3', x: 150, y: 220, label: '3' },
            { id: '4', x: 200, y: 300, label: '4' },
            { id: '5', x: 300, y: 340, label: '5' },
            { id: '6', x: 400, y: 300, label: '6' },
            { id: '7', x: 450, y: 220, label: '7' },
            { id: '8', x: 450, y: 140, label: '8' },
            { id: '9', x: 400, y: 80, label: '9' },
            { id: '10', x: 300, y: 60, label: '10', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'owl',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'counting to 10',
        commonMistakes: ['skipping numbers'],
        successCriteria: 'All dots connected to form an owl',
    },
    order: 12,
};

// ============================================================================
// SHAPE UNIT - Lesson 1: Basic Shapes Introduction (6 exercises)
// ============================================================================

const shapeTriangleIntro: TExercise = {
    id: 'k-shape-triangle-intro',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Triangle Introduction',
    instructions: 'Connect dots 1-2-3-1 to draw a triangle with 3 sides!',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 300, y: 80, label: '1', isStart: true },
            { id: '2', x: 150, y: 320, label: '2' },
            { id: '3', x: 450, y: 320, label: '3' },
            { id: '4', x: 300, y: 80, label: '1', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'triangle',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'triangle shapes',
        commonMistakes: ['not closing the shape', 'missing a corner'],
        successCriteria: 'A closed triangle with 3 corners',
    },
    order: 1,
};

const shapeSquareIntro: TExercise = {
    id: 'k-shape-square-intro',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Square Introduction',
    instructions: 'Connect dots 1-2-3-4-1 to draw a square with 4 equal sides!',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 175, y: 75, label: '1', isStart: true },
            { id: '2', x: 425, y: 75, label: '2' },
            { id: '3', x: 425, y: 325, label: '3' },
            { id: '4', x: 175, y: 325, label: '4' },
            { id: '5', x: 175, y: 75, label: '1', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'square',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'square shapes',
        commonMistakes: ['not closing the shape', 'sides unequal'],
        successCriteria: 'A closed square with 4 equal sides',
    },
    order: 2,
};

const shapeDiamondIntro: TExercise = {
    id: 'k-shape-diamond-intro',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Diamond Introduction',
    instructions: 'Connect dots 1-2-3-4-1 to draw a diamond (tilted square)!',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 300, y: 50, label: '1', isStart: true },
            { id: '2', x: 450, y: 200, label: '2' },
            { id: '3', x: 300, y: 350, label: '3' },
            { id: '4', x: 150, y: 200, label: '4' },
            { id: '5', x: 300, y: 50, label: '1', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'diamond',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'diamond shapes',
        commonMistakes: ['not closing the shape', 'corners not pointed'],
        successCriteria: 'A closed diamond with 4 pointed corners',
    },
    order: 3,
};

const shapeRectangleIntro: TExercise = {
    id: 'k-shape-rectangle-intro',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Rectangle Introduction',
    instructions: 'Connect dots 1-2-3-4-1 to draw a rectangle!',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 100, y: 125, label: '1', isStart: true },
            { id: '2', x: 500, y: 125, label: '2' },
            { id: '3', x: 500, y: 275, label: '3' },
            { id: '4', x: 100, y: 275, label: '4' },
            { id: '5', x: 100, y: 125, label: '1', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'rectangle',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'rectangle shapes',
        commonMistakes: ['not closing the shape'],
        successCriteria: 'A closed rectangle - longer than it is tall',
    },
    order: 4,
};

const shapeCircleIntro: TExercise = {
    id: 'k-shape-circle-intro',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Circle Introduction',
    instructions: 'Connect the numbered dots to draw a circle - a perfectly round shape!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 300, y: 75, label: '1', isStart: true },
            { id: '2', x: 400, y: 105, label: '2' },
            { id: '3', x: 460, y: 180, label: '3' },
            { id: '4', x: 460, y: 270, label: '4' },
            { id: '5', x: 400, y: 345, label: '5' },
            { id: '6', x: 300, y: 375, label: '6' },
            { id: '7', x: 200, y: 345, label: '7' },
            { id: '8', x: 140, y: 270, label: '8' },
            { id: '9', x: 140, y: 180, label: '9' },
            { id: '10', x: 200, y: 105, label: '10' },
            { id: '11', x: 300, y: 75, label: '1', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: 12,
        resultingShape: 'circle',
    } as TDotsConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'circle shapes',
        commonMistakes: ['not smooth', 'not closing the shape'],
        successCriteria: 'A smooth, closed circle',
    },
    order: 5,
};

const shapeOvalIntro: TExercise = {
    id: 'k-shape-oval-intro',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Oval Introduction',
    instructions: 'Connect the numbered dots to draw an oval - like a stretched circle!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 300, y: 125, label: '1', isStart: true },
            { id: '2', x: 400, y: 150, label: '2' },
            { id: '3', x: 475, y: 200, label: '3' },
            { id: '4', x: 475, y: 250, label: '4' },
            { id: '5', x: 400, y: 300, label: '5' },
            { id: '6', x: 300, y: 325, label: '6' },
            { id: '7', x: 200, y: 300, label: '7' },
            { id: '8', x: 125, y: 250, label: '8' },
            { id: '9', x: 125, y: 200, label: '9' },
            { id: '10', x: 200, y: 150, label: '10' },
            { id: '11', x: 300, y: 125, label: '1', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: 12,
        resultingShape: 'oval',
    } as TDotsConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'oval shapes',
        commonMistakes: ['too round', 'not closing the shape'],
        successCriteria: 'A smooth oval - wider than it is tall',
    },
    order: 6,
};

// ============================================================================
// SHAPE UNIT - Lesson 2: Shape Practice (6 exercises)
// ============================================================================

const shapeTrianglePractice: TExercise = {
    id: 'k-shape-triangle-practice',
    unit: 'shape',
    lessonId: 'k-shape-practice',
    title: 'Triangle Practice',
    instructions: 'Draw triangles by tracing the guides. Practice makes perfect!',
    difficulty: 1,
    config: {
        type: 'shape',
        shapeType: 'triangle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 150, y: 80, width: 300, height: 260 },
        expectedCorners: [
            { x: 300, y: 80 },
            { x: 150, y: 340 },
            { x: 450, y: 340 },
        ],
        tolerance: 15,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'triangles',
        commonMistakes: ['sides not straight', 'not closing the shape', 'uneven corners'],
        successCriteria: 'A closed triangle with 3 corners and 3 straight sides',
    },
    order: 1,
};

const shapeSquarePractice: TExercise = {
    id: 'k-shape-square-practice',
    unit: 'shape',
    lessonId: 'k-shape-practice',
    title: 'Square Practice',
    instructions: 'Draw squares by tracing the guides. All sides are equal!',
    difficulty: 1,
    config: {
        type: 'shape',
        shapeType: 'square',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 175, y: 75, width: 250, height: 250 },
        expectedCorners: [
            { x: 175, y: 75 },
            { x: 425, y: 75 },
            { x: 425, y: 325 },
            { x: 175, y: 325 },
        ],
        tolerance: 15,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'squares',
        commonMistakes: ['sides not equal', 'not closing the shape', 'corners not square'],
        successCriteria: 'A closed square with 4 equal sides and 4 corners',
    },
    order: 2,
};

const shapeDiamondPractice: TExercise = {
    id: 'k-shape-diamond-practice',
    unit: 'shape',
    lessonId: 'k-shape-practice',
    title: 'Diamond Practice',
    instructions: 'Draw diamonds by tracing the guides. Point up, point down!',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'diamond',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 175, y: 50, width: 250, height: 300 },
        expectedCorners: [
            { x: 300, y: 50 },
            { x: 425, y: 200 },
            { x: 300, y: 350 },
            { x: 175, y: 200 },
        ],
        tolerance: 15,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'diamonds',
        commonMistakes: ['looks like a square', 'sides not straight', 'not pointy enough'],
        successCriteria: 'A closed diamond with 4 points - top, bottom, left, and right',
    },
    order: 3,
};

const shapeRectanglePractice: TExercise = {
    id: 'k-shape-rectangle-practice',
    unit: 'shape',
    lessonId: 'k-shape-practice',
    title: 'Rectangle Practice',
    instructions: 'Draw rectangles by tracing the guides. Longer than tall!',
    difficulty: 1,
    config: {
        type: 'shape',
        shapeType: 'rectangle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 100, y: 125, width: 400, height: 150 },
        expectedCorners: [
            { x: 100, y: 125 },
            { x: 500, y: 125 },
            { x: 500, y: 275 },
            { x: 100, y: 275 },
        ],
        tolerance: 15,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'rectangles',
        commonMistakes: ['looks like a square', 'sides not straight', 'not closing the shape'],
        successCriteria: 'A closed rectangle with 4 corners - longer sides on top and bottom',
    },
    order: 4,
};

const shapeCirclePractice: TExercise = {
    id: 'k-shape-circle-practice',
    unit: 'shape',
    lessonId: 'k-shape-practice',
    title: 'Circle Practice',
    instructions: 'Draw circles by tracing the guides. Keep it round!',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'circle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 175, y: 75, width: 250, height: 250 },
        center: { x: 300, y: 200 },
        radiusX: 125,
        radiusY: 125,
        tolerance: 20,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'circles',
        commonMistakes: ['not round enough', 'not closed', 'bumpy edges'],
        successCriteria: 'A smooth, closed circle that is round on all sides',
    },
    order: 5,
};

const shapeOvalPractice: TExercise = {
    id: 'k-shape-oval-practice',
    unit: 'shape',
    lessonId: 'k-shape-practice',
    title: 'Oval Practice',
    instructions: 'Draw ovals by tracing the guides. Like a stretched circle!',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'oval',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 125, y: 125, width: 350, height: 150 },
        center: { x: 300, y: 200 },
        radiusX: 175,
        radiusY: 75,
        tolerance: 20,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'ovals',
        commonMistakes: ['too round (circle)', 'not closed', 'bumpy edges'],
        successCriteria: 'A smooth, closed oval that is longer than it is tall',
    },
    order: 6,
};

// ============================================================================
// COLOR UNIT - Lesson 1: Color Basics (2 exercises)
// ============================================================================

const colorWheelExercise: TExercise = {
    id: 'k-color-wheel-1',
    unit: 'color',
    lessonId: 'k-color-basics',
    title: 'Color Wheel',
    instructions: 'Fill each section with the correct color: Red, Orange, Yellow, Green, Blue, Purple.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'wheel',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'red', name: 'Red', bounds: { x: 350, y: 50, width: 100, height: 100 }, targetColor: COLORS.red },
            { id: 'orange', name: 'Orange', bounds: { x: 400, y: 150, width: 100, height: 100 }, targetColor: COLORS.orange },
            { id: 'yellow', name: 'Yellow', bounds: { x: 350, y: 250, width: 100, height: 100 }, targetColor: COLORS.yellow },
            { id: 'green', name: 'Green', bounds: { x: 150, y: 250, width: 100, height: 100 }, targetColor: COLORS.green },
            { id: 'blue', name: 'Blue', bounds: { x: 100, y: 150, width: 100, height: 100 }, targetColor: COLORS.blue },
            { id: 'purple', name: 'Purple', bounds: { x: 150, y: 50, width: 100, height: 100 }, targetColor: COLORS.purple },
        ],
        tolerance: 30,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'color recognition',
        commonMistakes: ['wrong color in section', 'mixing up similar colors', 'incomplete filling'],
        successCriteria: 'Each section filled with the correct color',
    },
    order: 1,
};

const colorRainbowExercise: TExercise = {
    id: 'k-color-rainbow-1',
    unit: 'color',
    lessonId: 'k-color-basics',
    title: 'Rainbow',
    instructions: 'Color the rainbow bands from top to bottom: Red, Orange, Yellow, Green, Blue, Purple.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'red', name: 'Red', bounds: { x: 50, y: 50, width: 500, height: 50 }, targetColor: COLORS.red },
            { id: 'orange', name: 'Orange', bounds: { x: 50, y: 100, width: 500, height: 50 }, targetColor: COLORS.orange },
            { id: 'yellow', name: 'Yellow', bounds: { x: 50, y: 150, width: 500, height: 50 }, targetColor: COLORS.yellow },
            { id: 'green', name: 'Green', bounds: { x: 50, y: 200, width: 500, height: 50 }, targetColor: COLORS.green },
            { id: 'blue', name: 'Blue', bounds: { x: 50, y: 250, width: 500, height: 50 }, targetColor: COLORS.blue },
            { id: 'purple', name: 'Purple', bounds: { x: 50, y: 300, width: 500, height: 50 }, targetColor: COLORS.purple },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'rainbow colors',
        commonMistakes: ['wrong color order', 'colors bleeding into other bands'],
        successCriteria: 'All rainbow colors in the correct order',
    },
    order: 2,
};

// ============================================================================
// COLOR UNIT - Lesson 2: Coloring Fruits (6 exercises)
// ============================================================================

const colorAppleExercise: TExercise = {
    id: 'k-color-apple-1',
    unit: 'color',
    lessonId: 'k-color-objects',
    title: 'Red Apple',
    instructions: 'Color the apple red!',
    difficulty: 1,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'apple',
                name: 'Apple',
                bounds: { x: 175, y: 100, width: 250, height: 250 },
                targetColor: COLORS.red,
                outlinePath: 'M 300 100 C 200 100 175 200 175 250 C 175 350 250 350 300 350 C 350 350 425 350 425 250 C 425 200 400 100 300 100 Z',
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'coloring objects',
        commonMistakes: ['wrong color', 'going outside the lines', 'not filling completely'],
        successCriteria: 'Apple colored red and mostly inside the lines',
    },
    order: 1,
};

const colorOrangeExercise: TExercise = {
    id: 'k-color-orange-1',
    unit: 'color',
    lessonId: 'k-color-objects',
    title: 'Orange Orange',
    instructions: 'Color the orange... orange!',
    difficulty: 1,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'orange',
                name: 'Orange',
                bounds: { x: 175, y: 100, width: 250, height: 250 },
                targetColor: COLORS.orange,
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'coloring objects',
        commonMistakes: ['using red instead of orange', 'going outside the lines'],
        successCriteria: 'Orange colored orange and mostly inside the lines',
    },
    order: 2,
};

const colorBananaExercise: TExercise = {
    id: 'k-color-banana-1',
    unit: 'color',
    lessonId: 'k-color-objects',
    title: 'Yellow Banana',
    instructions: 'Color the banana yellow!',
    difficulty: 1,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'banana',
                name: 'Banana',
                bounds: { x: 100, y: 150, width: 400, height: 100 },
                targetColor: COLORS.yellow,
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'coloring objects',
        commonMistakes: ['wrong shade of yellow', 'going outside the lines'],
        successCriteria: 'Banana colored yellow and mostly inside the lines',
    },
    order: 3,
};

const colorPearExercise: TExercise = {
    id: 'k-color-pear-1',
    unit: 'color',
    lessonId: 'k-color-objects',
    title: 'Green Pear',
    instructions: 'Color the pear green!',
    difficulty: 1,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'pear',
                name: 'Pear',
                bounds: { x: 200, y: 80, width: 200, height: 280 },
                targetColor: COLORS.green,
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'coloring objects',
        commonMistakes: ['using wrong green shade', 'going outside the lines'],
        successCriteria: 'Pear colored green and mostly inside the lines',
    },
    order: 4,
};

const colorBlueberriesExercise: TExercise = {
    id: 'k-color-blueberries-1',
    unit: 'color',
    lessonId: 'k-color-objects',
    title: 'Blue Blueberries',
    instructions: 'Color the blueberries blue!',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'blueberries',
                name: 'Blueberries',
                bounds: { x: 150, y: 100, width: 300, height: 200 },
                targetColor: COLORS.blue,
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'coloring objects',
        commonMistakes: ['using purple instead of blue', 'missing small berries'],
        successCriteria: 'Blueberries colored blue and mostly inside the lines',
    },
    order: 5,
};

const colorGrapesExercise: TExercise = {
    id: 'k-color-grapes-1',
    unit: 'color',
    lessonId: 'k-color-objects',
    title: 'Purple Grapes',
    instructions: 'Color the grapes purple!',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'grapes',
                name: 'Grapes',
                bounds: { x: 175, y: 100, width: 250, height: 250 },
                targetColor: COLORS.purple,
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'coloring objects',
        commonMistakes: ['using blue instead of purple', 'not filling all grapes'],
        successCriteria: 'Grapes colored purple and mostly inside the lines',
    },
    order: 6,
};

// ============================================================================
// COLOR UNIT - Lesson 3: Trace and Color (6 exercises)
// ============================================================================

const traceColorTree: TExercise = {
    id: 'k-trace-tree',
    unit: 'color',
    lessonId: 'k-trace-color',
    title: 'Tree',
    instructions: 'Trace the triangle tree shape, then color it green!',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'tree-top',
                name: 'Tree Top',
                bounds: { x: 150, y: 50, width: 300, height: 200 },
                targetColor: COLORS.green,
            },
            {
                id: 'trunk',
                name: 'Trunk',
                bounds: { x: 260, y: 250, width: 80, height: 120 },
                targetColor: COLORS.brown,
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'trace and color',
        commonMistakes: ['green on trunk', 'not tracing first'],
        successCriteria: 'Tree top green, trunk brown',
    },
    order: 1,
};

const traceColorIcecream: TExercise = {
    id: 'k-trace-icecream',
    unit: 'color',
    lessonId: 'k-trace-color',
    title: 'Ice Cream',
    instructions: 'Trace the ice cream circles, then color them your favorite flavor!',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'scoop1',
                name: 'Top Scoop',
                bounds: { x: 225, y: 50, width: 150, height: 100 },
                targetColor: COLORS.pink,
            },
            {
                id: 'scoop2',
                name: 'Bottom Scoop',
                bounds: { x: 225, y: 130, width: 150, height: 100 },
                targetColor: COLORS.yellow,
            },
            {
                id: 'cone',
                name: 'Cone',
                bounds: { x: 250, y: 220, width: 100, height: 150 },
                targetColor: COLORS.orange,
            },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'trace and color',
        commonMistakes: ['colors bleeding between scoops'],
        successCriteria: 'Ice cream with colored scoops and cone',
    },
    order: 2,
};

const traceColorHouse: TExercise = {
    id: 'k-trace-house',
    unit: 'color',
    lessonId: 'k-trace-color',
    title: 'House',
    instructions: 'Trace the house shapes (triangle roof, rectangle body), then color it!',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'roof',
                name: 'Roof',
                bounds: { x: 150, y: 50, width: 300, height: 120 },
                targetColor: COLORS.red,
            },
            {
                id: 'walls',
                name: 'Walls',
                bounds: { x: 175, y: 160, width: 250, height: 180 },
                targetColor: COLORS.yellow,
            },
            {
                id: 'door',
                name: 'Door',
                bounds: { x: 270, y: 250, width: 60, height: 90 },
                targetColor: COLORS.brown,
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'trace and color',
        commonMistakes: ['colors bleeding between sections'],
        successCriteria: 'House with colored roof, walls, and door',
    },
    order: 3,
};

const traceColorStar: TExercise = {
    id: 'k-trace-star',
    unit: 'color',
    lessonId: 'k-trace-color',
    title: 'Star and Moon',
    instructions: 'Trace the star and circle, then color them yellow!',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'star',
                name: 'Star',
                bounds: { x: 100, y: 100, width: 180, height: 180 },
                targetColor: COLORS.yellow,
            },
            {
                id: 'moon',
                name: 'Moon',
                bounds: { x: 350, y: 100, width: 150, height: 150 },
                targetColor: COLORS.yellow,
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'trace and color',
        commonMistakes: ['not filling completely'],
        successCriteria: 'Star and moon colored yellow',
    },
    order: 4,
};

const traceColorFlower: TExercise = {
    id: 'k-trace-flower',
    unit: 'color',
    lessonId: 'k-trace-color',
    title: 'Flower',
    instructions: 'Trace the flower circles, then color the petals and center!',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'petals',
                name: 'Petals',
                bounds: { x: 175, y: 50, width: 250, height: 200 },
                targetColor: COLORS.red,
            },
            {
                id: 'center',
                name: 'Center',
                bounds: { x: 260, y: 120, width: 80, height: 80 },
                targetColor: COLORS.yellow,
            },
            {
                id: 'stem',
                name: 'Stem',
                bounds: { x: 285, y: 240, width: 30, height: 130 },
                targetColor: COLORS.green,
            },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'trace and color',
        commonMistakes: ['colors bleeding between petals and center'],
        successCriteria: 'Flower with colored petals, center, and stem',
    },
    order: 5,
};

const traceColorTruck: TExercise = {
    id: 'k-trace-truck',
    unit: 'color',
    lessonId: 'k-trace-color',
    title: 'Truck',
    instructions: 'Trace the truck shapes (rectangles and circles), then color it!',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'cab',
                name: 'Cab',
                bounds: { x: 80, y: 150, width: 120, height: 100 },
                targetColor: COLORS.red,
            },
            {
                id: 'trailer',
                name: 'Trailer',
                bounds: { x: 200, y: 120, width: 300, height: 130 },
                targetColor: COLORS.blue,
            },
            {
                id: 'wheel1',
                name: 'Front Wheel',
                bounds: { x: 110, y: 240, width: 60, height: 60 },
                targetColor: COLORS.black,
            },
            {
                id: 'wheel2',
                name: 'Back Wheel',
                bounds: { x: 430, y: 240, width: 60, height: 60 },
                targetColor: COLORS.black,
            },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'trace and color',
        commonMistakes: ['colors bleeding between cab and trailer'],
        successCriteria: 'Truck with colored cab, trailer, and wheels',
    },
    order: 6,
};

// ============================================================================
// Lessons
// ============================================================================

const lineTracingLesson: TLesson = {
    id: 'k-line-tracing',
    unit: 'line',
    gradeLevel: 'kindergarten',
    title: 'Line Tracing',
    description: 'Learn to draw different types of lines by tracing guides.',
    objectives: [
        'Draw straight lines in all directions',
        'Draw curved and wavy lines smoothly',
        'Draw zigzag, broken, and spiral lines',
    ],
    exercises: [
        straightLineHorizontal,
        straightLineVertical,
        straightLineDiagonal,
        curvedLineLargeArc,
        curvedLineSmallArcs,
        curvedLineCircleArcs,
        wavyLineSimple,
        wavyLineTall,
        wavyLineComplex,
        zigzagLineMountain,
        zigzagLineVaried,
        zigzagLineHorizontal,
        brokenLineHorizontal,
        brokenLineVertical,
        brokenLineDiagonal,
        spiralLineSmall,
        spiralLineLarge,
    ],
    order: 1,
};

const connectDotsLettersLesson: TLesson = {
    id: 'k-connect-dots-letters',
    unit: 'dot',
    gradeLevel: 'kindergarten',
    title: 'Match the Letters',
    description: 'Connect matching letters and numbers.',
    objectives: [
        'Recognize matching letters',
        'Connect matching items accurately',
        'Practice hand-eye coordination',
    ],
    exercises: [
        connectDotsMatchAE,
        connectDotsMatchFJ,
        connectDotsMatch15,
        connectDotsMatchColors,
    ],
    order: 2,
};

const connectDotsNumbersLesson: TLesson = {
    id: 'k-connect-dots-numbers',
    unit: 'dot',
    gradeLevel: 'kindergarten',
    title: 'Count and Match',
    description: 'Practice counting by matching numbers to groups of objects.',
    objectives: [
        'Count objects accurately',
        'Match numbers to quantities',
        'Practice counting to 6',
    ],
    exercises: [
        dotsCountMatch1,
        dotsCountMatch2,
        dotsCountMatch3,
        dotsCountMatch4,
    ],
    order: 3,
};

const connectDotsPicturesLesson: TLesson = {
    id: 'k-connect-dots-pictures',
    unit: 'dot',
    gradeLevel: 'kindergarten',
    title: 'Connect-the-Dots Pictures',
    description: 'Connect dots in order to reveal fun pictures!',
    objectives: [
        'Follow alphabetical order (A-H)',
        'Follow numerical order (1-10)',
        'Discover hidden pictures',
    ],
    exercises: [
        dotsFlower,
        dotsSnowman,
        dotsHouse,
        dotsBoy,
        dotsTrain,
        dotsFish,
        dotsAirplane,
        dotsKite,
        dotsTulip,
        dotsDog,
        dotsDuck,
        dotsOwl,
    ],
    order: 4,
};

const basicShapesLesson: TLesson = {
    id: 'k-basic-shapes',
    unit: 'shape',
    gradeLevel: 'kindergarten',
    title: 'Basic Shapes Introduction',
    description: 'Learn to draw shapes by connecting numbered dots.',
    objectives: [
        'Draw triangles, squares, and diamonds',
        'Draw rectangles, circles, and ovals',
        'Understand shape properties (sides, corners)',
    ],
    exercises: [
        shapeTriangleIntro,
        shapeSquareIntro,
        shapeDiamondIntro,
        shapeRectangleIntro,
        shapeCircleIntro,
        shapeOvalIntro,
    ],
    order: 1,
};

const shapePracticeLesson: TLesson = {
    id: 'k-shape-practice',
    unit: 'shape',
    gradeLevel: 'kindergarten',
    title: 'Shape Practice',
    description: 'Practice drawing shapes by tracing guides.',
    objectives: [
        'Trace shapes accurately',
        'Draw closed shapes',
        'Maintain consistent shape proportions',
    ],
    exercises: [
        shapeTrianglePractice,
        shapeSquarePractice,
        shapeDiamondPractice,
        shapeRectanglePractice,
        shapeCirclePractice,
        shapeOvalPractice,
    ],
    order: 2,
};

const colorBasicsLesson: TLesson = {
    id: 'k-color-basics',
    unit: 'color',
    gradeLevel: 'kindergarten',
    title: 'Color Basics',
    description: 'Learn the 6 main colors of the color wheel and rainbow.',
    objectives: [
        'Identify red, orange, yellow, green, blue, and purple',
        'Fill color wheel sections correctly',
        'Learn the rainbow color order',
    ],
    exercises: [colorWheelExercise, colorRainbowExercise],
    order: 1,
};

const colorObjectsLesson: TLesson = {
    id: 'k-color-objects',
    unit: 'color',
    gradeLevel: 'kindergarten',
    title: 'Coloring Fruits',
    description: 'Practice coloring fruits with the correct colors.',
    objectives: [
        'Match colors to objects',
        'Color inside the lines',
        'Use appropriate colors for each fruit',
    ],
    exercises: [
        colorAppleExercise,
        colorOrangeExercise,
        colorBananaExercise,
        colorPearExercise,
        colorBlueberriesExercise,
        colorGrapesExercise,
    ],
    order: 2,
};

const traceColorLesson: TLesson = {
    id: 'k-trace-color',
    unit: 'color',
    gradeLevel: 'kindergarten',
    title: 'Trace and Color',
    description: 'Practice tracing shapes and then coloring them.',
    objectives: [
        'Trace shape outlines first',
        'Color within traced boundaries',
        'Use appropriate colors for each object',
    ],
    exercises: [
        traceColorTree,
        traceColorIcecream,
        traceColorHouse,
        traceColorStar,
        traceColorFlower,
        traceColorTruck,
    ],
    order: 3,
};

// ============================================================================
// Units
// ============================================================================

const dotLineUnit: TCurriculumUnit = {
    id: 'line',
    gradeLevel: 'kindergarten',
    title: 'Dots & Lines',
    description: 'Learn to make marks, draw lines, and connect dots.',
    lessons: [
        lineTracingLesson,
        connectDotsLettersLesson,
        connectDotsNumbersLesson,
        connectDotsPicturesLesson,
    ],
    order: 1,
};

const shapeUnit: TCurriculumUnit = {
    id: 'shape',
    gradeLevel: 'kindergarten',
    title: 'Shapes',
    description: 'Learn to draw basic geometric shapes.',
    lessons: [basicShapesLesson, shapePracticeLesson],
    order: 2,
};

const colorUnit: TCurriculumUnit = {
    id: 'color',
    gradeLevel: 'kindergarten',
    title: 'Color',
    description: 'Learn about colors and how to use them.',
    lessons: [colorBasicsLesson, colorObjectsLesson, traceColorLesson],
    order: 3,
};

// ============================================================================
// Full Kindergarten Curriculum Export
// ============================================================================

export const kindergartenCurriculum: TGradeCurriculum = {
    gradeLevel: 'kindergarten',
    title: 'Visual Language - Kindergarten',
    description:
        'Introduction to visual art fundamentals through dots, lines, shapes, and colors. Designed for ages 5-6.',
    units: [dotLineUnit, shapeUnit, colorUnit],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all exercises for kindergarten curriculum
 */
export function getAllKindergartenExercises(): TExercise[] {
    const exercises: TExercise[] = [];
    for (const unit of kindergartenCurriculum.units) {
        for (const lesson of unit.lessons) {
            exercises.push(...lesson.exercises);
        }
    }
    return exercises;
}

/**
 * Get exercise by ID
 */
export function getExerciseById(exerciseId: string): TExercise | undefined {
    return getAllKindergartenExercises().find((e) => e.id === exerciseId);
}

/**
 * Get lesson by ID
 */
export function getLessonById(lessonId: string): TLesson | undefined {
    for (const unit of kindergartenCurriculum.units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return lesson;
    }
    return undefined;
}

/**
 * Get unit by ID
 */
export function getUnitById(unitId: string): TCurriculumUnit | undefined {
    return kindergartenCurriculum.units.find((u) => u.id === unitId);
}

/**
 * Get total exercise count
 */
export function getTotalExerciseCount(): number {
    return getAllKindergartenExercises().length;
}

/**
 * Get exercises for a specific unit
 */
export function getExercisesForUnit(unitId: string): TExercise[] {
    const unit = getUnitById(unitId);
    if (!unit) return [];
    const exercises: TExercise[] = [];
    for (const lesson of unit.lessons) {
        exercises.push(...lesson.exercises);
    }
    return exercises;
}
