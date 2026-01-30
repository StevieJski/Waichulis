/**
 * Curriculum Types
 * Type definitions for the Visual Language learning system
 */

// ============================================================================
// Grade and Unit Types
// ============================================================================

export type TGradeLevel = 'kindergarten' | 'grade1' | 'grade2' | 'grade3';

export type TUnit = 'dot' | 'line' | 'shape' | 'color';

export type TDifficulty = 1 | 2 | 3;

// ============================================================================
// Exercise Configuration Types
// ============================================================================

/**
 * Base exercise configuration shared by all exercise types
 */
type TExerciseConfigBase = {
    canvasWidth: number;
    canvasHeight: number;
    backgroundColor?: string; // CSS color, defaults to white
};

/**
 * Guide line style for exercises
 */
export type TLineGuideStyle = 'dashed' | 'dotted' | 'solid';

/**
 * Configuration for line tracing exercises
 */
export type TLineConfig = TExerciseConfigBase & {
    type: 'line';
    lineType: 'straight' | 'curved' | 'wavy' | 'zigzag' | 'broken' | 'spiral';
    // SVG path data for the target line
    targetPath: string;
    // Stroke width for the guide
    guideStrokeWidth: number;
    // Tolerance in pixels for scoring
    tolerance: number;
    // Starting and ending points
    startPoint: TPoint;
    endPoint: TPoint;
    // Guide style (defaults to dashed)
    guideStyle?: TLineGuideStyle;
    // Whether to show multiple parallel lines
    multiLine?: boolean;
};

/**
 * Configuration for connect-the-dots exercises
 */
export type TDotsConfig = TExerciseConfigBase & {
    type: 'dots';
    // Array of dots to connect in order
    dots: TDot[];
    // Whether connections must be made in order
    requireOrder: boolean;
    // Tolerance radius for hitting a dot
    dotRadius: number;
    // Optional: resulting shape name for display
    resultingShape?: string;
    // Optional: SVG background image path for picture exercises
    backgroundImage?: string;
};

/**
 * Configuration for shape drawing exercises
 */
export type TShapeConfig = TExerciseConfigBase & {
    type: 'shape';
    shapeType: 'triangle' | 'square' | 'diamond' | 'rectangle' | 'circle' | 'oval';
    // Target shape definition (bounding box or path)
    targetBounds: TBounds;
    // For polygons: expected corners
    expectedCorners?: TPoint[];
    // For ellipses: center and radii
    center?: TPoint;
    radiusX?: number;
    radiusY?: number;
    // Tolerance percentage for shape matching
    tolerance: number;
    // Whether to show a guide outline
    showGuide: boolean;
};

/**
 * Configuration for color exercises
 */
export type TColorConfig = TExerciseConfigBase & {
    type: 'color';
    colorType: 'fill' | 'match' | 'wheel';
    // Target regions to fill with specific colors
    regions: TColorRegion[];
    // Color tolerance (Delta-E threshold)
    tolerance: number;
};

export type TExerciseConfig = TLineConfig | TDotsConfig | TShapeConfig | TColorConfig;

// ============================================================================
// Geometry Types
// ============================================================================

export type TPoint = {
    x: number;
    y: number;
};

export type TBounds = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type TDot = {
    id: string;
    x: number;
    y: number;
    label?: string; // e.g., "A", "1", "start"
    isStart?: boolean;
    isEnd?: boolean;
};

export type TColorRegion = {
    id: string;
    name: string; // e.g., "apple", "banana"
    bounds: TBounds;
    targetColor: TRgb;
    outlinePath?: string; // SVG path for region outline
};

export type TRgb = {
    r: number; // 0-255
    g: number;
    b: number;
};

// ============================================================================
// Exercise and Lesson Types
// ============================================================================

/**
 * Hints for LLM feedback generation
 */
export type TFeedbackHints = {
    skillName: string; // e.g., "curved lines"
    commonMistakes: string[]; // e.g., ["lifting pen", "going too fast"]
    successCriteria: string; // e.g., "smooth curve connecting both dots"
    encouragementPhrases?: string[]; // Optional custom encouragement
};

/**
 * A single exercise within a lesson
 */
export type TExercise = {
    id: string;
    unit: TUnit;
    lessonId: string;
    title: string;
    instructions: string;
    difficulty: TDifficulty;
    config: TExerciseConfig;
    passingScore: number; // 0-100
    feedbackHints: TFeedbackHints;
    // Optional reference image for the exercise
    referenceImage?: string;
    // Order within the lesson
    order: number;
    // Optional demonstration video URL
    demonstrationVideo?: string;
    // Optional animation configuration for demo
    demonstrationAnimation?: TAnimationConfig;
};

/**
 * A lesson containing multiple exercises
 */
export type TLesson = {
    id: string;
    unit: TUnit;
    gradeLevel: TGradeLevel;
    title: string;
    description: string;
    objectives: string[];
    exercises: TExercise[];
    order: number;
};

/**
 * A curriculum unit containing lessons
 */
export type TCurriculumUnit = {
    id: TUnit;
    gradeLevel: TGradeLevel;
    title: string;
    description: string;
    lessons: TLesson[];
    order: number;
};

/**
 * Complete curriculum for a grade level
 */
export type TGradeCurriculum = {
    gradeLevel: TGradeLevel;
    title: string;
    description: string;
    units: TCurriculumUnit[];
};

// ============================================================================
// Assessment Types
// ============================================================================

/**
 * Stroke data captured from user drawing
 */
export type TStrokePoint = {
    x: number;
    y: number;
    pressure: number;
    timestamp: number;
};

export type TStroke = {
    id: string;
    points: TStrokePoint[];
    color: TRgb;
    size: number;
};

export type TStrokeData = {
    strokes: TStroke[];
    startTime: number;
    endTime: number;
};

