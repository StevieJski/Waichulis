/**
 * Grade 2 Curriculum Data
 * Visual Language I curriculum content for Grade 2 (ages 7-8)
 *
 * Builds on Grade 1 skills with:
 * - Unit: LINE - Contour lines, gesture lines, implied lines
 * - Unit: SHAPE - Organic shapes, negative space, overlapping
 * - Unit: COLOR - Complementary colors, color schemes, tints and shades
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
const DEFAULT_DOT_RADIUS = 10;

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
    // Tints (lighter versions)
    lightRed: { r: 255, g: 128, b: 128 },
    lightBlue: { r: 128, g: 128, b: 255 },
    lightGreen: { r: 128, g: 255, b: 128 },
    // Shades (darker versions)
    darkRed: { r: 128, g: 0, b: 0 },
    darkBlue: { r: 0, g: 0, b: 128 },
    darkGreen: { r: 0, g: 64, b: 0 },
    // Complementary pairs
    cyan: { r: 0, g: 255, b: 255 },
    magenta: { r: 255, g: 0, b: 255 },
};

// ============================================================================
// LINE UNIT - Contour Lines
// ============================================================================

const simpleContourExercise: TExercise = {
    id: 'g2-line-contour-1',
    unit: 'line',
    lessonId: 'g2-contour-lines',
    title: 'Simple Contour - Apple',
    instructions: 'Draw the outline of an apple using one continuous line. Follow the edge carefully.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 300 80 C 350 80 420 120 420 200 C 420 300 360 340 300 340 C 240 340 180 300 180 200 C 180 120 250 80 300 80',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 30,
        startPoint: { x: 300, y: 80 },
        endPoint: { x: 300, y: 80 },
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'contour drawing',
        commonMistakes: ['lifting pen', 'not following edges', 'rushing'],
        successCriteria: 'A smooth outline that captures the shape of an apple',
    },
    order: 1,
};

const handContourExercise: TExercise = {
    id: 'g2-line-contour-2',
    unit: 'line',
    lessonId: 'g2-contour-lines',
    title: 'Contour - Hand Outline',
    instructions: 'Trace around the outline of a hand shape slowly and carefully.',
    difficulty: 3,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        // Simplified hand outline
        targetPath: 'M 200 350 L 200 250 L 180 150 L 200 150 L 200 100 L 220 100 L 230 150 L 250 80 L 270 80 L 270 150 L 290 70 L 310 70 L 310 150 L 330 90 L 350 90 L 350 180 L 380 250 L 380 350 Z',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 35,
        startPoint: { x: 200, y: 350 },
        endPoint: { x: 200, y: 350 },
    } as TLineConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: 'contour drawing',
        commonMistakes: ['missing finger details', 'not closing shape', 'corners too sharp'],
        successCriteria: 'A complete hand outline with all fingers visible',
    },
    order: 2,
};

// ============================================================================
// LINE UNIT - Gesture Lines
// ============================================================================

const gestureLineExercise: TExercise = {
    id: 'g2-line-gesture-1',
    unit: 'line',
    lessonId: 'g2-gesture-lines',
    title: 'Gesture Line - Motion',
    instructions: 'Draw quick, flowing lines that show movement. Capture the feeling of motion!',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 100 300 Q 200 100 300 200 Q 400 300 500 100',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 40,
        startPoint: { x: 100, y: 300 },
        endPoint: { x: 500, y: 100 },
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'gesture drawing',
        commonMistakes: ['too slow', 'too stiff', 'not flowing'],
        successCriteria: 'A quick, expressive line that shows energy and movement',
    },
    order: 1,
};

const multipleGestureExercise: TExercise = {
    id: 'g2-line-gesture-2',
    unit: 'line',
    lessonId: 'g2-gesture-lines',
    title: 'Multiple Gesture Lines',
    instructions: 'Draw several quick lines that flow together like wind or water.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 150 Q 200 100 350 150 Q 500 200 550 150 M 50 250 Q 200 200 350 250 Q 500 300 550 250 M 50 350 Q 200 300 350 350 Q 500 400 550 350',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 45,
        startPoint: { x: 50, y: 150 },
        endPoint: { x: 550, y: 350 },
    } as TLineConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: 'gesture drawing',
        commonMistakes: ['lines too similar', 'not flowing together', 'too careful'],
        successCriteria: 'Multiple flowing lines that work together to show movement',
    },
    order: 2,
};

// ============================================================================
// LINE UNIT - Implied Lines
// ============================================================================

const impliedLineExercise: TExercise = {
    id: 'g2-line-implied-1',
    unit: 'line',
    lessonId: 'g2-implied-lines',
    title: 'Implied Line - Dots',
    instructions: 'Draw dots in a line pattern. The eye will see a line even without connecting them!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 100, y: 200, label: '', isStart: true },
            { id: '2', x: 180, y: 200, label: '' },
            { id: '3', x: 260, y: 200, label: '' },
            { id: '4', x: 340, y: 200, label: '' },
            { id: '5', x: 420, y: 200, label: '' },
            { id: '6', x: 500, y: 200, label: '', isEnd: true },
        ],
        requireOrder: false,
        dotRadius: 8,
        resultingShape: 'implied horizontal line',
    } as TDotsConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'implied lines',
        commonMistakes: ['dots too far apart', 'dots not aligned', 'connecting the dots'],
        successCriteria: 'Evenly spaced dots that suggest a line without drawing one',
    },
    order: 1,
};

const impliedCurveExercise: TExercise = {
    id: 'g2-line-implied-2',
    unit: 'line',
    lessonId: 'g2-implied-lines',
    title: 'Implied Curve',
    instructions: 'Place dots along a curved path. Your brain will see the curve!',
    difficulty: 2,
    config: {
        type: 'dots',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        dots: [
            { id: '1', x: 100, y: 300, label: '', isStart: true },
            { id: '2', x: 180, y: 200, label: '' },
            { id: '3', x: 260, y: 130, label: '' },
            { id: '4', x: 340, y: 100, label: '' },
            { id: '5', x: 420, y: 130, label: '' },
            { id: '6', x: 500, y: 200, label: '', isEnd: true },
        ],
        requireOrder: false,
        dotRadius: 8,
        resultingShape: 'implied arc',
    } as TDotsConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'implied lines',
        commonMistakes: ['dots not following curve', 'uneven spacing'],
        successCriteria: 'Dots placed along an arc that suggests a curved line',
    },
    order: 2,
};

// ============================================================================
// SHAPE UNIT - Organic Shapes
// ============================================================================

const blobShapeExercise: TExercise = {
    id: 'g2-shape-blob-1',
    unit: 'shape',
    lessonId: 'g2-organic-shapes',
    title: 'Organic Blob',
    instructions: 'Draw a blob shape - smooth and curvy with no straight edges or corners.',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'oval',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 150, y: 100, width: 300, height: 200 },
        center: { x: 300, y: 200 },
        radiusX: 150,
        radiusY: 100,
        tolerance: 35,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'organic shapes',
        commonMistakes: ['too geometric', 'sharp corners', 'not closed'],
        successCriteria: 'A smooth, closed shape with curvy edges like a cloud or puddle',
    },
    order: 1,
};

const leafShapeExercise: TExercise = {
    id: 'g2-shape-leaf-1',
    unit: 'shape',
    lessonId: 'g2-organic-shapes',
    title: 'Leaf Shape',
    instructions: 'Draw a leaf shape - pointed at both ends with curved sides.',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'oval',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 175, y: 100, width: 250, height: 200 },
        center: { x: 300, y: 200 },
        radiusX: 125,
        radiusY: 100,
        tolerance: 30,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'organic shapes',
        commonMistakes: ['too round', 'not pointed enough', 'uneven sides'],
        successCriteria: 'A leaf shape with pointed tips and gently curved sides',
    },
    order: 2,
};

// ============================================================================
// SHAPE UNIT - Negative Space
// ============================================================================

const negativeSpaceExercise: TExercise = {
    id: 'g2-shape-negative-1',
    unit: 'shape',
    lessonId: 'g2-negative-space',
    title: 'See the Space',
    instructions: 'Draw the empty space around and between objects, not the objects themselves.',
    difficulty: 3,
    config: {
        type: 'shape',
        shapeType: 'rectangle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 100, y: 100, width: 400, height: 200 },
        expectedCorners: [
            { x: 100, y: 100 },
            { x: 250, y: 100 },
            { x: 250, y: 200 },
            { x: 350, y: 200 },
            { x: 350, y: 100 },
            { x: 500, y: 100 },
            { x: 500, y: 300 },
            { x: 100, y: 300 },
        ],
        tolerance: 25,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: 'negative space',
        commonMistakes: ['drawing the object instead', 'missing the space', 'not closing'],
        successCriteria: 'The empty space shape is captured accurately',
    },
    order: 1,
};

// ============================================================================
// SHAPE UNIT - Overlapping Shapes
// ============================================================================

const overlappingCirclesExercise: TExercise = {
    id: 'g2-shape-overlap-1',
    unit: 'shape',
    lessonId: 'g2-overlapping',
    title: 'Overlapping Circles',
    instructions: 'Draw three circles that overlap each other to create depth.',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'circle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 100, y: 100, width: 400, height: 200 },
        center: { x: 200, y: 200 },
        radiusX: 80,
        radiusY: 80,
        tolerance: 25,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'overlapping shapes',
        commonMistakes: ['circles not overlapping', 'not showing depth', 'circles touching only'],
        successCriteria: 'Three circles that clearly overlap, creating a sense of depth',
    },
    order: 1,
};

const overlappingSquaresExercise: TExercise = {
    id: 'g2-shape-overlap-2',
    unit: 'shape',
    lessonId: 'g2-overlapping',
    title: 'Overlapping Squares',
    instructions: 'Draw squares that overlap at different angles to show which is in front.',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'square',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 150, y: 100, width: 300, height: 200 },
        expectedCorners: [
            { x: 150, y: 100 },
            { x: 300, y: 100 },
            { x: 300, y: 250 },
            { x: 150, y: 250 },
        ],
        tolerance: 20,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'overlapping shapes',
        commonMistakes: ['squares not overlapping enough', 'no depth shown', 'edges not clear'],
        successCriteria: 'Overlapping squares that show which is in front',
    },
    order: 2,
};

// ============================================================================
// COLOR UNIT - Complementary Colors
// ============================================================================

const complementaryRedGreenExercise: TExercise = {
    id: 'g2-color-complement-1',
    unit: 'color',
    lessonId: 'g2-complementary',
    title: 'Red and Green',
    instructions: 'These colors are opposites! Fill red next to green to see how they pop.',
    difficulty: 1,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'red', name: 'Red', bounds: { x: 100, y: 100, width: 150, height: 200 }, targetColor: COLORS.red },
            { id: 'green', name: 'Green', bounds: { x: 350, y: 100, width: 150, height: 200 }, targetColor: COLORS.green },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 75,
    feedbackHints: {
        skillName: 'complementary colors',
        commonMistakes: ['wrong shades', 'colors too similar'],
        successCriteria: 'True red next to true green showing strong contrast',
    },
    order: 1,
};

const complementaryBlueOrangeExercise: TExercise = {
    id: 'g2-color-complement-2',
    unit: 'color',
    lessonId: 'g2-complementary',
    title: 'Blue and Orange',
    instructions: 'Another opposite pair! Fill blue next to orange.',
    difficulty: 1,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'blue', name: 'Blue', bounds: { x: 100, y: 100, width: 150, height: 200 }, targetColor: COLORS.blue },
            { id: 'orange', name: 'Orange', bounds: { x: 350, y: 100, width: 150, height: 200 }, targetColor: COLORS.orange },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 75,
    feedbackHints: {
        skillName: 'complementary colors',
        commonMistakes: ['wrong shades', 'colors too similar'],
        successCriteria: 'True blue next to orange showing vibrant contrast',
    },
    order: 2,
};

const complementaryYellowPurpleExercise: TExercise = {
    id: 'g2-color-complement-3',
    unit: 'color',
    lessonId: 'g2-complementary',
    title: 'Yellow and Purple',
    instructions: 'The third pair of opposites! Fill yellow next to purple.',
    difficulty: 1,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'yellow', name: 'Yellow', bounds: { x: 100, y: 100, width: 150, height: 200 }, targetColor: COLORS.yellow },
            { id: 'purple', name: 'Purple', bounds: { x: 350, y: 100, width: 150, height: 200 }, targetColor: COLORS.purple },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 75,
    feedbackHints: {
        skillName: 'complementary colors',
        commonMistakes: ['wrong shades', 'colors too similar'],
        successCriteria: 'Bright yellow next to purple showing maximum contrast',
    },
    order: 3,
};

// ============================================================================
// COLOR UNIT - Tints and Shades
// ============================================================================

const tintExercise: TExercise = {
    id: 'g2-color-tint-1',
    unit: 'color',
    lessonId: 'g2-tints-shades',
    title: 'Making Tints',
    instructions: 'A tint is a color + white. Fill the boxes from dark to light red.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'dark', name: 'Dark Red', bounds: { x: 100, y: 150, width: 100, height: 100 }, targetColor: COLORS.darkRed },
            { id: 'medium', name: 'Red', bounds: { x: 250, y: 150, width: 100, height: 100 }, targetColor: COLORS.red },
            { id: 'light', name: 'Light Red', bounds: { x: 400, y: 150, width: 100, height: 100 }, targetColor: COLORS.lightRed },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'tints',
        commonMistakes: ['values too similar', 'wrong order', 'not enough contrast'],
        successCriteria: 'Clear progression from dark red to light pink',
    },
    order: 1,
};

const shadeExercise: TExercise = {
    id: 'g2-color-shade-1',
    unit: 'color',
    lessonId: 'g2-tints-shades',
    title: 'Making Shades',
    instructions: 'A shade is a color + black. Fill the boxes from light to dark blue.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'light', name: 'Light Blue', bounds: { x: 100, y: 150, width: 100, height: 100 }, targetColor: COLORS.lightBlue },
            { id: 'medium', name: 'Blue', bounds: { x: 250, y: 150, width: 100, height: 100 }, targetColor: COLORS.blue },
            { id: 'dark', name: 'Dark Blue', bounds: { x: 400, y: 150, width: 100, height: 100 }, targetColor: COLORS.darkBlue },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'shades',
        commonMistakes: ['values too similar', 'wrong order', 'not enough contrast'],
        successCriteria: 'Clear progression from light blue to dark navy',
    },
    order: 2,
};

// ============================================================================
// COLOR UNIT - Analogous Colors
// ============================================================================

const analogousWarmExercise: TExercise = {
    id: 'g2-color-analogous-1',
    unit: 'color',
    lessonId: 'g2-color-schemes',
    title: 'Analogous Warm',
    instructions: 'Analogous colors sit next to each other. Fill with red, orange, and yellow.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'red', name: 'Red', bounds: { x: 80, y: 150, width: 120, height: 100 }, targetColor: COLORS.red },
            { id: 'orange', name: 'Orange', bounds: { x: 240, y: 150, width: 120, height: 100 }, targetColor: COLORS.orange },
            { id: 'yellow', name: 'Yellow', bounds: { x: 400, y: 150, width: 120, height: 100 }, targetColor: COLORS.yellow },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'analogous colors',
        commonMistakes: ['colors not next to each other on wheel', 'wrong order'],
        successCriteria: 'Red, orange, and yellow in order - neighbors on the color wheel',
    },
    order: 1,
};

const analogousCoolExercise: TExercise = {
    id: 'g2-color-analogous-2',
    unit: 'color',
    lessonId: 'g2-color-schemes',
    title: 'Analogous Cool',
    instructions: 'Fill with cool analogous colors: green, blue, and purple.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'green', name: 'Green', bounds: { x: 80, y: 150, width: 120, height: 100 }, targetColor: COLORS.green },
            { id: 'blue', name: 'Blue', bounds: { x: 240, y: 150, width: 120, height: 100 }, targetColor: COLORS.blue },
            { id: 'purple', name: 'Purple', bounds: { x: 400, y: 150, width: 120, height: 100 }, targetColor: COLORS.purple },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'analogous colors',
        commonMistakes: ['colors not next to each other on wheel', 'wrong order'],
        successCriteria: 'Green, blue, and purple in order - cool neighbors on the color wheel',
    },
    order: 2,
};

// ============================================================================
// Lessons
// ============================================================================

const contourLinesLesson: TLesson = {
    id: 'g2-contour-lines',
    unit: 'line',
    gradeLevel: 'grade2',
    title: 'Contour Lines',
    description: 'Learn to draw contour lines - the outlines that define shapes.',
    objectives: [
        'Draw continuous outline without lifting pen',
        'Follow edges carefully',
        'Capture the essential shape',
    ],
    exercises: [simpleContourExercise, handContourExercise],
    order: 1,
};

const gestureLinesLesson: TLesson = {
    id: 'g2-gesture-lines',
    unit: 'line',
    gradeLevel: 'grade2',
    title: 'Gesture Lines',
    description: 'Quick, expressive lines that capture movement and energy.',
    objectives: [
        'Draw quickly and freely',
        'Capture motion and energy',
        'Let lines flow naturally',
    ],
    exercises: [gestureLineExercise, multipleGestureExercise],
    order: 2,
};

const impliedLinesLesson: TLesson = {
    id: 'g2-implied-lines',
    unit: 'line',
    gradeLevel: 'grade2',
    title: 'Implied Lines',
    description: 'Lines that your brain creates even when nothing is drawn.',
    objectives: [
        'Understand how dots suggest lines',
        'Create implied lines with spacing',
        'See how the brain completes patterns',
    ],
    exercises: [impliedLineExercise, impliedCurveExercise],
    order: 3,
};

const organicShapesLesson: TLesson = {
    id: 'g2-organic-shapes',
    unit: 'shape',
    gradeLevel: 'grade2',
    title: 'Organic Shapes',
    description: 'Natural, free-form shapes found in nature.',
    objectives: [
        'Draw smooth, curvy shapes',
        'Avoid geometric corners',
        'Create natural-looking forms',
    ],
    exercises: [blobShapeExercise, leafShapeExercise],
    order: 1,
};

const negativeSpaceLesson: TLesson = {
    id: 'g2-negative-space',
    unit: 'shape',
    gradeLevel: 'grade2',
    title: 'Negative Space',
    description: 'Learn to see and draw the empty space around objects.',
    objectives: [
        'Identify negative space',
        'Draw space instead of objects',
        'Use negative space to improve drawings',
    ],
    exercises: [negativeSpaceExercise],
    order: 2,
};

const overlappingLesson: TLesson = {
    id: 'g2-overlapping',
    unit: 'shape',
    gradeLevel: 'grade2',
    title: 'Overlapping Shapes',
    description: 'Create depth by overlapping shapes.',
    objectives: [
        'Overlap shapes to show depth',
        'Understand which shape is in front',
        'Create 3D illusions with 2D shapes',
    ],
    exercises: [overlappingCirclesExercise, overlappingSquaresExercise],
    order: 3,
};

const complementaryLesson: TLesson = {
    id: 'g2-complementary',
    unit: 'color',
    gradeLevel: 'grade2',
    title: 'Complementary Colors',
    description: 'Colors opposite each other on the color wheel.',
    objectives: [
        'Identify complementary pairs',
        'Understand why opposites create contrast',
        'Use complementary colors for impact',
    ],
    exercises: [complementaryRedGreenExercise, complementaryBlueOrangeExercise, complementaryYellowPurpleExercise],
    order: 1,
};

const tintsShadesLesson: TLesson = {
    id: 'g2-tints-shades',
    unit: 'color',
    gradeLevel: 'grade2',
    title: 'Tints and Shades',
    description: 'Make colors lighter (tints) or darker (shades).',
    objectives: [
        'Create tints by adding white',
        'Create shades by adding black',
        'Understand value in color',
    ],
    exercises: [tintExercise, shadeExercise],
    order: 2,
};

const colorSchemesLesson: TLesson = {
    id: 'g2-color-schemes',
    unit: 'color',
    gradeLevel: 'grade2',
    title: 'Color Schemes',
    description: 'Analogous colors - neighbors on the color wheel.',
    objectives: [
        'Identify analogous colors',
        'Create harmonious color combinations',
        'Understand color wheel relationships',
    ],
    exercises: [analogousWarmExercise, analogousCoolExercise],
    order: 3,
};

// ============================================================================
// Units
// ============================================================================

const lineUnit: TCurriculumUnit = {
    id: 'line',
    gradeLevel: 'grade2',
    title: 'Lines',
    description: 'Contour lines, gesture lines, and implied lines.',
    lessons: [contourLinesLesson, gestureLinesLesson, impliedLinesLesson],
    order: 1,
};

const shapeUnit: TCurriculumUnit = {
    id: 'shape',
    gradeLevel: 'grade2',
    title: 'Shapes',
    description: 'Organic shapes, negative space, and overlapping.',
    lessons: [organicShapesLesson, negativeSpaceLesson, overlappingLesson],
    order: 2,
};

const colorUnit: TCurriculumUnit = {
    id: 'color',
    gradeLevel: 'grade2',
    title: 'Color',
    description: 'Complementary colors, tints, shades, and color schemes.',
    lessons: [complementaryLesson, tintsShadesLesson, colorSchemesLesson],
    order: 3,
};

// ============================================================================
// Full Grade 2 Curriculum Export
// ============================================================================

export const grade2Curriculum: TGradeCurriculum = {
    gradeLevel: 'grade2',
    title: 'Visual Language - Grade 2',
    description:
        'Advanced concepts including contour drawing, gesture, negative space, and color theory. Designed for ages 7-8.',
    units: [lineUnit, shapeUnit, colorUnit],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all exercises for Grade 2 curriculum
 */
export function getAllGrade2Exercises(): TExercise[] {
    const exercises: TExercise[] = [];
    for (const unit of grade2Curriculum.units) {
        for (const lesson of unit.lessons) {
            exercises.push(...lesson.exercises);
        }
    }
    return exercises;
}

/**
 * Get exercise by ID
 */
export function getGrade2ExerciseById(exerciseId: string): TExercise | undefined {
    return getAllGrade2Exercises().find((e) => e.id === exerciseId);
}

/**
 * Get lesson by ID
 */
export function getGrade2LessonById(lessonId: string): TLesson | undefined {
    for (const unit of grade2Curriculum.units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return lesson;
    }
    return undefined;
}

/**
 * Get total exercise count
 */
export function getGrade2TotalExerciseCount(): number {
    return getAllGrade2Exercises().length;
}
