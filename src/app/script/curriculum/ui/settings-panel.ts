/**
 * Curriculum Settings Panel
 * Configuration UI for API settings, model selection, and progress management
 */

import { BB } from '../../bb/bb';
import { LANG } from '../../language/language';
import { KL } from '../../klecks/kl';
import { apiConfig } from '../api/api-config';
import { llmClient } from '../api/llm-client';
import { progressStore } from '../storage/progress-store';
import { TLLMModel, TLLMProvider } from '../types';

// ============================================================================
// Types
// ============================================================================

export type TSettingsPanelParams = {
    onProgressCleared?: () => void;
};

// ============================================================================
// Settings Panel Class
// ============================================================================

export class SettingsPanel {
    private readonly rootEl: HTMLDivElement;
    private readonly params: TSettingsPanelParams;

    // Form elements
    private providerSelect: ReturnType<typeof KL.Select> | null = null;
    private googleKeyInput: HTMLInputElement | null = null;
    private anthropicKeyInput: HTMLInputElement | null = null;
    private openaiKeyInput: HTMLInputElement | null = null;
    private feedbackModelSelect: ReturnType<typeof KL.Select> | null = null;
    private offlineModeCheckbox: HTMLInputElement | null = null;
    private testResultEl: HTMLElement | null = null;

    constructor(params: TSettingsPanelParams = {}) {
        this.params = params;

        this.rootEl = BB.el({
            css: {
                padding: '16px',
                overflow: 'hidden',
            },
        }) as HTMLDivElement;

        this.render();
    }

    // ----------------------------------- Public API -----------------------------------

    getElement(): HTMLElement {
        return this.rootEl;
    }

    refresh(): void {
        this.render();
    }

    // ----------------------------------- Rendering -----------------------------------

    private render(): void {
        this.rootEl.innerHTML = '';

        // Section: AI Feedback
        this.rootEl.appendChild(this.createSectionHeader('AI Feedback Settings'));

        // Provider selection
        this.rootEl.appendChild(this.createProviderSection());

        // API Key inputs
        this.rootEl.appendChild(this.createApiKeySection());

        // Model selection
        this.rootEl.appendChild(this.createModelSection());

        // Offline mode
        this.rootEl.appendChild(this.createOfflineModeSection());

        // Test connection
        this.rootEl.appendChild(this.createTestSection());

        // Divider
        this.rootEl.appendChild(this.createDivider());

        // Section: Progress
        this.rootEl.appendChild(this.createSectionHeader('Progress Management'));

        // Progress actions
        this.rootEl.appendChild(this.createProgressSection());

        // Update visibility based on current settings
        this.updateVisibility();
    }

    private createSectionHeader(title: string): HTMLElement {
        return BB.el({
            css: {
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '12px',
                marginTop: '8px',
            },
            content: title,
        });
    }

    private createDivider(): HTMLElement {
        return BB.el({
            css: {
                height: '1px',
                backgroundColor: 'var(--kl-color-ui-border, #e0e0e0)',
                margin: '16px 0',
            },
        });
    }

    private createRow(label: string, content: HTMLElement): HTMLElement {
        const row = BB.el({
            css: {
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                gap: '10px',
            },
        });

        const labelEl = BB.el({
            css: {
                fontSize: '13px',
                minWidth: '90px',
                flexShrink: '0',
            },
            content: label,
        });

        const contentWrapper = BB.el({
            css: {
                flex: '1',
                minWidth: '0',
                overflow: 'hidden',
            },
        });
        contentWrapper.appendChild(content);

        row.appendChild(labelEl);
        row.appendChild(contentWrapper);

        return row;
    }

    private createProviderSection(): HTMLElement {
        const currentProvider = apiConfig.getProvider();

        this.providerSelect = new KL.Select({
            optionArr: [
                ['none', 'None (Offline)'],
                ['google', 'Google (Gemini) - FREE'],
                ['anthropic', 'Anthropic (Claude)'],
                ['openai', 'OpenAI (GPT-4)'],
            ],
            initValue: currentProvider,
            onChange: (val) => {
                apiConfig.setProvider(val as TLLMProvider | 'none');
                llmClient.refreshConfig();
                this.updateVisibility();
            },
            name: 'llm-provider',
        });

        return this.createRow(LANG('learn-api-provider') + ':', this.providerSelect.getElement());
    }

