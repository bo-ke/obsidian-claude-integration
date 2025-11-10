#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * MCP Server for Obsidian Vault Access
 *
 * This server exposes Obsidian vault operations as MCP tools,
 * allowing Claude Desktop to read and manipulate notes.
 */

// 从环境变量获取 vault 路径
const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || '';

if (!VAULT_PATH) {
    console.error('Error: OBSIDIAN_VAULT_PATH environment variable not set');
    process.exit(1);
}

// 辅助函数: 规范化路径
function normalizePath(filePath: string): string {
    return path.normalize(filePath).replace(/\\/g, '/');
}

// 辅助函数: 获取完整路径
function getFullPath(relativePath: string): string {
    const normalized = normalizePath(relativePath);
    return path.join(VAULT_PATH, normalized);
}

// 辅助函数: 验证路径是否在 vault 内
function isPathInVault(fullPath: string): boolean {
    const normalized = path.normalize(fullPath);
    const vaultNormalized = path.normalize(VAULT_PATH);
    return normalized.startsWith(vaultNormalized);
}

// 辅助函数: 递归获取所有 markdown 文件
async function getAllMarkdownFiles(dir: string, baseDir: string = dir): Promise<string[]> {
    const files: string[] = [];

    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory() && !entry.name.startsWith('.')) {
                const subFiles = await getAllMarkdownFiles(fullPath, baseDir);
                files.push(...subFiles);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                const relativePath = path.relative(baseDir, fullPath);
                files.push(normalizePath(relativePath));
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }

    return files;
}

// 定义可用的工具
const tools: Tool[] = [
    {
        name: 'list_notes',
        description: 'List all markdown notes in the Obsidian vault or in a specific folder',
        inputSchema: {
            type: 'object',
            properties: {
                folder: {
                    type: 'string',
                    description: 'Optional folder path to list notes from (relative to vault root)'
                }
            }
        }
    },
    {
        name: 'read_note',
        description: 'Read the content of a specific note',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the note (relative to vault root, e.g., "folder/note.md")'
                }
            },
            required: ['path']
        }
    },
    {
        name: 'write_note',
        description: 'Create a new note or overwrite an existing one',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path where to create/write the note (relative to vault root)'
                },
                content: {
                    type: 'string',
                    description: 'Content to write to the note'
                }
            },
            required: ['path', 'content']
        }
    },
    {
        name: 'append_to_note',
        description: 'Append content to the end of an existing note',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the note (relative to vault root)'
                },
                content: {
                    type: 'string',
                    description: 'Content to append'
                }
            },
            required: ['path', 'content']
        }
    },
    {
        name: 'search_notes',
        description: 'Search for notes containing specific text',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query'
                }
            },
            required: ['query']
        }
    },
    {
        name: 'delete_note',
        description: 'Delete a note from the vault',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the note to delete (relative to vault root)'
                }
            },
            required: ['path']
        }
    },
    {
        name: 'create_folder',
        description: 'Create a new folder in the vault',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path of the folder to create (relative to vault root)'
                }
            },
            required: ['path']
        }
    },
    {
        name: 'get_note_metadata',
        description: 'Get metadata about a note (size, dates, etc.)',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the note (relative to vault root)'
                }
            },
            required: ['path']
        }
    }
];

