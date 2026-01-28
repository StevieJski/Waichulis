/**
 * Prompt Templates
 * Templates for generating LLM feedback on exercises
 */

import { TAssessmentMetrics, TFeedbackHints, TGradeLevel, TUnit } from '../types';

// ============================================================================
// System Prompts
// ============================================================================

export const FEEDBACK_SYSTEM_PROMPT = `You are a friendly, encouraging art teacher helping young children (ages 5-8) learn to draw. Your feedback should be:
- Warm and supportive (use phrases like "Great effort!" "You're getting better!")
- Age-appropriate (simple words, short sentences)
- Specific (mention exactly what they did well)
- Constructive (give one clear tip for improvement)
- Connected to learning goals (explain why the skill matters)

Never be discouraging. Always find something positive to say first. Remember these are young children who are learning basic drawing skills.`;

export const VISION_SYSTEM_PROMPT = `You are an art teacher analyzing a child's drawing exercise. Be encouraging and specific in your observations. Focus on:
- What the child did well
- Clear, simple suggestions for improvement
- Age-appropriate language (kindergarten to 3rd grade level)

Always start with positive observations before any suggestions.`;

// ============================================================================
// Grade Level Language Guidelines
// ============================================================================

const GRADE_LANGUAGE_HINTS: Record<TGradeLevel, string> = {
    kindergarten: 'Use very simple words. Short sentences. Lots of enthusiasm! Ages 5-6.',
    grade1: 'Simple words. Can use slightly longer sentences. Ages 6-7.',
    grade2: 'Can understand more detailed feedback. Ages 7-8.',
    grade3: 'Can handle more specific technical terms. Ages 8-9.',
};

// ============================================================================
// Exercise Type Descriptions
// ============================================================================

const EXERCISE_TYPE_DESCRIPTIONS: Record<TUnit, string> = {
    dot: 'connecting dots to form shapes or letters',
    line: 'drawing or tracing different types of lines',
    shape: 'drawing geometric shapes',
    color: 'using colors to fill areas or match colors',
};

// ============================================================================
// Template Functions
// ============================================================================

/**
 * Generate the exercise feedback prompt
 */
export function getExerciseFeedbackPrompt(params: {
    exerciseType: TUnit;
    exerciseTitle: string;
    localScore: number;
    localMetrics: TAssessmentMetrics;
    attemptNumber: number;
    studentGradeLevel: TGradeLevel;
    feedbackHints: TFeedbackHints;
    hasImage: boolean;
}): string {
    const {
        exerciseType,
        exerciseTitle,
        localScore,
        localMetrics,
        attemptNumber,
        studentGradeLevel,
        feedbackHints,
        hasImage,
    } = params;

    const metricsJson = JSON.stringify(localMetrics, null, 2);
    const exerciseDescription = EXERCISE_TYPE_DESCRIPTIONS[exerciseType];
    const gradeHint = GRADE_LANGUAGE_HINTS[studentGradeLevel];

    let prompt = `The student just completed a ${exerciseType} exercise: "${exerciseTitle}"
This exercise involves ${exerciseDescription}.

Student Grade Level: ${studentGradeLevel}
Language Guidance: ${gradeHint}

Exercise Skill: ${feedbackHints.skillName}
Success Criteria: ${feedbackHints.successCriteria}
Common Mistakes to Watch For: ${feedbackHints.commonMistakes.join(', ')}

Their Score: ${localScore}/100
Attempt Number: ${attemptNumber}
${localScore >= 70 ? 'Status: PASSED!' : 'Status: Keep practicing'}

Assessment Metrics:
${metricsJson}
`;

    if (hasImage) {
        prompt += `
An image of the student's drawing is attached. Please analyze it along with the metrics.
`;
    }

    prompt += `
Please provide feedback in this exact JSON format (no markdown, just raw JSON):
{
  "encouragement": "One warm, encouraging sentence appropriate for a ${studentGradeLevel} student",
  "specificPraise": ["1-2 specific things they did well based on the metrics and/or image"],
  "improvementTips": ["${localScore >= 80 ? 'Empty array since they did great' : '1 simple, actionable tip for improvement'}"],
  "nextStepHint": "${localScore >= 70 ? 'Optional encouraging hint about what comes next' : 'null'}"
}`;

    return prompt;
}

/**
 * Generate prompt for lesson summary
 */
