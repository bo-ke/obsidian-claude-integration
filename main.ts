import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { ClaudeClient, ClaudeMessage } from './claude-client';
import { NoteTools } from './note-tools';

interface ClaudeIntegrationSettings {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
    mcpServerPort: number;
    enableMCPServer: boolean;
}

const DEFAULT_SETTINGS: ClaudeIntegrationSettings = {
    apiKey: '',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4096,
    temperature: 1.0,
    mcpServerPort: 3000,
    enableMCPServer: true
}

export default class ClaudeIntegrationPlugin extends Plugin {
    settings: ClaudeIntegrationSettings;
    claudeClient: ClaudeClient | null = null;
    noteTools: NoteTools;

    async onload() {
        await this.loadSettings();

        this.noteTools = new NoteTools(this.app);

        // 初始化 Claude 客户端
        if (this.settings.apiKey) {
            this.claudeClient = new ClaudeClient(this.settings.apiKey);
        }

        // 添加命令: 与 Claude 对话
        this.addCommand({
            id: 'chat-with-claude',
            name: 'Chat with Claude',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                new ClaudeChatModal(this.app, this, editor).open();
            }
        });

        // 添加命令: 让 Claude 分析当前笔记
        this.addCommand({
            id: 'analyze-note',
            name: 'Analyze current note with Claude',
            editorCallback: async (editor: Editor, view: MarkdownView) => {
                if (!this.claudeClient) {
                    new Notice('Please configure Claude API key in settings');
                    return;
                }

                const content = editor.getValue();
                if (!content) {
                    new Notice('Note is empty');
                    return;
                }

                new Notice('Analyzing note...');

                try {
                    const response = await this.claudeClient.sendMessage([
                        {
                            role: 'user',
                            content: `Please analyze this note and provide insights:\n\n${content}`
                        }
                    ]);

                    new ClaudeResponseModal(this.app, response.content).open();
                } catch (error) {
                    new Notice(`Error: ${error.message}`);
                }
            }
        });

        // 添加命令: 让 Claude 改进文本
        this.addCommand({
            id: 'improve-text',
            name: 'Improve selected text with Claude',
            editorCallback: async (editor: Editor, view: MarkdownView) => {
                if (!this.claudeClient) {
                    new Notice('Please configure Claude API key in settings');
                    return;
                }

                const selection = editor.getSelection();
                if (!selection) {
                    new Notice('Please select some text');
                    return;
                }

                new Notice('Improving text...');

                try {
                    const response = await this.claudeClient.sendMessage([
                        {
                            role: 'user',
                            content: `Please improve this text while maintaining its meaning:\n\n${selection}`
                        }
                    ]);

                    editor.replaceSelection(response.content);
                    new Notice('Text improved!');
                } catch (error) {
                    new Notice(`Error: ${error.message}`);
                }
            }
        });

        // 添加命令: 启动/停止 MCP Server
        this.addCommand({
            id: 'toggle-mcp-server',
            name: 'Toggle MCP Server',
            callback: () => {
                if (this.settings.enableMCPServer) {
                    new Notice('MCP Server functionality requires running the separate server process. See README for instructions.');
                } else {
                    new Notice('MCP Server is disabled. Enable it in settings.');
                }
            }
        });

        // 添加设置页面
        this.addSettingTab(new ClaudeIntegrationSettingTab(this.app, this));

        console.log('Claude Integration Plugin loaded');
    }

    onunload() {
        console.log('Claude Integration Plugin unloaded');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);

        // 重新初始化 Claude 客户端
        if (this.settings.apiKey) {
            this.claudeClient = new ClaudeClient(this.settings.apiKey);
        }
    }
}

class ClaudeChatModal extends Modal {
    plugin: ClaudeIntegrationPlugin;
    editor: Editor;
    messages: ClaudeMessage[] = [];