// 创建服务器实例
const server = new Server(
    {
        name: 'obsidian-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// 注册工具列表处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});

// 注册工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'list_notes': {
                const folder = args?.folder as string | undefined;
                const searchPath = folder ? getFullPath(folder) : VAULT_PATH;

                if (!isPathInVault(searchPath)) {
                    throw new Error('Path is outside vault');
                }

                const files = await getAllMarkdownFiles(searchPath, VAULT_PATH);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({ files, count: files.length }, null, 2)
                        }
                    ]
                };
            }

            case 'read_note': {
                const notePath = args?.path as string;
                if (!notePath) {
                    throw new Error('Path is required');
                }

                const fullPath = getFullPath(notePath);
                if (!isPathInVault(fullPath)) {
                    throw new Error('Path is outside vault');
                }

                const content = await fs.readFile(fullPath, 'utf-8');

                return {
                    content: [
                        {
                            type: 'text',
                            text: content
                        }
                    ]
                };
            }

            case 'write_note': {
                const notePath = args?.path as string;
                const content = args?.content as string;

                if (!notePath || content === undefined) {
                    throw new Error('Path and content are required');
                }

                const fullPath = getFullPath(notePath);
                if (!isPathInVault(fullPath)) {
                    throw new Error('Path is outside vault');
                }

                // 确保目录存在
                await fs.mkdir(path.dirname(fullPath), { recursive: true });

                // 写入文件
                await fs.writeFile(fullPath, content, 'utf-8');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Successfully wrote to ${notePath}`
                        }
                    ]
                };
            }

            case 'append_to_note': {
                const notePath = args?.path as string;
                const content = args?.content as string;

                if (!notePath || content === undefined) {
                    throw new Error('Path and content are required');
                }

                const fullPath = getFullPath(notePath);
                if (!isPathInVault(fullPath)) {
                    throw new Error('Path is outside vault');
                }

                const currentContent = await fs.readFile(fullPath, 'utf-8');
                const newContent = currentContent + '\n\n' + content;
                await fs.writeFile(fullPath, newContent, 'utf-8');

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Successfully appended to ${notePath}`
                        }
                    ]
                };
            }

            case 'search_notes': {
                const query = args?.query as string;
                if (!query) {
                    throw new Error('Query is required');
                }

                const allFiles = await getAllMarkdownFiles(VAULT_PATH, VAULT_PATH);
                const results: Array<{ path: string; matches: string[] }> = [];

                for (const file of allFiles) {
                    const fullPath = getFullPath(file);
                    const content = await fs.readFile(fullPath, 'utf-8');
                    const lines = content.split('\n');
                    const matches: string[] = [];

                    lines.forEach((line, index) => {
                        if (line.toLowerCase().includes(query.toLowerCase())) {
                            matches.push(`Line ${index + 1}: ${line}`);
                        }
                    });

                    if (matches.length > 0) {
                        results.push({ path: file, matches });
                    }
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({ results, count: results.length }, null, 2)
                        }
                    ]
                };
            }

            case 'delete_note': {
                const notePath = args?.path as string;
                if (!notePath) {
                    throw new Error('Path is required');
                }

                const fullPath = getFullPath(notePath);
                if (!isPathInVault(fullPath)) {
                    throw new Error('Path is outside vault');
                }

                await fs.unlink(fullPath);

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Successfully deleted ${notePath}`
                        }
                    ]
                };
            }

            case 'create_folder': {
                const folderPath = args?.path as string;
                if (!folderPath) {
                    throw new Error('Path is required');
                }

                const fullPath = getFullPath(folderPath);
                if (!isPathInVault(fullPath)) {
                    throw new Error('Path is outside vault');
                }

                await fs.mkdir(fullPath, { recursive: true });

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Successfully created folder ${folderPath}`
                        }
                    ]
                };
            }

            case 'get_note_metadata': {
                const notePath = args?.path as string;
                if (!notePath) {
                    throw new Error('Path is required');
                }

                const fullPath = getFullPath(notePath);
                if (!isPathInVault(fullPath)) {
                    throw new Error('Path is outside vault');
                }

                const stats = await fs.stat(fullPath);
                const metadata = {
                    path: notePath,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime,
                    isFile: stats.isFile(),
                    isDirectory: stats.isDirectory()
                };

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(metadata, null, 2)
                        }
                    ]
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${errorMessage}`
                }
            ],
            isError: true
        };
    }
});

// 启动服务器
async function main() {
    console.error(`Obsidian MCP Server starting...`);
    console.error(`Vault path: ${VAULT_PATH}`);

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('Obsidian MCP Server running on stdio');
}

main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
