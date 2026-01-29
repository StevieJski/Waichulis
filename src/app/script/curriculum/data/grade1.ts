/**
 * Grade 1 Curriculum Data
 * Visual Language I curriculum content for Grade 1 (ages 6-7)
 *
 * Builds on Kindergarten skills with:
 * - Unit: LINE - More complex lines, parallel lines, line patterns
 * - Unit: SHAPE - Combining shapes, irregular shapes, basic 3D shapes
 * - Unit: COLOR - Color mixing, warm/cool colors, values
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
const DEFAULT_DOT_RADIUS = 12;

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
    // Mixed colors for Grade 1
    pink: { r: 255, g: 192, b: 203 },
    lightBlue: { r: 173, g: 216, b: 230 },
    lightGreen: { r: 144, g: 238, b: 144 },
    darkRed: { r: 139, g: 0, b: 0 },
    darkBlue: { r: 0, g: 0, b: 139 },
    brown: { r: 139, g: 69, b: 19 },
};

// ============================================================================
// LINE UNIT - Advanced Line Exercises
// ============================================================================

const parallelLinesExercise: TExercise = {
    id: 'g1-line-parallel-1',
    unit: 'line',
    lessonId: 'g1-line-patterns',
    title: 'Parallel Lines',
    instructions: 'Draw 3 straight lines that stay the same distance apart (parallel).',
    difficulty: 1,
    config: {
        type: 'line',
        lineType: 'straight',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 100 100 L 500 100 M 100 200 L 500 200 M 100 300 L 500 300',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 20,
        startPoint: { x: 100, y: 100 },
        endPoint: { x: 500, y: 300 },
    } as TLineConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'parallel lines',
        commonMistakes: ['lines getting closer', 'lines not straight', 'uneven spacing'],
        successCriteria: 'Three straight lines that stay the same distance apart',
    },
    order: 1,
};

const convergingLinesExercise: TExercise = {
    id: 'g1-line-converge-1',
    unit: 'line',
    lessonId: 'g1-line-patterns',
    title: 'Converging Lines',
    instructions: 'Draw lines that start apart and meet at a single point.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'straight',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 100 50 L 500 200 M 100 200 L 500 200 M 100 350 L 500 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 100, y: 50 },
        endPoint: { x: 500, y: 200 },
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'converging lines',
        commonMistakes: ['lines not meeting', 'curved instead of straight', 'wrong angle'],
        successCriteria: 'Lines that meet at a single point on the right',
    },
    order: 2,
};

const crosshatchExercise: TExercise = {
    id: 'g1-line-crosshatch-1',
    unit: 'line',
    lessonId: 'g1-line-patterns',
    title: 'Crosshatch Pattern',
    instructions: 'Draw a crosshatch pattern with diagonal lines crossing each other.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'straight',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        // Diagonal lines one way, then the other
        targetPath: 'M 150 100 L 250 300 M 250 100 L 350 300 M 350 100 L 450 300 M 150 300 L 250 100 M 250 300 L 350 100 M 350 300 L 450 100',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 150, y: 100 },
        endPoint: { x: 450, y: 300 },
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'crosshatching',
        commonMistakes: ['lines not crossing', 'uneven spacing', 'wrong angle'],
        successCriteria: 'A pattern of diagonal lines crossing to create a mesh',
    },
    order: 3,
};

const doubleCurveExercise: TExercise = {
    id: 'g1-line-double-curve-1',
    unit: 'line',
    lessonId: 'g1-line-advanced',
    title: 'S-Curve',
    instructions: 'Draw a smooth S-shaped curve.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 100 100 C 200 100 200 200 300 200 C 400 200 400 300 500 300',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 30,
        startPoint: { x: 100, y: 100 },
        endPoint: { x: 500, y: 300 },
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'S-curves',
        commonMistakes: ['too sharp', 'not smooth', 'wrong direction'],
        successCriteria: 'A smooth S-shaped curve flowing from top-left to bottom-right',
    },
    order: 1,
};

const loopLineExercise: TExercise = {
    id: 'g1-line-loop-1',
    unit: 'line',
    lessonId: 'g1-line-advanced',
    title: 'Loop-de-Loop',
    instructions: 'Draw a continuous line with loops.',
    difficulty: 3,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 200 C 100 100 150 100 150 200 C 150 300 200 300 250 200 C 300 100 350 100 350 200 C 350 300 400 300 450 200 C 500 100 550 100 550 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 35,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 550, y: 200 },
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'looping lines',
        commonMistakes: ['loops too small', 'not continuous', 'uneven loops'],
        successCriteria: 'A continuous line with smooth, even loops',
    },
    order: 2,
};

// ============================================================================
// LINE UNIT - Connect the Dots (More Complex)
// ============================================================================

const connectDotsNumber1To15: TExercise = {
    id: 'g1-dots-numbers-1-15',
    unit: 'dot',
    lessonId: 'g1-connect-dots',
    title: 'Numbers 1-15 Butterfly',
    instructions: 'Connect dots 1 through 15 to reveal a butterfly!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 300, y: 50, label: '1', isStart: true },
            { id: '2', x: 200, y: 80, label: '2' },
            { id: '3', x: 120, y: 120, label: '3' },
            { id: '4', x: 80, y: 200, label: '4' },
            { id: '5', x: 120, y: 280, label: '5' },
            { id: '6', x: 200, y: 320, label: '6' },
            { id: '7', x: 280, y: 300, label: '7' },
            { id: '8', x: 300, y: 200, label: '8' },
            { id: '9', x: 320, y: 300, label: '9' },
            { id: '10', x: 400, y: 320, label: '10' },
            { id: '11', x: 480, y: 280, label: '11' },
            { id: '12', x: 520, y: 200, label: '12' },
            { id: '13', x: 480, y: 120, label: '13' },
            { id: '14', x: 400, y: 80, label: '14' },
            { id: '15', x: 300, y: 50, label: '15', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'butterfly',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'counting to 15',
        commonMistakes: ['skipping numbers', 'wrong order', 'missing connections'],
        successCriteria: 'All dots from 1 to 15 connected in order to form a butterfly',
    },
    order: 1,
};

const connectDotsNumber1To20: TExercise = {
    id: 'g1-dots-numbers-1-20',
    unit: 'dot',
    lessonId: 'g1-connect-dots',
    title: 'Numbers 1-20 Rocket',
    instructions: 'Connect dots 1 through 20 to build a rocket ship!',
    difficulty: 3,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 300, y: 30, label: '1', isStart: true },
            { id: '2', x: 250, y: 80, label: '2' },
            { id: '3', x: 250, y: 150, label: '3' },
            { id: '4', x: 220, y: 180, label: '4' },
            { id: '5', x: 220, y: 280, label: '5' },
            { id: '6', x: 180, y: 320, label: '6' },
            { id: '7', x: 180, y: 370, label: '7' },
            { id: '8', x: 220, y: 350, label: '8' },
            { id: '9', x: 250, y: 370, label: '9' },
            { id: '10', x: 300, y: 350, label: '10' },
            { id: '11', x: 350, y: 370, label: '11' },
            { id: '12', x: 380, y: 350, label: '12' },
            { id: '13', x: 420, y: 370, label: '13' },
            { id: '14', x: 420, y: 320, label: '14' },
            { id: '15', x: 380, y: 280, label: '15' },
            { id: '16', x: 380, y: 180, label: '16' },
            { id: '17', x: 350, y: 150, label: '17' },
            { id: '18', x: 350, y: 80, label: '18' },
            { id: '19', x: 300, y: 30, label: '19' },
            { id: '20', x: 300, y: 30, label: '20', isEnd: true },
        ],
        requireOrder: true,
        dotRadius: DEFAULT_DOT_RADIUS,
        resultingShape: 'rocket',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'counting to 20',
        commonMistakes: ['losing count after 10', 'skipping numbers', 'wrong order'],
        successCriteria: 'All dots from 1 to 20 connected in order to form a rocket',
    },
    order: 2,
};

// ============================================================================
// SHAPE UNIT - Combined Shapes
// ============================================================================

const houseFromShapesExercise: TExercise = {
    id: 'g1-shape-house-1',
    unit: 'shape',
    lessonId: 'g1-combined-shapes',
    title: 'House from Shapes',
    instructions: 'Draw a house using a square for the body and a triangle for the roof.',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'rectangle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 150, y: 150, width: 300, height: 200 },
        expectedCorners: [
            // Square body
            { x: 150, y: 150 },
            { x: 450, y: 150 },
            { x: 450, y: 350 },
            { x: 150, y: 350 },
            // Triangle roof points
            { x: 150, y: 150 },
            { x: 300, y: 50 },
            { x: 450, y: 150 },
        ],
        tolerance: 20,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'combining shapes',
        commonMistakes: ['roof not touching house', 'uneven proportions', 'shapes not closed'],
        successCriteria: 'A house with a square body and triangular roof that connect properly',
    },
    order: 1,
};

const robotFromShapesExercise: TExercise = {
    id: 'g1-shape-robot-1',
    unit: 'shape',
    lessonId: 'g1-combined-shapes',
    title: 'Robot from Shapes',
    instructions: 'Draw a robot using rectangles for the body and squares for the head.',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'rectangle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 200, y: 50, width: 200, height: 300 },
        expectedCorners: [
            // Head (square)
            { x: 225, y: 50 },
            { x: 375, y: 50 },
            { x: 375, y: 150 },
            { x: 225, y: 150 },
            // Body (rectangle)
            { x: 200, y: 150 },
            { x: 400, y: 150 },
            { x: 400, y: 350 },
            { x: 200, y: 350 },
        ],
        tolerance: 20,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'combining shapes',
        commonMistakes: ['head and body not aligned', 'shapes not closed', 'wrong proportions'],
        successCriteria: 'A robot with a square head on top of a rectangular body',
    },
    order: 2,
};

const treeFromShapesExercise: TExercise = {
    id: 'g1-shape-tree-1',
    unit: 'shape',
    lessonId: 'g1-combined-shapes',
    title: 'Tree from Shapes',
    instructions: 'Draw a tree using a rectangle for the trunk and a circle for the leaves.',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'circle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 175, y: 50, width: 250, height: 300 },
        center: { x: 300, y: 150 },
        radiusX: 100,
        radiusY: 100,
        tolerance: 25,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'combining shapes',
        commonMistakes: ['trunk too wide', 'leaves not round', 'shapes not connected'],
        successCriteria: 'A tree with a rectangular trunk and circular leaf crown',
    },
    order: 3,
};

// ============================================================================
// SHAPE UNIT - 3D Shape Introduction
// ============================================================================

const cubeExercise: TExercise = {
    id: 'g1-shape-cube-1',
    unit: 'shape',
    lessonId: 'g1-3d-shapes',
    title: 'Cube',
    instructions: 'Draw a cube - a 3D square! Follow the guide to show depth.',
    difficulty: 3,
    config: {
        type: 'shape',
        shapeType: 'square',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 150, y: 100, width: 250, height: 250 },
        expectedCorners: [
            // Front face
            { x: 150, y: 150 },
            { x: 350, y: 150 },
            { x: 350, y: 350 },
            { x: 150, y: 350 },
            // Back face (offset)
            { x: 200, y: 100 },
            { x: 400, y: 100 },
            { x: 400, y: 300 },
            { x: 200, y: 300 },
        ],
        tolerance: 25,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: '3D shapes',
        commonMistakes: ['looks flat', 'lines not parallel', 'back face wrong size'],
        successCriteria: 'A cube that looks 3D with a front and back face connected',
    },
    order: 1,
};

const cylinderExercise: TExercise = {
    id: 'g1-shape-cylinder-1',
    unit: 'shape',
    lessonId: 'g1-3d-shapes',
    title: 'Cylinder',
    instructions: 'Draw a cylinder - a 3D circle! Draw ovals for top and bottom.',
    difficulty: 3,
    config: {
        type: 'shape',
        shapeType: 'oval',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 175, y: 50, width: 250, height: 300 },
        center: { x: 300, y: 100 },
        radiusX: 100,
        radiusY: 40,
        tolerance: 25,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: '3D shapes',
        commonMistakes: ['ovals not matching', 'sides not straight', 'looks flat'],
        successCriteria: 'A cylinder with oval top and bottom connected by straight sides',
    },
    order: 2,
};

// ============================================================================
// COLOR UNIT - Color Mixing
// ============================================================================

const colorMixingRedYellowExercise: TExercise = {
    id: 'g1-color-mix-orange-1',
    unit: 'color',
    lessonId: 'g1-color-mixing',
    title: 'Make Orange',
    instructions: 'Mix red and yellow to make orange! Fill the middle section with orange.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'red', name: 'Red', bounds: { x: 100, y: 100, width: 120, height: 200 }, targetColor: COLORS.red },
            { id: 'result', name: 'Orange (mix)', bounds: { x: 240, y: 100, width: 120, height: 200 }, targetColor: COLORS.orange },
            { id: 'yellow', name: 'Yellow', bounds: { x: 380, y: 100, width: 120, height: 200 }, targetColor: COLORS.yellow },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'color mixing',
        commonMistakes: ['too red', 'too yellow', 'wrong shade'],
        successCriteria: 'An orange color in the middle that looks like a mix of red and yellow',
    },
    order: 1,
};

const colorMixingBlueYellowExercise: TExercise = {
    id: 'g1-color-mix-green-1',
    unit: 'color',
    lessonId: 'g1-color-mixing',
    title: 'Make Green',
    instructions: 'Mix blue and yellow to make green! Fill the middle section with green.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'blue', name: 'Blue', bounds: { x: 100, y: 100, width: 120, height: 200 }, targetColor: COLORS.blue },
            { id: 'result', name: 'Green (mix)', bounds: { x: 240, y: 100, width: 120, height: 200 }, targetColor: COLORS.green },
            { id: 'yellow', name: 'Yellow', bounds: { x: 380, y: 100, width: 120, height: 200 }, targetColor: COLORS.yellow },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'color mixing',
        commonMistakes: ['too blue', 'too yellow', 'wrong shade'],
        successCriteria: 'A green color in the middle that looks like a mix of blue and yellow',
    },
    order: 2,
};

const colorMixingRedBlueExercise: TExercise = {
    id: 'g1-color-mix-purple-1',
    unit: 'color',
    lessonId: 'g1-color-mixing',
    title: 'Make Purple',
    instructions: 'Mix red and blue to make purple! Fill the middle section with purple.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'red', name: 'Red', bounds: { x: 100, y: 100, width: 120, height: 200 }, targetColor: COLORS.red },
            { id: 'result', name: 'Purple (mix)', bounds: { x: 240, y: 100, width: 120, height: 200 }, targetColor: COLORS.purple },
            { id: 'blue', name: 'Blue', bounds: { x: 380, y: 100, width: 120, height: 200 }, targetColor: COLORS.blue },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'color mixing',
        commonMistakes: ['too red', 'too blue', 'wrong shade'],
        successCriteria: 'A purple color in the middle that looks like a mix of red and blue',
    },
    order: 3,
};

// ============================================================================
// COLOR UNIT - Warm and Cool Colors
// ============================================================================

const warmColorsExercise: TExercise = {
    id: 'g1-color-warm-1',
    unit: 'color',
    lessonId: 'g1-warm-cool',
    title: 'Warm Colors - Sun',
    instructions: 'Color the sun using warm colors: red, orange, and yellow!',
    difficulty: 1,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'sun-center',
                name: 'Sun Center',
                bounds: { x: 200, y: 100, width: 200, height: 200 },
                targetColor: COLORS.yellow,
            },
            {
                id: 'sun-rays',
                name: 'Sun Rays',
                bounds: { x: 150, y: 50, width: 300, height: 300 },
                targetColor: COLORS.orange,
            },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'warm colors',
        commonMistakes: ['using cool colors', 'not using variety', 'colors too dull'],
        successCriteria: 'A bright sun using warm colors (red, orange, yellow)',
    },
    order: 1,
};

const coolColorsExercise: TExercise = {
    id: 'g1-color-cool-1',
    unit: 'color',
    lessonId: 'g1-warm-cool',
    title: 'Cool Colors - Ocean',
    instructions: 'Color the ocean waves using cool colors: blue, green, and purple!',
    difficulty: 1,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            {
                id: 'wave1',
                name: 'Wave 1',
                bounds: { x: 50, y: 100, width: 500, height: 80 },
                targetColor: COLORS.blue,
            },
            {
                id: 'wave2',
                name: 'Wave 2',
                bounds: { x: 50, y: 200, width: 500, height: 80 },
                targetColor: COLORS.green,
            },
            {
                id: 'wave3',
                name: 'Wave 3',
                bounds: { x: 50, y: 300, width: 500, height: 80 },
                targetColor: COLORS.purple,
            },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'cool colors',
        commonMistakes: ['using warm colors', 'not using variety', 'colors too bright'],
        successCriteria: 'Ocean waves using cool colors (blue, green, purple)',
    },
    order: 2,
};

// ============================================================================
// COLOR UNIT - Light and Dark Values
// ============================================================================

const colorValuesExercise: TExercise = {
    id: 'g1-color-values-1',
    unit: 'color',
    lessonId: 'g1-color-values',
    title: 'Light to Dark',
    instructions: 'Fill the boxes from light to dark - start with light blue and end with dark blue.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'light', name: 'Light Blue', bounds: { x: 100, y: 150, width: 100, height: 100 }, targetColor: COLORS.lightBlue },
            { id: 'medium', name: 'Medium Blue', bounds: { x: 250, y: 150, width: 100, height: 100 }, targetColor: COLORS.blue },
            { id: 'dark', name: 'Dark Blue', bounds: { x: 400, y: 150, width: 100, height: 100 }, targetColor: COLORS.darkBlue },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'color values',
        commonMistakes: ['values too similar', 'wrong order', 'using different colors'],
        successCriteria: 'Three boxes showing blue from light to dark',
    },
    order: 1,
};

// ============================================================================
// Lessons
// ============================================================================

const linePatternsLesson: TLesson = {
    id: 'g1-line-patterns',
    unit: 'line',
    gradeLevel: 'grade1',
    title: 'Line Patterns',
    description: 'Learn to draw parallel lines, converging lines, and crosshatch patterns.',
    objectives: [
        'Draw parallel lines that stay the same distance apart',
        'Draw lines that converge to a point',
        'Create crosshatch patterns',
    ],
    exercises: [parallelLinesExercise, convergingLinesExercise, crosshatchExercise],
    order: 1,
};

const advancedLinesLesson: TLesson = {
    id: 'g1-line-advanced',
    unit: 'line',
    gradeLevel: 'grade1',
    title: 'Advanced Lines',
    description: 'Master complex curved lines including S-curves and loops.',
    objectives: [
        'Draw smooth S-curves',
        'Create continuous looping lines',
    ],
    exercises: [doubleCurveExercise, loopLineExercise],
    order: 2,
};

const connectDotsLesson: TLesson = {
    id: 'g1-connect-dots',
    unit: 'dot',
    gradeLevel: 'grade1',
    title: 'Connect-the-Dots: 15-20',
    description: 'Practice counting higher by connecting more dots.',
    objectives: [
        'Count from 1 to 15',
        'Count from 1 to 20',
        'Discover complex hidden shapes',
    ],
    exercises: [connectDotsNumber1To15, connectDotsNumber1To20],
    order: 3,
};

const combinedShapesLesson: TLesson = {
    id: 'g1-combined-shapes',
    unit: 'shape',
    gradeLevel: 'grade1',
    title: 'Combining Shapes',
    description: 'Learn to create pictures by combining basic shapes.',
    objectives: [
        'Combine triangles and rectangles',
        'Build recognizable objects from shapes',
        'Understand how shapes fit together',
    ],
    exercises: [houseFromShapesExercise, robotFromShapesExercise, treeFromShapesExercise],
    order: 1,
};

const threeDShapesLesson: TLesson = {
    id: 'g1-3d-shapes',
    unit: 'shape',
    gradeLevel: 'grade1',
    title: '3D Shapes',
    description: 'Introduction to drawing 3D shapes that look like they have depth.',
    objectives: [
        'Draw a cube (3D square)',
        'Draw a cylinder (3D circle)',
        'Understand how to show depth',
    ],
    exercises: [cubeExercise, cylinderExercise],
    order: 2,
};

const colorMixingLesson: TLesson = {
    id: 'g1-color-mixing',
    unit: 'color',
    gradeLevel: 'grade1',
    title: 'Color Mixing',
    description: 'Learn how primary colors mix to create secondary colors.',
    objectives: [
        'Mix red and yellow to make orange',
        'Mix blue and yellow to make green',
        'Mix red and blue to make purple',
    ],
    exercises: [colorMixingRedYellowExercise, colorMixingBlueYellowExercise, colorMixingRedBlueExercise],
    order: 1,
};

const warmCoolLesson: TLesson = {
    id: 'g1-warm-cool',
    unit: 'color',
    gradeLevel: 'grade1',
    title: 'Warm and Cool Colors',
    description: 'Understand the difference between warm and cool colors.',
    objectives: [
        'Identify warm colors (red, orange, yellow)',
        'Identify cool colors (blue, green, purple)',
        'Use warm colors to show energy',
        'Use cool colors to show calm',
    ],
    exercises: [warmColorsExercise, coolColorsExercise],
    order: 2,
};

const colorValuesLesson: TLesson = {
    id: 'g1-color-values',
    unit: 'color',
    gradeLevel: 'grade1',
    title: 'Light and Dark',
    description: 'Learn about color values - how light or dark a color can be.',
    objectives: [
        'Understand that colors have light and dark versions',
        'Create a value scale from light to dark',
    ],
    exercises: [colorValuesExercise],
    order: 3,
};

// ============================================================================
// Units
// ============================================================================

const lineUnit: TCurriculumUnit = {
    id: 'line',
    gradeLevel: 'grade1',
    title: 'Lines',
    description: 'Advanced line techniques including patterns, curves, and complex paths.',
    lessons: [linePatternsLesson, advancedLinesLesson, connectDotsLesson],
    order: 1,
};

const shapeUnit: TCurriculumUnit = {
    id: 'shape',
    gradeLevel: 'grade1',
    title: 'Shapes',
    description: 'Combining shapes and introduction to 3D forms.',
    lessons: [combinedShapesLesson, threeDShapesLesson],
    order: 2,
};

const colorUnit: TCurriculumUnit = {
    id: 'color',
    gradeLevel: 'grade1',
    title: 'Color',
    description: 'Color mixing, warm/cool colors, and values.',
    lessons: [colorMixingLesson, warmCoolLesson, colorValuesLesson],
    order: 3,
};

// ============================================================================
// Full Grade 1 Curriculum Export
// ============================================================================

export const grade1Curriculum: TGradeCurriculum = {
    gradeLevel: 'grade1',
    title: 'Visual Language - Grade 1',
    description:
        'Building on kindergarten skills with advanced lines, combined shapes, and color theory. Designed for ages 6-7.',
    units: [lineUnit, shapeUnit, colorUnit],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all exercises for Grade 1 curriculum
 */
export function getAllGrade1Exercises(): TExercise[] {
    const exercises: TExercise[] = [];
    for (const unit of grade1Curriculum.units) {
        for (const lesson of unit.lessons) {
            exercises.push(...lesson.exercises);
        }
    }
    return exercises;
}

/**
 * Get exercise by ID
 */
export function getGrade1ExerciseById(exerciseId: string): TExercise | undefined {
    return getAllGrade1Exercises().find((e) => e.id === exerciseId);
}

/**
 * Get lesson by ID
 */
export function getGrade1LessonById(lessonId: string): TLesson | undefined {
    for (const unit of grade1Curriculum.units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return lesson;
    }
    return undefined;
}

/**
 * Get total exercise count
 */
export function getGrade1TotalExerciseCount(): number {
    return getAllGrade1Exercises().length;
}
