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

// UI
export { LearnUi } from './ui/learn-ui';
