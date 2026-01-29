# Visual Language Learning App - Implementation Plan

## Overview

Add AI-powered learning capabilities to the Klecks drawing app, enabling users to practice exercises from the Visual Language I curriculum with automated assessment and progress tracking.

**Scope**: Kindergarten curriculum only (DOT, LINE, SHAPE, COLOR units)
**Assessment**: Hybrid - Local algorithms + Cloud LLM APIs
**Storage**: IndexedDB (browser-local)

---

## Architecture

### New Module Structure

```
src/app/script/
  curriculum/                       # NEW learning system
    types.ts                        # All type definitions
    data/
      kindergarten.ts               # Kindergarten curriculum content
    assessment/
      stroke-analyzer.ts            # Line/stroke accuracy (DTW algorithm)
      shape-analyzer.ts             # Shape recognition & matching
      color-analyzer.ts             # Color distance (Delta-E)
      llm-feedback.ts               # LLM API integration for feedback
      assessment-orchestrator.ts    # Combines local + LLM assessment
    api/
      llm-client.ts                 # Multi-provider LLM client
      api-config.ts                 # API keys and model settings
      prompt-templates.ts           # Feedback prompt templates
    storage/
      progress-store.ts             # IndexedDB wrapper for progress
    ui/
      learn-tab-ui.ts               # Main Learn tab (like file-ui.ts)
      curriculum-browser.ts         # Lesson/exercise browser
      exercise-panel.ts             # Exercise instructions overlay
      assessment-modal.ts           # Results modal with feedback
      settings-panel.ts             # API key configuration
    tools/
      easel-exercise.ts             # TEaselTool for exercise mode
      exercise-overlay.ts           # SVG guides/targets overlay
```

---

## Hybrid Assessment System

### Two-Layer Assessment

| Layer | Purpose | Speed | When Used |
|-------|---------|-------|-----------|
| **Local Algorithms** | Numeric scoring (0-100) | Instant | Every stroke, real-time feedback |
| **Cloud LLM** | Natural language feedback | 1-3 sec | Exercise completion, detailed tips |

### Local Assessment (Immediate)

**Stroke Analyzer** (for line tracing & connect-dots):
- Dynamic Time Warping (DTW) to compare user strokes to target paths
- Metrics: path accuracy, smoothness, completeness
- Score 0-100 based on configurable tolerance

**Shape Analyzer** (for shape exercises):
- Bounding box comparison
- Corner detection for polygons
- Ellipse fitting for circles/ovals
- Metrics: shape match, aspect ratio, closedness

**Color Analyzer** (for color matching):
- CIEDE2000 Delta-E color difference
- Tolerance-based scoring

### LLM Assessment (Rich Feedback)

**When triggered:**
1. After exercise submission (always)
2. After 3+ failed attempts (encouragement)
3. On "Get Help" button click
4. End-of-lesson summary

**What it provides:**
- Encouragement tailored to child's age (K-3 language)
- Specific praise: "Your curved line is very smooth!"
- Improvement tips: "Try to keep your zigzag lines the same height"
- Skill connections: "Great job! Curved lines help you draw circles"

---

## LLM Model Selection

### Recommended Models by Use Case

| Use Case | Primary Model | Fallback | Rationale |
|----------|--------------|----------|-----------|
| **Per-exercise feedback** | Claude 3.5 Haiku | GPT-4o-mini | Fast, cheap (~$0.001/call), good for frequent use |
| **Image analysis** | Claude 3.5 Sonnet | GPT-4o | Best vision capabilities for analyzing drawings |
| **Lesson summaries** | Claude 3.5 Sonnet | GPT-4o | More nuanced, detailed feedback worth the cost |
| **Offline fallback** | Local templates | - | Pre-written feedback when no API available |

### Model Characteristics

**Claude 3.5 Haiku** (Recommended for frequent feedback)
- Latency: ~500ms
- Cost: ~$0.25/1M input, $1.25/1M output
- Strengths: Fast, cheap, good instruction following
- Best for: Real-time encouragement, quick tips

