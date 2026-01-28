/**
 * LLM Client
 * Multi-provider client for Anthropic and OpenAI APIs
 */

import {
    TFeedbackRequest,
    TFeedbackResponse,
    TLLMConfig,
    TLLMModel,
    TLLMProvider,
} from '../types';
import { apiConfig } from './api-config';
import {
    FEEDBACK_SYSTEM_PROMPT,
    getExerciseFeedbackPrompt,
    getFallbackFeedback,
    getFallbackHelpTips,
    getHelpPrompt,
    getLessonSummaryPrompt,
} from './prompt-templates';

// ============================================================================
// Types
// ============================================================================

type TAnthropicMessage = {
    role: 'user' | 'assistant';
    content: string | TAnthropicContentBlock[];
};

type TAnthropicContentBlock =
    | { type: 'text'; text: string }
    | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };

type TAnthropicResponse = {
    content: { type: 'text'; text: string }[];
    stop_reason: string;
};

type TOpenAIMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string | TOpenAIContentBlock[];
};

type TOpenAIContentBlock =
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } };

type TOpenAIResponse = {
    choices: { message: { content: string } }[];
};

type THelpResponse = {
    tips: string[];
    encouragement: string;
    demonstration: string;
};

// ============================================================================
// LLM Client Class
// ============================================================================

export class LLMClient {
    private config: TLLMConfig | null = null;

    constructor(config?: TLLMConfig) {
        if (config) {
            this.config = config;
        } else {
            // Load from apiConfig
            this.refreshConfig();
        }
    }

    /**
     * Refresh configuration from apiConfig
     */
    refreshConfig(): void {
        const settings = apiConfig.getSettings();
        if (settings.provider !== 'none' && apiConfig.isLLMAvailable()) {
            this.config = {
                provider: settings.provider as TLLMProvider,
                model: settings.feedbackModel,
                apiKey: apiConfig.getActiveApiKey()!,
            };
        } else {
            this.config = null;
        }
    }

    /**
     * Check if LLM is available
     */
    isAvailable(): boolean {
        return this.config !== null && !apiConfig.isOfflineMode();
    }

    // ----------------------------------- Feedback Methods -----------------------------------

    /**
     * Get feedback for an exercise attempt
     */
    async getFeedback(request: TFeedbackRequest): Promise<TFeedbackResponse> {
        if (!this.isAvailable()) {
            // Return fallback feedback
            return getFallbackFeedback(
                request.localScore,
                request.exerciseType,
                request.feedbackHints
            );
        }

        try {
            const prompt = getExerciseFeedbackPrompt({
                exerciseType: request.exerciseType,
                exerciseTitle: request.exerciseTitle,
                localScore: request.localScore,
                localMetrics: request.localMetrics,
                attemptNumber: request.attemptNumber,
                studentGradeLevel: request.studentGradeLevel,
                feedbackHints: request.feedbackHints,
                hasImage: !!request.drawingImage,
            });

            let response: string;

            if (request.drawingImage) {
                // Use vision model
                response = await this.sendMessageWithImage(
                    prompt,
                    request.drawingImage,
                    FEEDBACK_SYSTEM_PROMPT,
                    apiConfig.getVisionModel()
                );
            } else {
                response = await this.sendMessage(
                    prompt,
                    FEEDBACK_SYSTEM_PROMPT,
                    apiConfig.getFeedbackModel()
                );
            }

            return this.parseFeedbackResponse(response, request);
        } catch (error) {
            console.error('LLMClient: Failed to get feedback', error);
            // Return fallback on error
            return getFallbackFeedback(
                request.localScore,
                request.exerciseType,
                request.feedbackHints
            );
        }
    }