    private createApiKeySection(): HTMLElement {
        const container = BB.el({
            css: {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            },
        });

        // Google API Key
        const googleRow = BB.el({
            id: 'google-key-row',
            css: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            },
        });

        const googleLabel = BB.el({
            css: {
                fontSize: '13px',
                minWidth: '90px',
                flexShrink: '0',
            },
            content: 'Google Key:',
        });

        this.googleKeyInput = BB.el({
            tagName: 'input',
            css: {
                flex: '1',
                minWidth: '0',
                maxWidth: '180px',
                padding: '6px 8px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
            },
            custom: {
                type: 'password',
                placeholder: 'AIza...',
                value: apiConfig.getGoogleApiKey() || '',
            },
        }) as HTMLInputElement;

        // Use addEventListener for input changes
        this.googleKeyInput.addEventListener('input', () => {
            apiConfig.setGoogleApiKey(this.googleKeyInput!.value);
            llmClient.refreshConfig();
        });

        // Handle paste manually since global handler blocks it
        this.googleKeyInput.addEventListener('paste', (e: ClipboardEvent) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            const pastedText = e.clipboardData?.getData('text') || '';
            const input = this.googleKeyInput!;
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const currentValue = input.value;
            input.value = currentValue.slice(0, start) + pastedText + currentValue.slice(end);
            input.selectionStart = input.selectionEnd = start + pastedText.length;
            apiConfig.setGoogleApiKey(input.value);
            llmClient.refreshConfig();
            e.preventDefault();
        }, true);

        googleRow.appendChild(googleLabel);
        googleRow.appendChild(this.googleKeyInput);
        container.appendChild(googleRow);

        // Google key info
        const googleInfo = BB.el({
            id: 'google-key-info',
            css: {
                fontSize: '10px',
                opacity: '0.7',
                marginTop: '-4px',
                paddingLeft: '100px',
            },
            content: 'Free key: aistudio.google.com',
        });
        container.appendChild(googleInfo);

        // Anthropic API Key
        const anthropicRow = BB.el({
            id: 'anthropic-key-row',
            css: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            },
        });

        const anthropicLabel = BB.el({
            css: {
                fontSize: '13px',
                minWidth: '90px',
                flexShrink: '0',
            },
            content: 'Anthropic Key:',
        });

        this.anthropicKeyInput = BB.el({
            tagName: 'input',
            css: {
                flex: '1',
                minWidth: '0',
                maxWidth: '180px',
                padding: '6px 8px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
            },
            custom: {
                type: 'password',
                placeholder: 'sk-ant-...',
                value: apiConfig.getAnthropicApiKey() || '',
            },
        }) as HTMLInputElement;

        this.anthropicKeyInput.addEventListener('input', () => {
            apiConfig.setAnthropicApiKey(this.anthropicKeyInput!.value);
            llmClient.refreshConfig();
        });

        this.anthropicKeyInput.addEventListener('paste', (e: ClipboardEvent) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            const pastedText = e.clipboardData?.getData('text') || '';
            const input = this.anthropicKeyInput!;
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const currentValue = input.value;
            input.value = currentValue.slice(0, start) + pastedText + currentValue.slice(end);
            input.selectionStart = input.selectionEnd = start + pastedText.length;
            apiConfig.setAnthropicApiKey(input.value);
            llmClient.refreshConfig();
            e.preventDefault();
        }, true);

        anthropicRow.appendChild(anthropicLabel);
        anthropicRow.appendChild(this.anthropicKeyInput);
        container.appendChild(anthropicRow);

        // OpenAI API Key
        const openaiRow = BB.el({
            id: 'openai-key-row',
            css: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            },
        });

        const openaiLabel = BB.el({
            css: {
                fontSize: '13px',
                minWidth: '90px',
                flexShrink: '0',
            },
            content: 'OpenAI Key:',
        });

        this.openaiKeyInput = BB.el({
            tagName: 'input',
            css: {
                flex: '1',
                minWidth: '0',
                maxWidth: '180px',
                padding: '6px 8px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
            },
            custom: {
                type: 'password',
                placeholder: 'sk-...',
                value: apiConfig.getOpenAIApiKey() || '',
            },
        }) as HTMLInputElement;

        this.openaiKeyInput.addEventListener('input', () => {
            apiConfig.setOpenAIApiKey(this.openaiKeyInput!.value);
            llmClient.refreshConfig();
        });

        this.openaiKeyInput.addEventListener('paste', (e: ClipboardEvent) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            const pastedText = e.clipboardData?.getData('text') || '';
            const input = this.openaiKeyInput!;
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const currentValue = input.value;
            input.value = currentValue.slice(0, start) + pastedText + currentValue.slice(end);
            input.selectionStart = input.selectionEnd = start + pastedText.length;
            apiConfig.setOpenAIApiKey(input.value);
            llmClient.refreshConfig();
            e.preventDefault();
        }, true);

        openaiRow.appendChild(openaiLabel);
        openaiRow.appendChild(this.openaiKeyInput);
        container.appendChild(openaiRow);

        return container;
    }

    private createModelSection(): HTMLElement {
        const container = BB.el({
            id: 'model-section',
            css: {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            },
        });

        // Feedback model
        this.feedbackModelSelect = new KL.Select({
            optionArr: [
                ['gemini-2.0-flash', 'Gemini 2.0 Flash (Fast, FREE)'],
                ['gemini-2.5-flash', 'Gemini 2.5 Flash (FREE)'],
                ['gemini-2.5-pro', 'Gemini 2.5 Pro (Best, FREE)'],
                ['claude-3-5-haiku-latest', 'Claude 3.5 Haiku (Fast)'],
                ['claude-3-5-sonnet-latest', 'Claude 3.5 Sonnet (Better)'],
                ['gpt-4o-mini', 'GPT-4o Mini (Fast)'],
                ['gpt-4o', 'GPT-4o (Better)'],
            ],
            initValue: apiConfig.getFeedbackModel(),
            onChange: (val) => {
                apiConfig.setFeedbackModel(val as TLLMModel);
                llmClient.refreshConfig();
            },
            name: 'feedback-model',
        });

        container.appendChild(this.createRow('Feedback Model:', this.feedbackModelSelect.getElement()));

        // Info about models
        const info = BB.el({
            id: 'model-cost-info',
            css: {
                fontSize: '10px',
                opacity: '0.7',
                marginTop: '-4px',
                paddingLeft: '100px',
            },
            content: 'Gemini: FREE | Others: paid',
        });
        container.appendChild(info);

        return container;
    }

    private createOfflineModeSection(): HTMLElement {
        const row = BB.el({
            css: {
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                gap: '10px',
            },
        });

        this.offlineModeCheckbox = BB.el({
            tagName: 'input',
            custom: {
                type: 'checkbox',
                checked: apiConfig.isOfflineMode(),
            },
            onChange: (e: Event) => {
                const checked = (e.target as HTMLInputElement).checked;
                apiConfig.setOfflineMode(checked);
                llmClient.refreshConfig();
                this.updateVisibility();
            },
        }) as HTMLInputElement;

        const label = BB.el({
            css: {
                fontSize: '13px',
            },
            content: 'Offline Mode (use local feedback templates)',
        });

        row.appendChild(this.offlineModeCheckbox);
        row.appendChild(label);

        return row;
    }

    private createTestSection(): HTMLElement {
        const container = BB.el({
            id: 'test-section',
            css: {
                marginBottom: '12px',
            },
        });

        const row = BB.el({
            css: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            },
        });

        const testBtn = BB.el({
            tagName: 'button',
            css: {
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
            },
            content: LANG('learn-test-connection'),
            onClick: async () => {
                if (this.testResultEl) {
                    this.testResultEl.textContent = 'Testing...';
                    this.testResultEl.style.color = 'inherit';
                }

                const result = await llmClient.testConnection();

                if (this.testResultEl) {
                    this.testResultEl.textContent = result.success
                        ? '\u2713 ' + result.message
                        : '\u2717 ' + result.message;
                    this.testResultEl.style.color = result.success
                        ? 'var(--kl-color-success, green)'
                        : 'var(--kl-color-error, red)';
                }
            },
        });

        this.testResultEl = BB.el({
            css: {
                fontSize: '12px',
                marginLeft: '10px',
            },
        });

        row.appendChild(testBtn);
        row.appendChild(this.testResultEl);
        container.appendChild(row);

        return container;
    }

    private createProgressSection(): HTMLElement {
        const container = BB.el({
            css: {
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            },
        });

        // Export progress
        const exportBtn = BB.el({
            tagName: 'button',
            css: {
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
            },
            content: 'Export Progress',
            onClick: async () => {
                try {
                    const json = await progressStore.exportProgress();
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'curriculum-progress.json';
                    a.click();
                    URL.revokeObjectURL(url);
                } catch (e) {
                    alert('No progress to export');
                }
            },
        });
        container.appendChild(exportBtn);

        // Import progress
        const importRow = BB.el({
            css: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            },
        });

        const importBtn = BB.el({
            tagName: 'button',
            css: {
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid var(--kl-color-ui-border, #ccc)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
            },
            content: 'Import Progress',
            onClick: () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = async () => {
                    if (input.files && input.files[0]) {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            try {
                                await progressStore.importProgress(e.target?.result as string);
                                alert('Progress imported successfully');
                                if (this.params.onProgressCleared) {
                                    this.params.onProgressCleared();
                                }
                            } catch (err) {
                                alert('Failed to import progress: ' + err);
                            }
                        };
                        reader.readAsText(input.files[0]);
                    }
                };
                input.click();
            },
        });
        importRow.appendChild(importBtn);
        container.appendChild(importRow);

        // Clear progress
        const clearBtn = BB.el({
            tagName: 'button',
            css: {
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid var(--kl-color-error, #f44336)',
                backgroundColor: 'transparent',
                color: 'var(--kl-color-error, #f44336)',
                cursor: 'pointer',
                fontSize: '12px',
            },
            content: LANG('learn-clear-progress'),
            onClick: async () => {
                if (confirm(LANG('learn-clear-progress-confirm'))) {
                    await progressStore.clearAllProgress();
                    await progressStore.startNewSession('kindergarten');
                    alert('Progress cleared');
                    if (this.params.onProgressCleared) {
                        this.params.onProgressCleared();
                    }
                }
            },
        });
        container.appendChild(clearBtn);

        return container;
    }

    private updateVisibility(): void {
        const provider = apiConfig.getProvider();
        const isOffline = apiConfig.isOfflineMode();

        // Google key row
        const googleRow = this.rootEl.querySelector('#google-key-row') as HTMLElement;
        if (googleRow) {
            googleRow.style.display = provider === 'google' ? 'flex' : 'none';
        }

        // Google key info
        const googleInfo = this.rootEl.querySelector('#google-key-info') as HTMLElement;
        if (googleInfo) {
            googleInfo.style.display = provider === 'google' ? 'block' : 'none';
        }

        // Anthropic key row
        const anthropicRow = this.rootEl.querySelector('#anthropic-key-row') as HTMLElement;
        if (anthropicRow) {
            anthropicRow.style.display = provider === 'anthropic' ? 'flex' : 'none';
        }

        // OpenAI key row
        const openaiRow = this.rootEl.querySelector('#openai-key-row') as HTMLElement;
        if (openaiRow) {
            openaiRow.style.display = provider === 'openai' ? 'flex' : 'none';
        }

        // Model section
        const modelSection = this.rootEl.querySelector('#model-section') as HTMLElement;
        if (modelSection) {
            modelSection.style.display = provider !== 'none' && !isOffline ? 'flex' : 'none';
        }

        // Test section
        const testSection = this.rootEl.querySelector('#test-section') as HTMLElement;
        if (testSection) {
            testSection.style.display = provider !== 'none' && !isOffline ? 'block' : 'none';
        }
    }

    destroy(): void {
        if (this.rootEl.parentNode) {
            this.rootEl.parentNode.removeChild(this.rootEl);
        }
    }
}
