/**
 * Grade 3 Curriculum Data
 * Visual Language I curriculum content for Grade 3 (ages 8-9)
 *
 * Builds on Grade 2 skills with:
 * - Unit: LINE - Expressive lines, hatching techniques, line weight
 * - Unit: SHAPE - Proportion, symmetry, pattern design
 * - Unit: COLOR - Color temperature, mood, and advanced color harmony
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
    // Primary
    red: { r: 255, g: 0, b: 0 },
    yellow: { r: 255, g: 255, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    // Secondary
    orange: { r: 255, g: 165, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    purple: { r: 128, g: 0, b: 128 },
    // Neutrals
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    gray: { r: 128, g: 128, b: 128 },
    // Warm palette
    warmRed: { r: 220, g: 60, b: 40 },
    warmOrange: { r: 255, g: 140, b: 0 },
    warmYellow: { r: 255, g: 200, b: 50 },
    // Cool palette
    coolBlue: { r: 70, g: 130, b: 200 },
    coolGreen: { r: 60, g: 150, b: 130 },
    coolPurple: { r: 100, g: 80, b: 160 },
    // Triadic
    triadRed: { r: 200, g: 50, b: 50 },
    triadYellow: { r: 230, g: 200, b: 50 },
    triadBlue: { r: 50, g: 100, b: 200 },
};

// ============================================================================
// LINE UNIT - Expressive Lines
// ============================================================================

const angryLinesExercise: TExercise = {
    id: 'g3-line-express-angry',
    unit: 'line',
    lessonId: 'g3-expressive-lines',
    title: 'Angry Lines',
    instructions: 'Draw sharp, jagged lines that express anger or intensity. Use heavy pressure!',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'zigzag',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 200 L 100 100 L 150 300 L 200 80 L 250 320 L 300 100 L 350 280 L 400 120 L 450 300 L 500 150 L 550 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 35,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 550, y: 200 },
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'expressive lines',
        commonMistakes: ['too smooth', 'not energetic enough', 'too controlled'],
        successCriteria: 'Sharp, aggressive lines that convey intensity',
    },
    order: 1,
};

const calmLinesExercise: TExercise = {
    id: 'g3-line-express-calm',
    unit: 'line',
    lessonId: 'g3-expressive-lines',
    title: 'Calm Lines',
    instructions: 'Draw soft, flowing horizontal lines that feel peaceful and quiet.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'wavy',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 200 Q 150 190 250 200 Q 350 210 450 200 Q 550 190 550 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 30,
        startPoint: { x: 50, y: 200 },
        endPoint: { x: 550, y: 200 },
    } as TLineConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'expressive lines',
        commonMistakes: ['too active', 'too wavy', 'not smooth enough'],
        successCriteria: 'Gentle, horizontal lines that feel peaceful',
    },
    order: 2,
};

const excitedLinesExercise: TExercise = {
    id: 'g3-line-express-excited',
    unit: 'line',
    lessonId: 'g3-expressive-lines',
    title: 'Excited Lines',
    instructions: 'Draw bouncy, energetic lines that show excitement and joy!',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 50 300 Q 100 100 150 300 Q 200 100 250 300 Q 300 100 350 300 Q 400 100 450 300 Q 500 100 550 300',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 40,
        startPoint: { x: 50, y: 300 },
        endPoint: { x: 550, y: 300 },
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'expressive lines',
        commonMistakes: ['not bouncy enough', 'too controlled', 'irregular rhythm'],
        successCriteria: 'Bouncy, rhythmic lines full of energy',
    },
    order: 3,
};

// ============================================================================
// LINE UNIT - Hatching Techniques
// ============================================================================

const parallelHatchingExercise: TExercise = {
    id: 'g3-line-hatch-parallel',
    unit: 'line',
    lessonId: 'g3-hatching',
    title: 'Parallel Hatching',
    instructions: 'Draw many parallel lines close together to create shading.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'straight',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 150 100 L 150 300 M 180 100 L 180 300 M 210 100 L 210 300 M 240 100 L 240 300 M 270 100 L 270 300 M 300 100 L 300 300 M 330 100 L 330 300 M 360 100 L 360 300 M 390 100 L 390 300 M 420 100 L 420 300 M 450 100 L 450 300',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 20,
        startPoint: { x: 150, y: 100 },
        endPoint: { x: 450, y: 300 },
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'hatching',
        commonMistakes: ['uneven spacing', 'lines not parallel', 'inconsistent length'],
        successCriteria: 'Evenly spaced parallel lines creating a tonal area',
    },
    order: 1,
};

const crossHatchingExercise: TExercise = {
    id: 'g3-line-hatch-cross',
    unit: 'line',
    lessonId: 'g3-hatching',
    title: 'Cross-Hatching',
    instructions: 'Layer hatching in two directions to create darker shading.',
    difficulty: 3,
    config: {
        type: 'line',
        lineType: 'straight',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 150 100 L 150 300 M 200 100 L 200 300 M 250 100 L 250 300 M 300 100 L 300 300 M 350 100 L 350 300 M 400 100 L 400 300 M 450 100 L 450 300 M 150 150 L 450 150 M 150 200 L 450 200 M 150 250 L 450 250',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 25,
        startPoint: { x: 150, y: 100 },
        endPoint: { x: 450, y: 300 },
    } as TLineConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: 'cross-hatching',
        commonMistakes: ['lines not crossing properly', 'uneven density', 'wrong angles'],
        successCriteria: 'Two layers of hatching creating darker tone',
    },
    order: 2,
};

// ============================================================================
// LINE UNIT - Line Weight
// ============================================================================

const lineWeightExercise: TExercise = {
    id: 'g3-line-weight-1',
    unit: 'line',
    lessonId: 'g3-line-weight',
    title: 'Thick and Thin',
    instructions: 'Practice varying your line thickness - thick for emphasis, thin for detail.',
    difficulty: 2,
    config: {
        type: 'line',
        lineType: 'curved',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetPath: 'M 100 200 Q 200 100 300 200 Q 400 300 500 200',
        guideStrokeWidth: GUIDE_STROKE_WIDTH,
        tolerance: 30,
        startPoint: { x: 100, y: 200 },
        endPoint: { x: 500, y: 200 },
    } as TLineConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'line weight',
        commonMistakes: ['uniform thickness', 'no variation', 'jerky transitions'],
        successCriteria: 'Smooth transitions between thick and thin sections',
    },
    order: 1,
};

const depthWithWeightExercise: TExercise = {
    id: 'g3-line-weight-2',
    unit: 'line',
    lessonId: 'g3-line-weight',
    title: 'Depth with Line Weight',
    instructions: 'Draw overlapping circles - use thick lines for front, thin for back.',
    difficulty: 3,
    config: {
        type: 'shape',
        shapeType: 'circle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 150, y: 100, width: 300, height: 200 },
        center: { x: 250, y: 200 },
        radiusX: 100,
        radiusY: 100,
        tolerance: 25,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: 'line weight for depth',
        commonMistakes: ['same weight throughout', 'no depth shown', 'weight reversed'],
        successCriteria: 'Thick lines bring shapes forward, thin lines push them back',
    },
    order: 2,
};

// ============================================================================
// SHAPE UNIT - Proportion
// ============================================================================

const proportionFaceExercise: TExercise = {
    id: 'g3-shape-proportion-1',
    unit: 'shape',
    lessonId: 'g3-proportion',
    title: 'Face Proportions',
    instructions: 'Draw an oval face divided in half - eyes go on the middle line!',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'oval',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 200, y: 50, width: 200, height: 300 },
        center: { x: 300, y: 200 },
        radiusX: 100,
        radiusY: 150,
        tolerance: 25,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'proportion',
        commonMistakes: ['features too high', 'uneven sides', 'wrong shape'],
        successCriteria: 'An oval with guidelines showing proper face proportions',
    },
    order: 1,
};

const proportionBodyExercise: TExercise = {
    id: 'g3-shape-proportion-2',
    unit: 'shape',
    lessonId: 'g3-proportion',
    title: 'Body Proportions',
    instructions: 'A body is about 7 heads tall. Draw the basic proportion guide.',
    difficulty: 3,
    config: {
        type: 'shape',
        shapeType: 'rectangle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 250, y: 20, width: 100, height: 360 },
        expectedCorners: [
            { x: 250, y: 20 },
            { x: 350, y: 20 },
            { x: 350, y: 380 },
            { x: 250, y: 380 },
        ],
        tolerance: 20,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: 'body proportion',
        commonMistakes: ['wrong head count', 'uneven divisions', 'proportions off'],
        successCriteria: 'A figure divided into proper body proportions',
    },
    order: 2,
};

// ============================================================================
// SHAPE UNIT - Symmetry
// ============================================================================

const verticalSymmetryExercise: TExercise = {
    id: 'g3-shape-symmetry-1',
    unit: 'shape',
    lessonId: 'g3-symmetry',
    title: 'Vertical Symmetry',
    instructions: 'Draw a butterfly - both sides should mirror each other!',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'diamond',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 100, y: 100, width: 400, height: 200 },
        expectedCorners: [
            { x: 300, y: 100 },
            { x: 500, y: 200 },
            { x: 300, y: 300 },
            { x: 100, y: 200 },
        ],
        tolerance: 25,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'symmetry',
        commonMistakes: ['sides not matching', 'center line off', 'uneven shapes'],
        successCriteria: 'Both halves mirror each other across the center line',
    },
    order: 1,
};

const radialSymmetryExercise: TExercise = {
    id: 'g3-shape-symmetry-2',
    unit: 'shape',
    lessonId: 'g3-symmetry',
    title: 'Radial Symmetry',
    instructions: 'Draw a flower with 6 petals - each petal equally spaced around the center.',
    difficulty: 3,
    config: {
        type: 'shape',
        shapeType: 'circle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 150, y: 50, width: 300, height: 300 },
        center: { x: 300, y: 200 },
        radiusX: 150,
        radiusY: 150,
        tolerance: 30,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 55,
    feedbackHints: {
        skillName: 'radial symmetry',
        commonMistakes: ['petals uneven', 'not centered', 'spacing off'],
        successCriteria: 'Petals radiate evenly from the center point',
    },
    order: 2,
};

// ============================================================================
// SHAPE UNIT - Pattern Design
// ============================================================================

const repeatPatternExercise: TExercise = {
    id: 'g3-shape-pattern-1',
    unit: 'shape',
    lessonId: 'g3-patterns',
    title: 'Repeating Pattern',
    instructions: 'Create a pattern by repeating a simple shape in a row.',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'triangle',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 50, y: 150, width: 500, height: 100 },
        expectedCorners: [
            { x: 100, y: 150 },
            { x: 150, y: 250 },
            { x: 50, y: 250 },
        ],
        tolerance: 20,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'pattern design',
        commonMistakes: ['uneven spacing', 'shapes different sizes', 'not aligned'],
        successCriteria: 'Identical shapes repeated at regular intervals',
    },
    order: 1,
};

const alternatingPatternExercise: TExercise = {
    id: 'g3-shape-pattern-2',
    unit: 'shape',
    lessonId: 'g3-patterns',
    title: 'Alternating Pattern',
    instructions: 'Create a pattern that alternates between two different shapes.',
    difficulty: 2,
    config: {
        type: 'shape',
        shapeType: 'square',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        targetBounds: { x: 50, y: 150, width: 500, height: 100 },
        expectedCorners: [
            { x: 50, y: 150 },
            { x: 130, y: 150 },
            { x: 130, y: 250 },
            { x: 50, y: 250 },
        ],
        tolerance: 20,
        showGuide: true,
    } as TShapeConfig,
    passingScore: 60,
    feedbackHints: {
        skillName: 'alternating patterns',
        commonMistakes: ['pattern breaks', 'spacing uneven', 'shapes not alternating'],
        successCriteria: 'Two shapes alternating in a predictable rhythm',
    },
    order: 2,
};

// ============================================================================
// COLOR UNIT - Color Temperature
// ============================================================================

const warmPaletteExercise: TExercise = {
    id: 'g3-color-temp-warm',
    unit: 'color',
    lessonId: 'g3-color-temperature',
    title: 'Warm Palette',
    instructions: 'Create a warm color palette using reds, oranges, and yellows.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'warm1', name: 'Warm Red', bounds: { x: 80, y: 150, width: 120, height: 100 }, targetColor: COLORS.warmRed },
            { id: 'warm2', name: 'Warm Orange', bounds: { x: 240, y: 150, width: 120, height: 100 }, targetColor: COLORS.warmOrange },
            { id: 'warm3', name: 'Warm Yellow', bounds: { x: 400, y: 150, width: 120, height: 100 }, targetColor: COLORS.warmYellow },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'color temperature',
        commonMistakes: ['including cool colors', 'colors too similar', 'wrong values'],
        successCriteria: 'A harmonious warm palette that feels like sunshine',
    },
    order: 1,
};

const coolPaletteExercise: TExercise = {
    id: 'g3-color-temp-cool',
    unit: 'color',
    lessonId: 'g3-color-temperature',
    title: 'Cool Palette',
    instructions: 'Create a cool color palette using blues, greens, and purples.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'cool1', name: 'Cool Blue', bounds: { x: 80, y: 150, width: 120, height: 100 }, targetColor: COLORS.coolBlue },
            { id: 'cool2', name: 'Cool Green', bounds: { x: 240, y: 150, width: 120, height: 100 }, targetColor: COLORS.coolGreen },
            { id: 'cool3', name: 'Cool Purple', bounds: { x: 400, y: 150, width: 120, height: 100 }, targetColor: COLORS.coolPurple },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'color temperature',
        commonMistakes: ['including warm colors', 'colors too similar', 'wrong values'],
        successCriteria: 'A harmonious cool palette that feels calm',
    },
    order: 2,
};

// ============================================================================
// COLOR UNIT - Color and Mood
// ============================================================================

const happyColorsExercise: TExercise = {
    id: 'g3-color-mood-happy',
    unit: 'color',
    lessonId: 'g3-color-mood',
    title: 'Happy Colors',
    instructions: 'Choose bright, warm colors that express happiness and joy!',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'happy1', name: 'Sun', bounds: { x: 200, y: 50, width: 200, height: 200 }, targetColor: COLORS.yellow },
            { id: 'happy2', name: 'Flowers', bounds: { x: 100, y: 250, width: 150, height: 100 }, targetColor: COLORS.orange },
            { id: 'happy3', name: 'More Flowers', bounds: { x: 350, y: 250, width: 150, height: 100 }, targetColor: COLORS.red },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'color and mood',
        commonMistakes: ['colors too dark', 'using sad colors', 'not bright enough'],
        successCriteria: 'Bright, cheerful colors that make you smile',
    },
    order: 1,
};

const sadColorsExercise: TExercise = {
    id: 'g3-color-mood-sad',
    unit: 'color',
    lessonId: 'g3-color-mood',
    title: 'Quiet Colors',
    instructions: 'Use muted, cool colors to create a quiet, thoughtful mood.',
    difficulty: 2,
    config: {
        type: 'color',
        colorType: 'fill',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'quiet1', name: 'Sky', bounds: { x: 50, y: 50, width: 500, height: 150 }, targetColor: COLORS.coolBlue },
            { id: 'quiet2', name: 'Ground', bounds: { x: 50, y: 200, width: 500, height: 150 }, targetColor: COLORS.coolGreen },
        ],
        tolerance: 45,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'color and mood',
        commonMistakes: ['colors too bright', 'using warm colors', 'too much contrast'],
        successCriteria: 'Muted, cool colors creating a calm atmosphere',
    },
    order: 2,
};

// ============================================================================
// COLOR UNIT - Triadic Colors
// ============================================================================

const triadicExercise: TExercise = {
    id: 'g3-color-triadic-1',
    unit: 'color',
    lessonId: 'g3-advanced-harmony',
    title: 'Triadic Harmony',
    instructions: 'Use three colors equally spaced on the color wheel: red, yellow, blue.',
    difficulty: 3,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'triad1', name: 'Red', bounds: { x: 80, y: 150, width: 120, height: 100 }, targetColor: COLORS.triadRed },
            { id: 'triad2', name: 'Yellow', bounds: { x: 240, y: 150, width: 120, height: 100 }, targetColor: COLORS.triadYellow },
            { id: 'triad3', name: 'Blue', bounds: { x: 400, y: 150, width: 120, height: 100 }, targetColor: COLORS.triadBlue },
        ],
        tolerance: 35,
    } as TColorConfig,
    passingScore: 70,
    feedbackHints: {
        skillName: 'triadic colors',
        commonMistakes: ['colors not evenly spaced', 'wrong colors', 'not balanced'],
        successCriteria: 'Three primary colors creating vibrant harmony',
    },
    order: 1,
};

const splitComplementaryExercise: TExercise = {
    id: 'g3-color-split-1',
    unit: 'color',
    lessonId: 'g3-advanced-harmony',
    title: 'Split Complementary',
    instructions: 'Use one color plus the two colors next to its complement.',
    difficulty: 3,
    config: {
        type: 'color',
        colorType: 'match',
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        regions: [
            { id: 'main', name: 'Blue (main)', bounds: { x: 80, y: 150, width: 120, height: 100 }, targetColor: COLORS.blue },
            { id: 'split1', name: 'Yellow-Orange', bounds: { x: 240, y: 150, width: 120, height: 100 }, targetColor: COLORS.warmYellow },
            { id: 'split2', name: 'Red-Orange', bounds: { x: 400, y: 150, width: 120, height: 100 }, targetColor: COLORS.warmRed },
        ],
        tolerance: 40,
    } as TColorConfig,
    passingScore: 65,
    feedbackHints: {
        skillName: 'split complementary',
        commonMistakes: ['using direct complement', 'colors too far apart', 'not harmonious'],
        successCriteria: 'Main color with two split complements creating sophisticated harmony',
    },
    order: 2,
};

// ============================================================================
// Lessons
// ============================================================================

const expressiveLinesLesson: TLesson = {
    id: 'g3-expressive-lines',
    unit: 'line',
    gradeLevel: 'grade3',
    title: 'Expressive Lines',
    description: 'Use lines to express emotions and feelings.',
    objectives: [
        'Draw lines that express anger',
        'Draw lines that express calm',
        'Draw lines that express excitement',
    ],
    exercises: [angryLinesExercise, calmLinesExercise, excitedLinesExercise],
    order: 1,
};

const hatchingLesson: TLesson = {
    id: 'g3-hatching',
    unit: 'line',
    gradeLevel: 'grade3',
    title: 'Hatching Techniques',
    description: 'Create shading using parallel and crossed lines.',
    objectives: [
        'Use parallel hatching for tone',
        'Layer cross-hatching for darker values',
        'Control line spacing for different effects',
    ],
    exercises: [parallelHatchingExercise, crossHatchingExercise],
    order: 2,
};

const lineWeightLesson: TLesson = {
    id: 'g3-line-weight',
    unit: 'line',
    gradeLevel: 'grade3',
    title: 'Line Weight',
    description: 'Vary line thickness to create emphasis and depth.',
    objectives: [
        'Vary pressure for thick and thin',
        'Use weight to show depth',
        'Create smooth weight transitions',
    ],
    exercises: [lineWeightExercise, depthWithWeightExercise],
    order: 3,
};

const proportionLesson: TLesson = {
    id: 'g3-proportion',
    unit: 'shape',
    gradeLevel: 'grade3',
    title: 'Proportion',
    description: 'Learn proper proportions for faces and bodies.',
    objectives: [
        'Understand facial proportions',
        'Learn body proportions',
        'Use guidelines for accuracy',
    ],
    exercises: [proportionFaceExercise, proportionBodyExercise],
    order: 1,
};

const symmetryLesson: TLesson = {
    id: 'g3-symmetry',
    unit: 'shape',
    gradeLevel: 'grade3',
    title: 'Symmetry',
    description: 'Create balanced designs with vertical and radial symmetry.',
    objectives: [
        'Draw vertically symmetrical shapes',
        'Create radially symmetrical designs',
        'Use center lines as guides',
    ],
    exercises: [verticalSymmetryExercise, radialSymmetryExercise],
    order: 2,
};

const patternsLesson: TLesson = {
    id: 'g3-patterns',
    unit: 'shape',
    gradeLevel: 'grade3',
    title: 'Pattern Design',
    description: 'Create repeating and alternating patterns.',
    objectives: [
        'Create repeating patterns',
        'Design alternating patterns',
        'Maintain consistent spacing',
    ],
    exercises: [repeatPatternExercise, alternatingPatternExercise],
    order: 3,
};

const colorTemperatureLesson: TLesson = {
    id: 'g3-color-temperature',
    unit: 'color',
    gradeLevel: 'grade3',
    title: 'Color Temperature',
    description: 'Master warm and cool color palettes.',
    objectives: [
        'Create cohesive warm palettes',
        'Create cohesive cool palettes',
        'Understand temperature in color mixing',
    ],
    exercises: [warmPaletteExercise, coolPaletteExercise],
    order: 1,
};

const colorMoodLesson: TLesson = {
    id: 'g3-color-mood',
    unit: 'color',
    gradeLevel: 'grade3',
    title: 'Color and Mood',
    description: 'Use color to express and evoke emotions.',
    objectives: [
        'Choose colors that express happiness',
        'Choose colors that create calm',
        'Match color to intended mood',
    ],
    exercises: [happyColorsExercise, sadColorsExercise],
    order: 2,
};

const advancedHarmonyLesson: TLesson = {
    id: 'g3-advanced-harmony',
    unit: 'color',
    gradeLevel: 'grade3',
    title: 'Advanced Color Harmony',
    description: 'Explore triadic and split-complementary color schemes.',
    objectives: [
        'Create triadic color schemes',
        'Create split-complementary schemes',
        'Balance complex color combinations',
    ],
    exercises: [triadicExercise, splitComplementaryExercise],
    order: 3,
};

// ============================================================================
// Units
// ============================================================================

const lineUnit: TCurriculumUnit = {
    id: 'line',
    gradeLevel: 'grade3',
    title: 'Lines',
    description: 'Expressive lines, hatching, and line weight.',
    lessons: [expressiveLinesLesson, hatchingLesson, lineWeightLesson],
    order: 1,
};

const shapeUnit: TCurriculumUnit = {
    id: 'shape',
    gradeLevel: 'grade3',
    title: 'Shapes',
    description: 'Proportion, symmetry, and pattern design.',
    lessons: [proportionLesson, symmetryLesson, patternsLesson],
    order: 2,
};

const colorUnit: TCurriculumUnit = {
    id: 'color',
    gradeLevel: 'grade3',
    title: 'Color',
    description: 'Temperature, mood, and advanced color harmony.',
    lessons: [colorTemperatureLesson, colorMoodLesson, advancedHarmonyLesson],
    order: 3,
};

// ============================================================================
// Full Grade 3 Curriculum Export
// ============================================================================

export const grade3Curriculum: TGradeCurriculum = {
    gradeLevel: 'grade3',
    title: 'Visual Language - Grade 3',
    description:
        'Advanced techniques including expressive drawing, proportion, symmetry, and sophisticated color theory. Designed for ages 8-9.',
    units: [lineUnit, shapeUnit, colorUnit],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all exercises for Grade 3 curriculum
 */
export function getAllGrade3Exercises(): TExercise[] {
    const exercises: TExercise[] = [];
    for (const unit of grade3Curriculum.units) {
        for (const lesson of unit.lessons) {
            exercises.push(...lesson.exercises);
        }
    }
    return exercises;
}

/**
 * Get exercise by ID
 */
export function getGrade3ExerciseById(exerciseId: string): TExercise | undefined {
    return getAllGrade3Exercises().find((e) => e.id === exerciseId);
}

/**
 * Get lesson by ID
 */
export function getGrade3LessonById(lessonId: string): TLesson | undefined {
    for (const unit of grade3Curriculum.units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return lesson;
    }
    return undefined;
}

/**
 * Get total exercise count
 */
export function getGrade3TotalExerciseCount(): number {
    return getAllGrade3Exercises().length;
}