    /**
     * Get lesson summary feedback
     */
    async getLessonSummary(params: {
        lessonTitle: string;
        exerciseResults: { title: string; score: number; passed: boolean }[];
        studentGradeLevel: TFeedbackRequest['studentGradeLevel'];
        overallPassRate: number;
    }): Promise<string> {
        if (!this.isAvailable()) {
            // Fallback summary
            if (params.overallPassRate >= 100) {
                return `Amazing! You completed all exercises in "${params.lessonTitle}"! You're a star!`;
            } else if (params.overallPassRate >= 70) {
                return `Great work on "${params.lessonTitle}"! You're learning so much!`;
            } else {
                return `Keep practicing "${params.lessonTitle}"! You're getting better every time!`;
            }
        }

        try {
            const prompt = getLessonSummaryPrompt(params);
            return await this.sendMessage(prompt, FEEDBACK_SYSTEM_PROMPT, apiConfig.getFeedbackModel());
        } catch (error) {
            console.error('LLMClient: Failed to get lesson summary', error);
            return `Great work on "${params.lessonTitle}"! Keep learning and having fun!`;
        }
    }

    /**
     * Get help for a struggling student
     */
    async getHelp(params: {
        exerciseType: TFeedbackRequest['exerciseType'];
        exerciseTitle: string;
        exerciseInstructions: string;
        feedbackHints: TFeedbackRequest['feedbackHints'];
        attemptNumber: number;
        lastScore: number;
        studentGradeLevel: TFeedbackRequest['studentGradeLevel'];
    }): Promise<THelpResponse> {
        if (!this.isAvailable()) {
            return getFallbackHelpTips(params.exerciseType, params.feedbackHints);
        }

        try {
            const prompt = getHelpPrompt(params);
            const response = await this.sendMessage(
                prompt,
                FEEDBACK_SYSTEM_PROMPT,
                apiConfig.getFeedbackModel()
            );
            return this.parseHelpResponse(response, params.exerciseType, params.feedbackHints);
        } catch (error) {
            console.error('LLMClient: Failed to get help', error);
            return getFallbackHelpTips(params.exerciseType, params.feedbackHints);
        }
    }

    // ----------------------------------- Test Connection -----------------------------------

