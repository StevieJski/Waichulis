/**
 * API Configuration
 * Settings and storage for LLM API keys and model preferences
 */

import { LocalStorage } from '../../bb/base/local-storage';
import { TAPISettings, TLLMModel, TLLMProvider } from '../types';

// ============================================================================
// Storage Keys
// ============================================================================

const LS_API_PROVIDER_KEY = 'klecks-curriculum-api-provider';
const LS_ANTHROPIC_KEY = 'klecks-curriculum-anthropic-key';
const LS_OPENAI_KEY = 'klecks-curriculum-openai-key';
const LS_FEEDBACK_MODEL_KEY = 'klecks-curriculum-feedback-model';
const LS_VISION_MODEL_KEY = 'klecks-curriculum-vision-model';
const LS_OFFLINE_MODE_KEY = 'klecks-curriculum-offline-mode';

// ============================================================================
// Default Settings
// ============================================================================

const DEFAULT_SETTINGS: TAPISettings = {
    provider: 'none',
    feedbackModel: 'claude-3-5-haiku-latest',
    visionModel: 'claude-3-5-sonnet-latest',
    offlineMode: true,
};

// ============================================================================
// Simple Encryption/Decryption for API Keys
// Note: This is basic obfuscation, not secure encryption.
// API keys are inherently visible in browser storage.
// ============================================================================

function obfuscate(text: string): string {
    // Simple base64 encoding with a prefix to make it not immediately readable
    return 'v1:' + btoa(encodeURIComponent(text));
}

function deobfuscate(encoded: string): string {
    if (!encoded.startsWith('v1:')) {
        // Legacy unencoded key
        return encoded;
    }
    try {
        return decodeURIComponent(atob(encoded.slice(3)));
    } catch {
        return '';
    }
}

// ============================================================================
// API Config Class
// ============================================================================

export class APIConfig {
    private settings: TAPISettings;

    constructor() {
        this.settings = this.loadSettings();
    }

    // ----------------------------------- Getters -----------------------------------

    getSettings(): TAPISettings {
        return { ...this.settings };
    }

    getProvider(): TLLMProvider | 'none' {
        return this.settings.provider;
    }

    getAnthropicApiKey(): string | undefined {
        return this.settings.anthropicApiKey;
    }

    getOpenAIApiKey(): string | undefined {
        return this.settings.openaiApiKey;
    }

    getFeedbackModel(): TLLMModel {
        return this.settings.feedbackModel;
    }

    getVisionModel(): TLLMModel {
        return this.settings.visionModel;
    }

    isOfflineMode(): boolean {
        return this.settings.offlineMode;
    }

    /**
     * Check if LLM features are available
     */
    isLLMAvailable(): boolean {
        if (this.settings.offlineMode) return false;
        if (this.settings.provider === 'none') return false;
        if (this.settings.provider === 'anthropic' && !this.settings.anthropicApiKey) return false;
        if (this.settings.provider === 'openai' && !this.settings.openaiApiKey) return false;
        return true;
    }

    /**
     * Get the active API key for the current provider
     */
    getActiveApiKey(): string | undefined {
        if (this.settings.provider === 'anthropic') {
            return this.settings.anthropicApiKey;
        }
        if (this.settings.provider === 'openai') {
            return this.settings.openaiApiKey;
        }
        return undefined;
    }

    // ----------------------------------- Setters -----------------------------------

    setProvider(provider: TLLMProvider | 'none'): void {
        this.settings.provider = provider;
        LocalStorage.setItem(LS_API_PROVIDER_KEY, provider);
    }

    setAnthropicApiKey(key: string): void {
        this.settings.anthropicApiKey = key;
        if (key) {
            LocalStorage.setItem(LS_ANTHROPIC_KEY, obfuscate(key));
        } else {
            LocalStorage.removeItem(LS_ANTHROPIC_KEY);
        }
    }

    setOpenAIApiKey(key: string): void {
        this.settings.openaiApiKey = key;
        if (key) {
            LocalStorage.setItem(LS_OPENAI_KEY, obfuscate(key));
        } else {
            LocalStorage.removeItem(LS_OPENAI_KEY);
        }
    }

    setFeedbackModel(model: TLLMModel): void {
        this.settings.feedbackModel = model;
        LocalStorage.setItem(LS_FEEDBACK_MODEL_KEY, model);
    }

    setVisionModel(model: TLLMModel): void {
        this.settings.visionModel = model;
        LocalStorage.setItem(LS_VISION_MODEL_KEY, model);
    }

    setOfflineMode(offline: boolean): void {
        this.settings.offlineMode = offline;
        LocalStorage.setItem(LS_OFFLINE_MODE_KEY, offline ? 'true' : 'false');
    }

    // ----------------------------------- Validation -----------------------------------

    /**
     * Validate an API key format (basic check)
     */
    validateApiKeyFormat(key: string, provider: TLLMProvider): boolean {
        if (!key || key.trim().length === 0) return false;

        if (provider === 'anthropic') {
            // Anthropic keys start with "sk-ant-"
            return key.startsWith('sk-ant-') && key.length > 20;
        }

        if (provider === 'openai') {
            // OpenAI keys start with "sk-"
            return key.startsWith('sk-') && key.length > 20;
        }

        return false;
    }

    // ----------------------------------- Private -----------------------------------

    private loadSettings(): TAPISettings {
        const provider = LocalStorage.getItem(LS_API_PROVIDER_KEY) as TLLMProvider | 'none' | null;
        const anthropicKey = LocalStorage.getItem(LS_ANTHROPIC_KEY);
        const openaiKey = LocalStorage.getItem(LS_OPENAI_KEY);
        const feedbackModel = LocalStorage.getItem(LS_FEEDBACK_MODEL_KEY) as TLLMModel | null;
        const visionModel = LocalStorage.getItem(LS_VISION_MODEL_KEY) as TLLMModel | null;
        const offlineMode = LocalStorage.getItem(LS_OFFLINE_MODE_KEY);

        return {
            provider: provider || DEFAULT_SETTINGS.provider,
            anthropicApiKey: anthropicKey ? deobfuscate(anthropicKey) : undefined,
            openaiApiKey: openaiKey ? deobfuscate(openaiKey) : undefined,
            feedbackModel: feedbackModel || DEFAULT_SETTINGS.feedbackModel,
            visionModel: visionModel || DEFAULT_SETTINGS.visionModel,
            offlineMode: offlineMode === null ? DEFAULT_SETTINGS.offlineMode : offlineMode === 'true',
        };
    }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const apiConfig = new APIConfig();