export function getLessonSummaryPrompt(params: {
    lessonTitle: string;
    exerciseResults: { title: string; score: number; passed: boolean }[];
    studentGradeLevel: TGradeLevel;
    overallPassRate: number;
}): string {
    const { lessonTitle, exerciseResults, studentGradeLevel, overallPassRate } = params;
    const gradeHint = GRADE_LANGUAGE_HINTS[studentGradeLevel];

    const exerciseList = exerciseResults
        .map((e) => `- ${e.title}: ${e.score}/100 (${e.passed ? 'Passed' : 'Keep practicing'})`)
        .join('\n');

    return `A ${studentGradeLevel} student just completed the lesson "${lessonTitle}".
Language Guidance: ${gradeHint}

Exercise Results:
${exerciseList}

Overall Pass Rate: ${overallPassRate}%

Please write a brief, encouraging summary (2-3 sentences) that:
1. Celebrates their accomplishments
2. Mentions specific skills they've learned
3. Encourages them to continue (or congratulates them if they passed everything)

Keep it age-appropriate and positive. Just provide the summary text, no JSON format needed.`;
}

/**
 * Generate prompt for "Get Help" feature
 */
export function getHelpPrompt(params: {
    exerciseType: TUnit;
    exerciseTitle: string;
    exerciseInstructions: string;
    feedbackHints: TFeedbackHints;
    attemptNumber: number;
    lastScore: number;
    studentGradeLevel: TGradeLevel;
}): string {
    const {
        exerciseType,
        exerciseTitle,
        exerciseInstructions,
        feedbackHints,
        attemptNumber,
        lastScore,
        studentGradeLevel,
    } = params;

    const gradeHint = GRADE_LANGUAGE_HINTS[studentGradeLevel];

    return `A ${studentGradeLevel} student is asking for help with the exercise "${exerciseTitle}".
Language Guidance: ${gradeHint}

Exercise Type: ${exerciseType}
Instructions: ${exerciseInstructions}
Skill Being Practiced: ${feedbackHints.skillName}
Success Criteria: ${feedbackHints.successCriteria}

Student has tried ${attemptNumber} time(s). Last score: ${lastScore}/100

Please provide helpful guidance in this JSON format:
{
  "tips": ["2-3 simple, step-by-step tips to help them succeed"],
  "encouragement": "A brief encouraging message",
  "demonstration": "A simple description of the technique they should use"
}

Remember to use age-appropriate language and be encouraging!`;
}

// ============================================================================
// Fallback Templates (for offline mode)
// ============================================================================

/**
 * Get fallback feedback when LLM is not available
 */
export function getFallbackFeedback(
    score: number,
    exerciseType: TUnit,
    feedbackHints: TFeedbackHints
): {
    encouragement: string;
    specificPraise: string[];
    improvementTips: string[];
    nextStepHint?: string;
} {
    // Score-based encouragement
    let encouragement: string;
    let specificPraise: string[];
    let improvementTips: string[];
    let nextStepHint: string | undefined;

    if (score >= 90) {
        encouragement = 'Amazing work! You did a fantastic job!';
        specificPraise = [`Your ${feedbackHints.skillName} look great!`, 'You followed the guide perfectly!'];
        improvementTips = [];
        nextStepHint = "You're ready for the next challenge!";
    } else if (score >= 70) {
        encouragement = 'Great job! You passed this exercise!';
        specificPraise = [`Nice work on your ${feedbackHints.skillName}!`];
        improvementTips = ['Keep practicing to get even better!'];
        nextStepHint = 'Ready to try the next one?';
    } else if (score >= 50) {
        encouragement = "Good effort! You're getting better!";
        specificPraise = ["You're making progress!"];
        improvementTips = [feedbackHints.commonMistakes[0] ? `Try to avoid: ${feedbackHints.commonMistakes[0]}` : 'Take your time and try again!'];
    } else {
        encouragement = 'Keep trying! Practice makes perfect!';
        specificPraise = ['Every try helps you learn!'];
        improvementTips = ['Go slowly and follow the guide carefully.'];
    }

    return { encouragement, specificPraise, improvementTips, nextStepHint };
}

/**
 * Get fallback help tips
 */
export function getFallbackHelpTips(
    exerciseType: TUnit,
    feedbackHints: TFeedbackHints
): {
    tips: string[];
    encouragement: string;
    demonstration: string;
} {
    const baseTips: Record<TUnit, string[]> = {
        line: [
            'Start at the green dot',
            'Move slowly and steadily',
            'Try to stay on the dotted line',
        ],
        dot: [
            'Find dot number 1 first',
            'Connect the dots in order',
            'Draw a line from one dot to the next',
        ],
        shape: [
            'Look at the guide shape',
            'Start at one corner',
            'Connect all the sides to close the shape',
        ],
        color: [
            'Pick the right color first',
            'Stay inside the lines',
            'Fill in the whole area',
        ],
    };

    return {
        tips: baseTips[exerciseType] || ['Take your time', 'Follow the guide', 'You can do it!'],
        encouragement: "You've got this! Let's try together!",
        demonstration: feedbackHints.successCriteria,
    };
}