    /**
     * Test the API connection
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        if (!this.config) {
            return { success: false, message: 'No API configured' };
        }

        try {
            const response = await this.sendMessage(
                'Say "Hello!" in one word.',
                'You are a helpful assistant. Respond briefly.',
                this.config.model
            );

            if (response && response.length > 0) {
                return { success: true, message: 'Connection successful!' };
            }
            return { success: false, message: 'No response received' };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return { success: false, message };
        }
    }

    // ----------------------------------- Private Methods -----------------------------------

    private async sendMessage(
        userMessage: string,
        systemPrompt: string,
        model: TLLMModel
    ): Promise<string> {
        if (!this.config) {
            throw new Error('LLM not configured');
        }

        if (this.config.provider === 'anthropic') {
            return this.sendAnthropicMessage(userMessage, systemPrompt, model);
        } else {
            return this.sendOpenAIMessage(userMessage, systemPrompt, model);
        }
    }

    private async sendMessageWithImage(
        userMessage: string,
        base64Image: string,
        systemPrompt: string,
        model: TLLMModel
    ): Promise<string> {
        if (!this.config) {
            throw new Error('LLM not configured');
        }

        if (this.config.provider === 'anthropic') {
            return this.sendAnthropicMessageWithImage(userMessage, base64Image, systemPrompt, model);
        } else {
            return this.sendOpenAIMessageWithImage(userMessage, base64Image, systemPrompt, model);
        }
    }

    private async sendAnthropicMessage(
        userMessage: string,
        systemPrompt: string,
        model: TLLMModel
    ): Promise<string> {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config!.apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model,
                max_tokens: 1024,
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }] as TAnthropicMessage[],
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Anthropic API error: ${response.status} - ${error}`);
        }

        const data = (await response.json()) as TAnthropicResponse;
        return data.content[0]?.text || '';
    }

    private async sendAnthropicMessageWithImage(
        userMessage: string,
        base64Image: string,
        systemPrompt: string,
        model: TLLMModel
    ): Promise<string> {
        // Remove data URL prefix if present
        const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

        const content: TAnthropicContentBlock[] = [
            {
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: 'image/png',
                    data: imageData,
                },
            },
            {
                type: 'text',
                text: userMessage,
            },
        ];

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config!.apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model,
                max_tokens: 1024,
                system: systemPrompt,
                messages: [{ role: 'user', content }] as TAnthropicMessage[],
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Anthropic API error: ${response.status} - ${error}`);
        }

        const data = (await response.json()) as TAnthropicResponse;
        return data.content[0]?.text || '';
    }

    private async sendOpenAIMessage(
        userMessage: string,
        systemPrompt: string,
        model: TLLMModel
    ): Promise<string> {
        const openaiModel = this.mapToOpenAIModel(model);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.config!.apiKey}`,
            },
            body: JSON.stringify({
                model: openaiModel,
                max_tokens: 1024,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage },
                ] as TOpenAIMessage[],
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${error}`);
        }

        const data = (await response.json()) as TOpenAIResponse;
        return data.choices[0]?.message?.content || '';
    }

    private async sendOpenAIMessageWithImage(
        userMessage: string,
        base64Image: string,
        systemPrompt: string,
        model: TLLMModel
    ): Promise<string> {
        const openaiModel = this.mapToOpenAIModel(model);

        // Ensure data URL format
        const imageUrl = base64Image.startsWith('data:')
            ? base64Image
            : `data:image/png;base64,${base64Image}`;

        const content: TOpenAIContentBlock[] = [
            { type: 'text', text: userMessage },
            { type: 'image_url', image_url: { url: imageUrl } },
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.config!.apiKey}`,
            },
            body: JSON.stringify({
                model: openaiModel,
                max_tokens: 1024,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content },
                ] as TOpenAIMessage[],
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${error}`);
        }

        const data = (await response.json()) as TOpenAIResponse;
        return data.choices[0]?.message?.content || '';
    }

    private mapToOpenAIModel(model: TLLMModel): string {
        // Map Anthropic models to OpenAI equivalents when using OpenAI provider
        const mapping: Record<TLLMModel, string> = {
            'claude-3-5-haiku-latest': 'gpt-4o-mini',
            'claude-3-5-sonnet-latest': 'gpt-4o',
            'gpt-4o-mini': 'gpt-4o-mini',
            'gpt-4o': 'gpt-4o',
        };
        return mapping[model] || 'gpt-4o-mini';
    }

    private parseFeedbackResponse(
        response: string,
        request: TFeedbackRequest
    ): TFeedbackResponse {
        try {
            // Try to parse as JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    encouragement: parsed.encouragement || 'Great effort!',
                    specificPraise: Array.isArray(parsed.specificPraise)
                        ? parsed.specificPraise
                        : ['Nice work!'],
                    improvementTips: Array.isArray(parsed.improvementTips)
                        ? parsed.improvementTips
                        : [],
                    nextStepHint: parsed.nextStepHint || undefined,
                };
            }
        } catch {
            console.warn('LLMClient: Failed to parse feedback JSON, using fallback');
        }

        // Fallback if parsing fails
        return getFallbackFeedback(
            request.localScore,
            request.exerciseType,
            request.feedbackHints
        );
    }

    private parseHelpResponse(
        response: string,
        exerciseType: TFeedbackRequest['exerciseType'],
        feedbackHints: TFeedbackRequest['feedbackHints']
    ): THelpResponse {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    tips: Array.isArray(parsed.tips) ? parsed.tips : ['Take your time!'],
                    encouragement: parsed.encouragement || "You've got this!",
                    demonstration: parsed.demonstration || feedbackHints.successCriteria,
                };
            }
        } catch {
            console.warn('LLMClient: Failed to parse help JSON, using fallback');
        }

        return getFallbackHelpTips(exerciseType, feedbackHints);
    }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const llmClient = new LLMClient();