**Claude 3.5 Sonnet** (Recommended for vision + detailed feedback)
- Latency: ~1-2s
- Cost: ~$3/1M input, $15/1M output
- Strengths: Excellent vision, nuanced understanding
- Best for: Analyzing drawing images, detailed improvement advice

**GPT-4o-mini** (Alternative for frequent feedback)
- Latency: ~500ms
- Cost: ~$0.15/1M input, $0.60/1M output
- Strengths: Very cheap, fast
- Best for: Budget-conscious deployments

**GPT-4o** (Alternative for vision)
- Latency: ~1-2s
- Cost: ~$5/1M input, $15/1M output
- Strengths: Strong vision, creative responses
- Best for: Alternative to Sonnet for image analysis

### API Integration Design

```typescript
// api/llm-client.ts
type TLLMProvider = 'anthropic' | 'openai';

type TLLMConfig = {
  provider: TLLMProvider;
  model: string;
  apiKey: string;
};

type TFeedbackRequest = {
  exerciseType: string;
  exerciseTitle: string;
  localScore: number;
  localMetrics: TAssessmentMetrics;
  attemptNumber: number;
  drawingImage?: string;  // Base64 PNG for vision models
  studentGradeLevel: TGradeLevel;
};

type TFeedbackResponse = {
  encouragement: string;      // "Great job! You're doing well!"
  specificPraise: string[];   // ["Your lines are very straight"]
  improvementTips: string[];  // ["Try to connect the dots in order"]
  nextStepHint?: string;      // "Ready to try curved lines?"
};

class LLMClient {
  constructor(config: TLLMConfig);

  async getFeedback(request: TFeedbackRequest): Promise<TFeedbackResponse>;
  async analyzeDrawing(image: string, exercise: TExercise): Promise<TDrawingAnalysis>;
  async getLessonSummary(lessonProgress: TLessonProgress): Promise<string>;
}
```

### Prompt Engineering

```typescript
// api/prompt-templates.ts

const FEEDBACK_SYSTEM_PROMPT = `
You are a friendly, encouraging art teacher helping young children (ages 5-8)
learn to draw. Your feedback should be:
- Warm and supportive (use phrases like "Great effort!" "You're getting better!")
- Age-appropriate (simple words, short sentences)
- Specific (mention exactly what they did well)
- Constructive (give one clear tip for improvement)
- Connected to learning goals (explain why the skill matters)

Never be discouraging. Always find something positive to say first.
`;

const EXERCISE_FEEDBACK_TEMPLATE = `
The student just completed a {exerciseType} exercise: "{exerciseTitle}"

Their score: {score}/100
Attempt number: {attemptNumber}
Grade level: {gradeLevel}

Metrics:
{metricsJson}

{imageSection}

Please provide feedback in this JSON format:
{
  "encouragement": "One warm, encouraging sentence",
  "specificPraise": ["1-2 specific things they did well"],
  "improvementTips": ["1 simple tip if score < 80, empty if excellent"],
  "nextStepHint": "Optional hint about what comes next"
}
`;
```

---

## Key Components

### 1. Curriculum Data Model

**Exercises include:**
- Line tracing: straight, curved, zigzag, wavy, broken, spiral
- Connect-the-dots: letters A-J, numbers 1-10
- Shape practice: triangle, square, diamond, rectangle, circle, oval
- Color matching: color wheel, fruit coloring (red apple, orange, yellow banana, etc.)

**Data structure:**
```typescript
type TExercise = {
  id: string;
  unit: 'dot' | 'line' | 'shape' | 'color';
  title: string;
  instructions: string;
  difficulty: 1 | 2 | 3;
  config: TLineConfig | TDotsConfig | TShapeConfig | TColorConfig;
  passingScore: number;

  // LLM feedback configuration
  feedbackHints: {
    skillName: string;           // "curved lines"
    commonMistakes: string[];    // ["lifting pen", "going too fast"]
    successCriteria: string;     // "smooth curve connecting both dots"
  };
};
```

