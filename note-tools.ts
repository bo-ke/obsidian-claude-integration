import { App, TFile, TFolder, normalizePath } from 'obsidian';

export class NoteTools {
    constructor(private app: App) {}

    /**
     * 获取所有笔记列表
     */
    async listNotes(folder?: string): Promise<string[]> {
        const files = this.app.vault.getMarkdownFiles();

        if (folder) {
            const normalizedFolder = normalizePath(folder);
            return files
                .filter(file => file.path.startsWith(normalizedFolder))
                .map(file => file.path);
        }

        return files.map(file => file.path);
    }

    /**
     * 读取笔记内容
     */
    async readNote(path: string): Promise<string> {
        const normalizedPath = normalizePath(path);
        const file = this.app.vault.getAbstractFileByPath(normalizedPath);

        if (!file || !(file instanceof TFile)) {
            throw new Error(`Note not found: ${path}`);
        }

        return await this.app.vault.read(file);
    }

    /**
     * 写入笔记内容
     */
    async writeNote(path: string, content: string): Promise<void> {
        const normalizedPath = normalizePath(path);
        const file = this.app.vault.getAbstractFileByPath(normalizedPath);

        if (file && file instanceof TFile) {
            await this.app.vault.modify(file, content);
        } else {
            await this.app.vault.create(normalizedPath, content);
        }
    }

    /**
     * 在笔记末尾追加内容
     */
    async appendToNote(path: string, content: string): Promise<void> {
        const normalizedPath = normalizePath(path);
        const file = this.app.vault.getAbstractFileByPath(normalizedPath);

        if (!file || !(file instanceof TFile)) {
            throw new Error(`Note not found: ${path}`);
        }

        const currentContent = await this.app.vault.read(file);
        await this.app.vault.modify(file, currentContent + '\n\n' + content);
    }

    /**
     * 删除笔记
     */
    async deleteNote(path: string): Promise<void> {
        const normalizedPath = normalizePath(path);
        const file = this.app.vault.getAbstractFileByPath(normalizedPath);

        if (!file || !(file instanceof TFile)) {
            throw new Error(`Note not found: ${path}`);
        }

        await this.app.vault.delete(file);
    }

    /**
     * 搜索笔记
     */
    async searchNotes(query: string): Promise<Array<{path: string, matches: string[]}>> {
        const files = this.app.vault.getMarkdownFiles();
        const results: Array<{path: string, matches: string[]}> = [];

        for (const file of files) {
            const content = await this.app.vault.read(file);
            const lines = content.split('\n');
            const matches: string[] = [];

            lines.forEach((line, index) => {
                if (line.toLowerCase().includes(query.toLowerCase())) {
                    matches.push(`Line ${index + 1}: ${line}`);
                }
            });

            if (matches.length > 0) {
                results.push({
                    path: file.path,
                    matches
                });
            }
        }

        return results;
    }

    /**
     * 创建文件夹
     */
    async createFolder(path: string): Promise<void> {
        const normalizedPath = normalizePath(path);
        const exists = this.app.vault.getAbstractFileByPath(normalizedPath);

        if (!exists) {
            await this.app.vault.createFolder(normalizedPath);
        }
    }

    /**
     * 获取笔记的元数据
     */
    async getNoteMetadata(path: string): Promise<any> {
        const normalizedPath = normalizePath(path);
        const file = this.app.vault.getAbstractFileByPath(normalizedPath);

        if (!file || !(file instanceof TFile)) {
            throw new Error(`Note not found: ${path}`);
        }

        const cache = this.app.metadataCache.getFileCache(file);
        return {
            path: file.path,
            name: file.basename,
            extension: file.extension,
            size: file.stat.size,
            created: file.stat.ctime,
            modified: file.stat.mtime,
            tags: cache?.tags?.map(t => t.tag) || [],
            links: cache?.links?.map(l => l.link) || [],
            headings: cache?.headings?.map(h => ({
                level: h.level,
                heading: h.heading
            })) || []
        };
    }
}
