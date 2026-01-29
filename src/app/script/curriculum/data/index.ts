/**
 * Curriculum Data Index
 * Central registry for all grade curricula with unified access functions
 */

import { TGradeCurriculum, TGradeLevel, TCurriculumUnit, TLesson, TExercise } from '../types';
import { kindergartenCurriculum } from './kindergarten';
import { grade1Curriculum } from './grade1';
import { grade2Curriculum } from './grade2';

// ============================================================================
// Curriculum Registry
// ============================================================================

/**
 * All available curricula indexed by grade level
 */
export const curriculumRegistry: Record<TGradeLevel, TGradeCurriculum> = {
    kindergarten: kindergartenCurriculum,
    grade1: grade1Curriculum,
    grade2: grade2Curriculum,
    grade3: null as unknown as TGradeCurriculum, // Placeholder
};

/**
 * Grade levels that have curriculum content implemented
 */
export const availableGrades: TGradeLevel[] = ['kindergarten', 'grade1', 'grade2'];

/**
 * Check if a grade level has curriculum content
 */
export function isGradeAvailable(grade: TGradeLevel): boolean {
    return availableGrades.includes(grade);
}

// ============================================================================
// Unified Access Functions
// ============================================================================

/**
 * Get curriculum for a specific grade level
 */
export function getCurriculum(gradeLevel: TGradeLevel): TGradeCurriculum | undefined {
    if (!isGradeAvailable(gradeLevel)) return undefined;
    return curriculumRegistry[gradeLevel];
}

/**
 * Get all exercises across all grades or for a specific grade
 */
export function getAllExercises(gradeLevel?: TGradeLevel): TExercise[] {
    const exercises: TExercise[] = [];
    const grades = gradeLevel ? [gradeLevel] : availableGrades;

    for (const grade of grades) {
        const curriculum = getCurriculum(grade);
        if (!curriculum) continue;

        for (const unit of curriculum.units) {
            for (const lesson of unit.lessons) {
                exercises.push(...lesson.exercises);
            }
        }
    }
    return exercises;
}

/**
 * Get exercise by ID (searches all grades)
 */
export function getExerciseById(exerciseId: string): TExercise | undefined {
    return getAllExercises().find((e) => e.id === exerciseId);
}

/**
 * Get exercise by ID within a specific grade
 */
export function getExerciseByIdForGrade(
    exerciseId: string,
    gradeLevel: TGradeLevel
): TExercise | undefined {
    return getAllExercises(gradeLevel).find((e) => e.id === exerciseId);
}

/**
 * Get lesson by ID (searches all grades)
 */
export function getLessonById(lessonId: string): TLesson | undefined {
    for (const grade of availableGrades) {
        const curriculum = getCurriculum(grade);
        if (!curriculum) continue;

        for (const unit of curriculum.units) {
            const lesson = unit.lessons.find((l) => l.id === lessonId);
            if (lesson) return lesson;
        }
    }
    return undefined;
}

/**
 * Get lesson by ID within a specific grade
 */
export function getLessonByIdForGrade(
    lessonId: string,
    gradeLevel: TGradeLevel
): TLesson | undefined {
    const curriculum = getCurriculum(gradeLevel);
    if (!curriculum) return undefined;

    for (const unit of curriculum.units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return lesson;
    }
    return undefined;
}

/**
 * Get unit by ID (searches all grades)
 */
export function getUnitById(unitId: string, gradeLevel?: TGradeLevel): TCurriculumUnit | undefined {
    const grades = gradeLevel ? [gradeLevel] : availableGrades;

    for (const grade of grades) {
        const curriculum = getCurriculum(grade);
        if (!curriculum) continue;

        const unit = curriculum.units.find((u) => u.id === unitId);
        if (unit) return unit;
    }
    return undefined;
}

/**
 * Get total exercise count for a grade or all grades
 */
export function getTotalExerciseCount(gradeLevel?: TGradeLevel): number {
    return getAllExercises(gradeLevel).length;
}

/**
 * Get exercises for a specific unit within a grade
 */
export function getExercisesForUnit(unitId: string, gradeLevel: TGradeLevel): TExercise[] {
    const unit = getUnitById(unitId, gradeLevel);
    if (!unit) return [];

    const exercises: TExercise[] = [];
    for (const lesson of unit.lessons) {
        exercises.push(...lesson.exercises);
    }
    return exercises;
}

/**
 * Determine which grade an exercise belongs to based on its ID
 */
export function getGradeForExercise(exerciseId: string): TGradeLevel | undefined {
    if (exerciseId.startsWith('k-')) return 'kindergarten';
    if (exerciseId.startsWith('g1-')) return 'grade1';
    if (exerciseId.startsWith('g2-')) return 'grade2';
    if (exerciseId.startsWith('g3-')) return 'grade3';

    // Fallback: search all grades
    for (const grade of availableGrades) {
        const exercise = getExerciseByIdForGrade(exerciseId, grade);
        if (exercise) return grade;
    }
    return undefined;
}

/**
 * Get display name for a grade level
 */
export function getGradeDisplayName(gradeLevel: TGradeLevel): string {
    switch (gradeLevel) {
        case 'kindergarten':
            return 'Kindergarten';
        case 'grade1':
            return 'Grade 1';
        case 'grade2':
            return 'Grade 2';
        case 'grade3':
            return 'Grade 3';
        default:
            return gradeLevel;
    }
}

// Re-export individual curricula for backward compatibility
export { kindergartenCurriculum } from './kindergarten';
export { grade1Curriculum } from './grade1';
export { grade2Curriculum } from './grade2';