### 2. Assessment Orchestrator

```typescript
// assessment/assessment-orchestrator.ts

class AssessmentOrchestrator {
  private strokeAnalyzer: StrokeAnalyzer;
  private shapeAnalyzer: ShapeAnalyzer;
  private colorAnalyzer: ColorAnalyzer;
  private llmClient: LLMClient | null;

  constructor(llmConfig?: TLLMConfig) {
    // LLM is optional - works offline with local-only
    this.llmClient = llmConfig ? new LLMClient(llmConfig) : null;
  }

  async assess(
    exercise: TExercise,
    strokes: TStrokeData[],
    canvasSnapshot: ImageData
  ): Promise<TFullAssessment> {
    // 1. Local assessment (immediate)
    const localResult = this.runLocalAssessment(exercise, strokes);

    // 2. LLM feedback (async, optional)
    let llmFeedback: TFeedbackResponse | null = null;
    if (this.llmClient) {
      try {
        llmFeedback = await this.llmClient.getFeedback({
          exerciseType: exercise.unit,
          exerciseTitle: exercise.title,
          localScore: localResult.score,
          localMetrics: localResult.metrics,
          attemptNumber: this.getAttemptCount(exercise.id),
          drawingImage: this.canvasToBase64(canvasSnapshot),
          studentGradeLevel: 'kindergarten',
        });
      } catch (e) {
        // Fallback to local templates if API fails
        llmFeedback = this.getLocalFallbackFeedback(localResult);
      }
    } else {
      llmFeedback = this.getLocalFallbackFeedback(localResult);
    }

    return {
      score: localResult.score,
      metrics: localResult.metrics,
      passed: localResult.score >= exercise.passingScore,
      feedback: llmFeedback,
    };
  }
}
```

### 3. UI Integration

**New "Learn" Tab** in the left toolspace:
- Grade selector (Kindergarten highlighted)
- Unit tabs: DOT/LINE, SHAPE, COLOR
- Lesson cards with completion badges
- "Continue Learning" button
- Settings gear for API configuration

**Exercise Mode:**
- Full-screen exercise view
- SVG overlay showing guides (dashed lines, dots, shape outlines)
- Real-time stroke feedback (green/yellow/red indicators) - LOCAL
- Submit button triggers assessment
- Modal shows:
  - Score (from local algorithms)
  - LLM feedback with encouragement and tips (loading spinner while fetching)
  - "Try Again" or "Next Exercise" buttons

**Settings Panel:**
- API provider dropdown (Anthropic / OpenAI / None)
- API key input (stored in localStorage, encrypted)
- Model selection per use case
- Test connection button
- Offline mode toggle

### 4. Storage

**IndexedDB Store**: `CurriculumProgressStore`
- Keyed by session ID (auto-generated UUID)
- Stores: grade level, lesson progress, exercise attempts, best scores
- Survives page refresh, no account needed

**LocalStorage**: API configuration
- Encrypted API keys
- Model preferences
- Offline mode setting

---

## Critical Files to Modify

| File | Changes |
|------|---------|
| `src/app/script/app/kl-app.ts` | Add Learn tab to TabRow, initialize LearnTabUi |
| `src/app/script/klecks/storage/kl-indexed-db.ts` | Add progress store, bump DB version |
| `src/languages/_base-en.json5` | Add translation keys for Learn UI |
| `src/app/script/klecks/ui/easel/easel.ts` | Register EaselExercise tool |

---

## Implementation Phases

### Phase 1: Foundation
- Create `curriculum/` module structure
- Define TypeScript types
- Implement `ProgressStore` with IndexedDB
- Add "Learn" tab shell to TabRow
- **NEW**: Create LLM client with Anthropic + OpenAI support

