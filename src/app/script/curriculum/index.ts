/**
 * Curriculum Module
 * Visual Language learning system for Klecks
 */

// Types
export * from './types';

// Data
export * from './data/kindergarten';

// Storage
export { progressStore, ProgressStore } from './storage/progress-store';

// API
export { apiConfig, APIConfig } from './api/api-config';
export { llmClient, LLMClient } from './api/llm-client';
export * from './api/prompt-templates';

// Assessment
export { strokeAnalyzer, StrokeAnalyzer } from './assessment/stroke-analyzer';
export { shapeAnalyzer, ShapeAnalyzer } from './assessment/shape-analyzer';
export { colorAnalyzer, ColorAnalyzer } from './assessment/color-analyzer';
export { assessmentOrchestrator, AssessmentOrchestrator } from './assessment/assessment-orchestrator';

// Tools
export { ExerciseOverlay } from './tools/exercise-overlay';
export { EaselExercise } from './tools/easel-exercise';

// UI
export { LearnUi } from './ui/learn-ui';
export { ExercisePanel } from './ui/exercise-panel';
export { AssessmentModal, showAssessmentModal } from './ui/assessment-modal';
export { ExerciseController } from './ui/exercise-controller';
export { SettingsPanel } from './ui/settings-panel';