/**
 * Local assessment metrics
 */
export type TLineMetrics = {
    pathAccuracy: number; // 0-100, how close to target path
    smoothness: number; // 0-100, how smooth the stroke
    completeness: number; // 0-100, percentage of path covered
    avgDeviation: number; // average pixel deviation from target
};

export type TShapeMetrics = {
    shapeMatch: number; // 0-100, overall shape similarity
    aspectRatio: number; // how close to expected aspect ratio
    closedness: number; // 0-100, is the shape closed
    cornerAccuracy?: number; // for polygons
    roundness?: number; // for circles/ovals
};

export type TDotsMetrics = {
    dotsHit: number; // count of dots successfully hit
    totalDots: number;
    orderAccuracy: number; // 0-100, were they hit in order
    connectionAccuracy: number; // 0-100, how direct were connections
};

export type TColorMetrics = {
    colorAccuracy: number; // 0-100, average color match
    coverage: number; // 0-100, percentage of region filled
    regionScores: { regionId: string; score: number }[];
};

export type TAssessmentMetrics = TLineMetrics | TShapeMetrics | TDotsMetrics | TColorMetrics;

/**
 * Local assessment result
 */
export type TLocalAssessment = {
    score: number; // 0-100
    metrics: TAssessmentMetrics;
    passed: boolean;
};

// ============================================================================
// LLM Feedback Types
// ============================================================================

export type TLLMProvider = 'google' | 'anthropic' | 'openai';

export type TLLMModel =
    | 'gemini-2.0-flash'
    | 'gemini-2.5-flash'
    | 'gemini-2.5-pro'
    | 'claude-3-5-haiku-latest'
    | 'claude-3-5-sonnet-latest'
    | 'gpt-4o-mini'
    | 'gpt-4o';

export type TLLMConfig = {
    provider: TLLMProvider;
    model: TLLMModel;
    apiKey: string;
};

export type TFeedbackRequest = {
    exerciseType: TUnit;
    exerciseTitle: string;
    localScore: number;
    localMetrics: TAssessmentMetrics;
    attemptNumber: number;
    drawingImage?: string; // Base64 PNG for vision models
    studentGradeLevel: TGradeLevel;
    feedbackHints: TFeedbackHints;
};

export type TFeedbackResponse = {
    encouragement: string; // "Great job! You're doing well!"
    specificPraise: string[]; // ["Your lines are very straight"]
    improvementTips: string[]; // ["Try to connect the dots in order"]
    nextStepHint?: string; // "Ready to try curved lines?"
};

/**
 * Full assessment combining local and LLM feedback
 */
export type TFullAssessment = {
    score: number;
    metrics: TAssessmentMetrics;
    passed: boolean;
    feedback: TFeedbackResponse;
    timestamp: number;
};

// ============================================================================
// Progress and Storage Types
// ============================================================================

/**
 * Progress for a single exercise
 */
export type TExerciseProgress = {
    exerciseId: string;
    lessonId: string;
    attempts: number;
    bestScore: number;
    passed: boolean;
    lastAttempt?: number; // timestamp
    assessments: TFullAssessment[];
};

/**
 * Progress for a lesson
 */
export type TLessonProgress = {
    lessonId: string;
    unitId: TUnit;
    exerciseProgress: Record<string, TExerciseProgress>;
    completed: boolean;
    completedAt?: number; // timestamp
    startedAt: number;
};

/**
 * Progress for a curriculum unit
 */
export type TUnitProgress = {
    unitId: TUnit;
    lessonProgress: Record<string, TLessonProgress>;
    completed: boolean;
    completedAt?: number;
};

/**
 * Overall curriculum progress for a user session
 */
export type TCurriculumProgress = {
    sessionId: string; // UUID
    gradeLevel: TGradeLevel;
    unitProgress: Record<TUnit, TUnitProgress>;
    currentLessonId?: string;
    currentExerciseId?: string;
    createdAt: number;
    updatedAt: number;
};

/**
 * Stored progress entry in IndexedDB
 */
export type TStoredProgress = {
    id: string; // sessionId
    progress: TCurriculumProgress;
    timestamp: number;
};

// ============================================================================
// API Configuration Types
// ============================================================================

export type TAPISettings = {
    provider: TLLMProvider | 'none';
    googleApiKey?: string;
    anthropicApiKey?: string;
    openaiApiKey?: string;
    feedbackModel: TLLMModel;
    visionModel: TLLMModel;
    offlineMode: boolean;
};

// ============================================================================
// UI State Types
// ============================================================================

export type TLearnTabState = {
    selectedGrade: TGradeLevel;
    selectedUnit?: TUnit;
    selectedLesson?: string;
    selectedExercise?: string;
    isExerciseMode: boolean;
};

export type TExerciseOverlayState = {
    visible: boolean;
    exerciseId?: string;
    showGuides: boolean;
    realTimeFeedback: boolean;
};

// ============================================================================
// Animation Types
// ============================================================================

/**
 * Animation step action types
 */
export type TAnimationAction =
    | 'moveTo'
    | 'lineTo'
    | 'curveTo'
    | 'fill'
    | 'highlightDot'
    | 'connectDots'
    | 'pause';

/**
 * Single step in an animation sequence
 */
export type TAnimationStep = {
    action: TAnimationAction;
    params: Record<string, number | string>;
    duration: number; // ms
};

/**
 * Animation configuration for exercise demonstrations
 */
export type TAnimationConfig = {
    type: 'stroke' | 'fill' | 'sequence';
    steps: TAnimationStep[];
    duration: number; // total ms
    loop: boolean;
};

/**
 * Demo player state
 */
export type TDemoPlayerState = {
    isPlaying: boolean;
    currentStep: number;
    progress: number; // 0-1
};