### Phase 2: Line Exercises + Basic LLM
- Implement `ExerciseOverlay` (SVG rendering)
- Create `EaselExercise` tool
- Build `StrokeAnalyzer` with DTW
- Add Kindergarten LINE exercises (6 line types)
- **NEW**: Integrate Haiku for per-exercise feedback

### Phase 3: Connect-the-Dots
- Extend overlay for dot markers with labels
- Add connect-dots exercises (A-J, 1-10)
- Validate connection order in assessment

### Phase 4: Shape Exercises + Vision
- Implement `ShapeAnalyzer`
- Add shape tracing exercises (6 shapes)
- Handle freehand shape drawing mode
- **NEW**: Integrate Sonnet vision for drawing analysis

### Phase 5: Color Exercises
- Implement `ColorAnalyzer`
- Add color wheel exercise
- Add fruit coloring exercises
- Color picker integration

### Phase 6: Polish + Advanced Feedback
- Progress dashboard with completion percentages
- Assessment modal with LLM feedback display
- **NEW**: Lesson summary generation with LLM
- **NEW**: "Get Help" button with detailed AI tutoring
- Settings panel for API configuration
- Testing and bug fixes

---

## Exercise Content (Kindergarten)

Derived from Visual Language Kindergarten PDF (pages 3-55):

**Unit: DOT/LINE** (~12 exercises)
- First marks: dot, line introduction
- Line tracing: straight, curved, wavy, zigzag, broken, spiral
- Connect-the-dots: letters A-J, numbers 1-10, colors, objects

**Unit: SHAPE** (~8 exercises)
- Shape introduction: triangle, square, diamond, rectangle, circle, oval
- Shape tracing with guides
- Shape drawing practice

**Unit: COLOR** (~6 exercises)
- Color wheel (6 colors: red, orange, yellow, green, blue, purple)
- Rainbow coloring
- Fruit coloring (apple=red, orange=orange, banana/pear=yellow/green, blueberries=blue, grapes=purple)

---

## Sample LLM Feedback Examples

**Line Tracing (Score: 85)**
```json
{
  "encouragement": "Wonderful work! You're becoming a line expert!",
  "specificPraise": [
    "Your wavy line flows really smoothly",
    "You stayed inside the guide almost the whole way"
  ],
  "improvementTips": [
    "Try to slow down a tiny bit at the curves"
  ],
  "nextStepHint": "Ready to try a zigzag line next?"
}
```

**Shape Drawing (Score: 62, Attempt 3)**
```json
{
  "encouragement": "Great effort! Drawing circles is tricky, and you're getting better!",
  "specificPraise": [
    "Your circle is nice and round on the top"
  ],
  "improvementTips": [
    "Try to end your line where you started - that closes the circle"
  ],
  "nextStepHint": null
}
```

---

## Cost Estimation

Assuming:
- 30 exercises per student
- 2 attempts average per exercise
- 60 LLM calls per student (Haiku)
- 5 vision analyses per student (Sonnet)

**Per Student Cost:**
- Haiku feedback: 60 calls × ~$0.001 = ~$0.06
- Sonnet vision: 5 calls × ~$0.01 = ~$0.05
- **Total: ~$0.11 per student**

---

## Verification Plan

1. **Unit Tests**: Assessment algorithms with known inputs
2. **LLM Tests**: Mock API responses, test prompt templates
3. **Manual Testing**: Complete each exercise type, verify scoring accuracy
4. **API Fallback**: Test offline mode with local feedback templates
5. **Progress Persistence**: Close/reopen browser, verify progress retained
6. **Build Check**: `npm run build` succeeds without errors
7. **Dev Server**: `npm run start`, test full exercise flow

---

## Notes

- Exercise content will be programmatically defined (SVG paths, coordinates) based on PDF worksheets
- The "cut and assemble" exercises from PDFs are not applicable digitally and will be skipped
- API keys stored client-side (user provides their own key)
- Graceful degradation: works fully offline with local algorithms + template feedback
- Future expansion: grades 1-3, cloud sync, teacher dashboard, learning analytics
