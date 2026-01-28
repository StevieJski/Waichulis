/**
 * Kindergarten Curriculum Data
 * Visual Language I curriculum content for Kindergarten (ages 5-6)
 *
 * Based on the Visual Language Kindergarten curriculum:
 * - Unit: DOT/LINE (~12 exercises)
 * - Unit: SHAPE (~8 exercises)
 * - Unit: COLOR (~6 exercises)
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
};

// ============================================================================
// LINE UNIT - Line Tracing Exercises
// ============================================================================

const straightLineExercise: TExercise = {
    id: 'k-line-straight-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Straight Line',
    instructions: 'Draw a straight line from the green dot to the red dot.',
    difficulty: 1,
    config: {
        type: 'line',
        lineType: 'straight',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 100 200 L 500 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 20,
        startPoint: { x: 100, y: 200 },
        endPoint: { x: 500, y: 200 },
    } as TLineConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'straight lines',
        commonMistakes: ['wobbling', 'lifting pen mid-stroke', 'going too fast'],
        successCriteria: 'A smooth, straight line from start to end',
    },
    order: 1,
};

const curvedLineExercise: TExercise = {
    id: 'k-line-curved-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Curved Line',
    instructions: 'Draw a smooth curved line following the dotted guide.',
    difficulty: 1,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 100 300 Q 300 100 500 300',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 100, y: 300 },
        endPoint: { x: 500, y: 300 },
    } as TLineConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'curved lines',
        commonMistakes: ['making sharp angles', 'not following the curve', 'uneven pressure'],
        successCriteria: 'A smooth arc that follows the guide curve',
    },
    order: 2,
};

const wavyLineExercise: TExercise = {
    id: 'k-line-wavy-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Wavy Line',
    instructions: 'Draw a wavy line like ocean waves.',
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
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'wavy lines',
        commonMistakes: ['waves too small', 'waves uneven', 'not flowing smoothly'],
        successCriteria: 'Smooth, even waves that flow from left to right',
    },
    order: 3,
};

const zigzagLineExercise: TExercise = {
    id: 'k-line-zigzag-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Zigzag Line',
    instructions: 'Draw a zigzag line with sharp points.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'zigzag',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 200 L 150 100 L 250 300 L 350 100 L 450 300 L 550 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 550, y: 200 },
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'zigzag lines',
        commonMistakes: ['rounding the corners', 'uneven peaks', 'not reaching the points'],
        successCriteria: 'Sharp angles with consistent peaks and valleys',
    },
    order: 4,
};

const brokenLineExercise: TExercise = {
    id: 'k-line-broken-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Broken Line',
    instructions: 'Draw a broken (dashed) line with short segments.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'broken',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        // Series of short segments
        targetPath: 'M 50 200 L 100 200 M 130 200 L 180 200 M 210 200 L 260 200 M 290 200 L 340 200 M 370 200 L 420 200 M 450 200 L 500 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 20,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 500, y: 200 },
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'broken lines',
        commonMistakes: ['segments too long', 'gaps uneven', 'not lifting pen'],
        successCriteria: 'Even dashes with consistent gaps between them',
    },
    order: 5,
};

const spiralLineExercise: TExercise = {
    id: 'k-line-spiral-1',
    unit: 'line',
    lessonId: 'k-line-tracing',
    title: 'Spiral Line',
    instructions: 'Draw a spiral starting from the center and going outward.',
    difficulty: 3,
    config: {
        type: 'line',
        lineType: 'spiral',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        // Simple spiral path
        targetPath: 'M 300 200 C 300 180 320 160 340 160 C 380 160 400 200 400 240 C 400 300 340 340 280 340 C 200 340 160 280 160 200 C 160 100 240 60 340 60',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 35,
        startPoint: { x: 300, y: 200 },
        endPoint: { x: 340, y: 60 },
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'spiral lines',
        commonMistakes: ['spirals too tight', 'not expanding evenly', 'crossing lines'],
        successCriteria: 'A smooth spiral that grows larger from center outward',
    },
    order: 6,
};

// ============================================================================
// LINE UNIT - Connect the Dots Exercises
// ============================================================================

const connectDotsLetterA: TExercise = {
    id: 'k-dots-letter-a',
    unit: 'dot',
    lessonId: 'k-connect-dots-letters',
    title: 'Letter A',
    instructions: 'Connect the dots in order to form the letter A.',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 300, y: 50, label: '1', isStart: true },
            { id: '2', x: 200, y: 350, label: '2' },
            { id: '3', x: 250, y: 200, label: '3' },
            { id: '4', x: 350, y: 200, label: '4' },
            { id: '5', x: 400, y: 350, label: '5', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'letter A',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'connect-the-dots',
        commonMistakes: ['skipping dots', 'wrong order', 'missing connections'],
        successCriteria: 'All dots connected in numbered order to form A',
    },
    order: 1,
};

const connectDotsLetterB: TExercise = {
    id: 'k-dots-letter-b',
    unit: 'dot',
    lessonId: 'k-connect-dots-letters',
    title: 'Letter B',
    instructions: 'Connect the dots in order to form the letter B.',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 200, y: 50, label: '1', isStart: true },
            { id: '2', x: 200, y: 350, label: '2' },
            { id: '3', x: 200, y: 200, label: '3' },
            { id: '4', x: 350, y: 125, label: '4' },
            { id: '5', x: 350, y: 275, label: '5', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'letter B',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'connect-the-dots',
        commonMistakes: ['skipping dots', 'wrong order', 'missing the bumps'],
        successCriteria: 'All dots connected in numbered order to form B',
    },
    order: 2,
};

const connectDotsNumber1To5: TExercise = {
    id: 'k-dots-numbers-1-5',
    unit: 'dot',
    lessonId: 'k-connect-dots-numbers',
    title: 'Numbers 1-5 Star',
    instructions: 'Connect dots 1 through 5 to reveal the shape!',
    difficulty: 1,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 300, y: 50, label: '1', isStart: true },
            { id: '2', x: 380, y: 150, label: '2' },
            { id: '3', x: 500, y: 150, label: '3' },
            { id: '4', x: 420, y: 230, label: '4' },
            { id: '5', x: 450, y: 350, label: '5', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'part of a star',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'number sequence',
        commonMistakes: ['wrong number order', 'skipping numbers'],
        successCriteria: 'Connected all dots from 1 to 5 in order',
    },
    order: 1,
};

const connectDotsNumber1To10: TExercise = {
    id: 'k-dots-numbers-1-10',
    unit: 'dot',
    lessonId: 'k-connect-dots-numbers',
    title: 'Numbers 1-10 House',
    instructions: 'Connect dots 1 through 10 to build a house!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 150, y: 350, label: '1', isStart: true },
            { id: '2', x: 150, y: 200, label: '2' },
            { id: '3', x: 200, y: 200, label: '3' },
            { id: '4', x: 200, y: 150, label: '4' },
            { id: '5', x: 300, y: 50, label: '5' },
            { id: '6', x: 400, y: 150, label: '6' },
            { id: '7', x: 400, y: 200, label: '7' },
            { id: '8', x: 450, y: 200, label: '8' },
            { id: '9', x: 450, y: 350, label: '9' },
            { id: '10', x: 150, y: 350, label: '10', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'house',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'counting to 10',
        commonMistakes: ['skipping numbers', 'going backwards', 'not connecting last dot to first'],
        successCriteria: 'All dots from 1 to 10 connected in order to form a house',
    },
    order: 2,
};

// ============================================================================
// SHAPE UNIT - Shape Drawing Exercises
// ============================================================================

const triangleExercise: TExercise = {
    id: 'k-shape-triangle-1',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Triangle',
    instructions: 'Draw a triangle with 3 straight sides.',
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

const squareExercise: TExercise = {
    id: 'k-shape-square-1',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Square',
    instructions: 'Draw a square with 4 equal sides.',
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

const diamondExercise: TExercise = {
    id: 'k-shape-diamond-1',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Diamond',
    instructions: 'Draw a diamond (a square tilted on its corner).',
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

const rectangleExercise: TExercise = {
    id: 'k-shape-rectangle-1',
    unit: 'shape',
    lessonId: 'k-basic-shapes',
    title: 'Rectangle',
    instructions: 'Draw a rectangle - longer than it is tall.',
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

const circleExercise: TExercise = {
    id: 'k-shape-circle-1',
    unit: 'shape',
    lessonId: 'k-round-shapes',
    title: 'Circle',
    instructions: 'Draw a circle - perfectly round!',
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
    order: 1,
};

const ovalExercise: TExercise = {
    id: 'k-shape-oval-1',
    unit: 'shape',
    lessonId: 'k-round-shapes',
    title: 'Oval',
    instructions: 'Draw an oval - like a stretched circle.',
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
    order: 2,
};

// ============================================================================
// COLOR UNIT - Color Exercises
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
        'Draw straight lines steadily',
        'Draw curved lines smoothly',
        'Draw wavy, zigzag, broken, and spiral lines',
    ],
    exercises: [
        straightLineExercise,
        curvedLineExercise,
        wavyLineExercise,
        zigzagLineExercise,
        brokenLineExercise,
        spiralLineExercise,
    ],
    order: 1,
};

const connectDotsLettersLesson: TLesson = {
    id: 'k-connect-dots-letters',
    unit: 'dot',
    gradeLevel: 'kindergarten',
    title: 'Connect-the-Dots: Letters',
    description: 'Connect numbered dots to form letters.',
    objectives: [
        'Follow numbered sequence',
        'Connect dots accurately',
        'Recognize letters from connected dots',
    ],
    exercises: [connectDotsLetterA, connectDotsLetterB],
    order: 2,
};

const connectDotsNumbersLesson: TLesson = {
    id: 'k-connect-dots-numbers',
    unit: 'dot',
    gradeLevel: 'kindergarten',
    title: 'Connect-the-Dots: Numbers',
    description: 'Practice counting by connecting dots numbered 1-10.',
    objectives: [
        'Count from 1 to 10',
        'Connect dots in numerical order',
        'Discover hidden shapes',
    ],
    exercises: [connectDotsNumber1To5, connectDotsNumber1To10],
    order: 3,
};

const basicShapesLesson: TLesson = {
    id: 'k-basic-shapes',
    unit: 'shape',
    gradeLevel: 'kindergarten',
    title: 'Basic Shapes',
    description: 'Learn to draw triangles, squares, diamonds, and rectangles.',
    objectives: [
        'Draw triangles with 3 sides',
        'Draw squares with 4 equal sides',
        'Draw diamonds and rectangles',
    ],
    exercises: [triangleExercise, squareExercise, diamondExercise, rectangleExercise],
    order: 1,
};

const roundShapesLesson: TLesson = {
    id: 'k-round-shapes',
    unit: 'shape',
    gradeLevel: 'kindergarten',
    title: 'Round Shapes',
    description: 'Learn to draw circles and ovals.',
    objectives: ['Draw smooth circles', 'Draw ovals (stretched circles)'],
    exercises: [circleExercise, ovalExercise],
    order: 2,
};

const colorBasicsLesson: TLesson = {
    id: 'k-color-basics',
    unit: 'color',
    gradeLevel: 'kindergarten',
    title: 'Color Basics',
    description: 'Learn the 6 main colors of the color wheel.',
    objectives: [
        'Identify red, orange, yellow, green, blue, and purple',
        'Fill color wheel sections correctly',
    ],
    exercises: [colorWheelExercise],
    order: 1,
};

const colorObjectsLesson: TLesson = {
    id: 'k-color-objects',
    unit: 'color',
    gradeLevel: 'kindergarten',
    title: 'Coloring Objects',
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
        colorGrapesExercise,
        colorBlueberriesExercise,
    ],
    order: 2,
};

// ============================================================================
// Units
// ============================================================================

const dotLineUnit: TCurriculumUnit = {
    id: 'line',
    gradeLevel: 'kindergarten',
    title: 'Dots & Lines',
    description: 'Learn to make marks, draw lines, and connect dots.',
    lessons: [lineTracingLesson, connectDotsLettersLesson, connectDotsNumbersLesson],
    order: 1,
};

const shapeUnit: TCurriculumUnit = {
    id: 'shape',
    gradeLevel: 'kindergarten',
    title: 'Shapes',
    description: 'Learn to draw basic geometric shapes.',
    lessons: [basicShapesLesson, roundShapesLesson],
    order: 2,
};

const colorUnit: TCurriculumUnit = {
    id: 'color',
    gradeLevel: 'kindergarten',
    title: 'Color',
    description: 'Learn about colors and how to use them.',
    lessons: [colorBasicsLesson, colorObjectsLesson],
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
