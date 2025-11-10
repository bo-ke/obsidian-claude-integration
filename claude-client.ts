import Anthropic from '@anthropic-ai/sdk';

export interface ClaudeMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ClaudeResponse {
    content: string;
    stopReason: string;
    usage: {
        inputTokens: number;
        outputTokens: number;
    };
}

export class ClaudeClient {
    private client: Anthropic;

    constructor(apiKey: string) {
        this.client = new Anthropic({
            apiKey: apiKey
        });
    }

    /**
     * 发送消息给 Claude
     */
    async sendMessage(
        messages: ClaudeMessage[],
        options?: {
            model?: string;
            maxTokens?: number;
            temperature?: number;
            system?: string;
        }
    ): Promise<ClaudeResponse> {
        const response = await this.client.messages.create({
            model: options?.model || 'claude-3-5-sonnet-20241022',
            max_tokens: options?.maxTokens || 4096,
            temperature: options?.temperature || 1.0,
            system: options?.system,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content
            }))
        });

        const textContent = response.content.find(c => c.type === 'text');

        return {
            content: textContent?.type === 'text' ? textContent.text : '',
            stopReason: response.stop_reason || 'unknown',
            usage: {
                inputTokens: response.usage.input_tokens,
                outputTokens: response.usage.output_tokens
            }
        };
    }

    /**
     * 流式发送消息给 Claude
     */
    async *streamMessage(
        messages: ClaudeMessage[],
        options?: {
            model?: string;
            maxTokens?: number;
            temperature?: number;
            system?: string;
        }
    ): AsyncGenerator<string> {
        const stream = await this.client.messages.create({
            model: options?.model || 'claude-3-5-sonnet-20241022',
            max_tokens: options?.maxTokens || 4096,
            temperature: options?.temperature || 1.0,
            system: options?.system,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content
            })),
            stream: true
        });

        for await (const event of stream) {
            if (event.type === 'content_block_delta' &&
                event.delta.type === 'text_delta') {
                yield event.delta.text;
            }
        }
    }
}