    constructor(app: App, plugin: ClaudeIntegrationPlugin, editor: Editor) {
        super(app);
        this.plugin = plugin;
        this.editor = editor;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.empty();
        contentEl.createEl('h2', {text: 'Chat with Claude'});

        // 创建聊天历史显示区域
        const chatHistory = contentEl.createDiv('claude-chat-history');
        chatHistory.style.maxHeight = '300px';
        chatHistory.style.overflowY = 'auto';
        chatHistory.style.marginBottom = '10px';
        chatHistory.style.padding = '10px';
        chatHistory.style.border = '1px solid var(--background-modifier-border)';

        // 创建输入区域
        const inputContainer = contentEl.createDiv();

        const input = inputContainer.createEl('textarea');
        input.placeholder = 'Type your message...';
        input.style.width = '100%';
        input.style.minHeight = '100px';
        input.style.marginBottom = '10px';

        // 创建按钮容器
        const buttonContainer = inputContainer.createDiv();
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const sendButton = buttonContainer.createEl('button', {text: 'Send'});
        const insertButton = buttonContainer.createEl('button', {text: 'Insert to Note'});
        const clearButton = buttonContainer.createEl('button', {text: 'Clear Chat'});

        sendButton.onclick = async () => {
            const message = input.value.trim();
            if (!message) return;

            if (!this.plugin.claudeClient) {
                new Notice('Please configure Claude API key in settings');
                return;
            }

            input.value = '';
            this.messages.push({role: 'user', content: message});

            // 显示用户消息
            const userMsg = chatHistory.createDiv('chat-message user');
            userMsg.createEl('strong', {text: 'You: '});
            userMsg.createSpan({text: message});

            // 显示加载提示
            const loadingMsg = chatHistory.createDiv('chat-message assistant');
            loadingMsg.createEl('strong', {text: 'Claude: '});
            loadingMsg.createSpan({text: 'Thinking...'});

            try {
                const response = await this.plugin.claudeClient.sendMessage(
                    this.messages,
                    {
                        model: this.plugin.settings.model,
                        maxTokens: this.plugin.settings.maxTokens,
                        temperature: this.plugin.settings.temperature
                    }
                );

                this.messages.push({role: 'assistant', content: response.content});

                // 更新显示
                loadingMsg.empty();
                loadingMsg.createEl('strong', {text: 'Claude: '});
                loadingMsg.createSpan({text: response.content});

                // 滚动到底部
                chatHistory.scrollTop = chatHistory.scrollHeight;
            } catch (error) {
                new Notice(`Error: ${error.message}`);
                loadingMsg.remove();
            }
        };

        insertButton.onclick = () => {
            if (this.messages.length === 0) return;

            // 插入最后一条 Claude 的回复
            const lastAssistantMessage = [...this.messages].reverse().find(m => m.role === 'assistant');
            if (lastAssistantMessage) {
                this.editor.replaceSelection(lastAssistantMessage.content);
                new Notice('Inserted to note');
                this.close();
            }
        };

        clearButton.onclick = () => {
            this.messages = [];
            chatHistory.empty();
        };

        // 支持 Ctrl+Enter 发送
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                sendButton.click();
            }
        });
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}

class ClaudeResponseModal extends Modal {
    response: string;

    constructor(app: App, response: string) {
        super(app);
        this.response = response;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.empty();
        contentEl.createEl('h2', {text: 'Claude\'s Response'});

        const responseContainer = contentEl.createDiv();
        responseContainer.style.maxHeight = '400px';
        responseContainer.style.overflowY = 'auto';
        responseContainer.style.padding = '10px';
        responseContainer.style.border = '1px solid var(--background-modifier-border)';
        responseContainer.style.marginBottom = '10px';
        responseContainer.style.whiteSpace = 'pre-wrap';
        responseContainer.textContent = this.response;

        const buttonContainer = contentEl.createDiv();
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const copyButton = buttonContainer.createEl('button', {text: 'Copy'});
        const closeButton = buttonContainer.createEl('button', {text: 'Close'});

        copyButton.onclick = () => {
            navigator.clipboard.writeText(this.response);
            new Notice('Copied to clipboard');
        };

        closeButton.onclick = () => {
            this.close();
        };
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}

class ClaudeIntegrationSettingTab extends PluginSettingTab {
    plugin: ClaudeIntegrationPlugin;

    constructor(app: App, plugin: ClaudeIntegrationPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();
        containerEl.createEl('h2', {text: 'Claude Integration Settings'});

        new Setting(containerEl)
            .setName('Claude API Key')
            .setDesc('Enter your Anthropic API key')
            .addText(text => text
                .setPlaceholder('sk-ant-...')
                .setValue(this.plugin.settings.apiKey)
                .onChange(async (value) => {
                    this.plugin.settings.apiKey = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Model')
            .setDesc('Claude model to use')
            .addDropdown(dropdown => dropdown
                .addOption('claude-3-5-sonnet-20241022', 'Claude 3.5 Sonnet')
                .addOption('claude-3-5-haiku-20241022', 'Claude 3.5 Haiku')
                .addOption('claude-3-opus-20240229', 'Claude 3 Opus')
                .setValue(this.plugin.settings.model)
                .onChange(async (value) => {
                    this.plugin.settings.model = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Max Tokens')
            .setDesc('Maximum tokens in response')
            .addText(text => text
                .setPlaceholder('4096')
                .setValue(String(this.plugin.settings.maxTokens))
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num)) {
                        this.plugin.settings.maxTokens = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName('Temperature')
            .setDesc('Temperature for response generation (0-1)')
            .addText(text => text
                .setPlaceholder('1.0')
                .setValue(String(this.plugin.settings.temperature))
                .onChange(async (value) => {
                    const num = parseFloat(value);
                    if (!isNaN(num) && num >= 0 && num <= 1) {
                        this.plugin.settings.temperature = num;
                        await this.plugin.saveSettings();
                    }
                }));

        containerEl.createEl('h3', {text: 'MCP Server Settings'});

        new Setting(containerEl)
            .setName('Enable MCP Server')
            .setDesc('Allow Claude Desktop to access your notes via MCP')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableMCPServer)
                .onChange(async (value) => {
                    this.plugin.settings.enableMCPServer = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('MCP Server Port')
            .setDesc('Port for MCP server (requires restart)')
            .addText(text => text
                .setPlaceholder('3000')
                .setValue(String(this.plugin.settings.mcpServerPort))
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num)) {
                        this.plugin.settings.mcpServerPort = num;
                        await this.plugin.saveSettings();
                    }
                }));

        containerEl.createEl('p', {
            text: 'Note: To use MCP Server, you need to run the separate server process. See README for instructions.',
            cls: 'setting-item-description'
        });
    }
}
