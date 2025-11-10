# Obsidian Claude Integration

双向集成 Obsidian 和 Claude AI 的插件。

## 功能特性

### 🔄 双向集成

1. **从 Obsidian 调用 Claude**
   - 在 Obsidian 内直接与 Claude 对话
   - 让 Claude 分析和改进笔记内容
   - 使用 Claude 增强写作和思考

2. **从 Claude Desktop 访问笔记**
   - 作为 MCP Server 运行
   - Claude Desktop 可以读取、创建、修改笔记
   - 实现 AI 驱动的笔记管理

### ✨ 主要功能

#### Obsidian 插件功能

- **Chat with Claude**: 在 Obsidian 内与 Claude 进行对话
- **分析笔记**: 让 Claude 分析当前笔记并提供见解
- **改进文本**: 使用 Claude 改进选中的文本
- **流式响应**: 支持实时流式获取 Claude 的回复
- **灵活配置**: 可配置模型、温度、最大 token 数等参数

#### MCP Server 功能

为 Claude Desktop 提供以下工具:

- `list_notes`: 列出所有笔记或指定文件夹的笔记
- `read_note`: 读取笔记内容
- `write_note`: 创建或覆写笔记
- `append_to_note`: 向笔记末尾追加内容
- `search_notes`: 搜索包含特定文本的笔记
- `delete_note`: 删除笔记
- `create_folder`: 创建文件夹
- `get_note_metadata`: 获取笔记元数据

## 安装

### 前置要求

- Obsidian v0.15.0 或更高版本
- Node.js v18 或更高版本
- Anthropic API Key ([获取 API Key](https://console.anthropic.com/))

### 安装步骤

1. **克隆或下载此仓库**
   ```bash
   cd /path/to/your/vault/.obsidian/plugins
   git clone https://github.com/yourusername/obsidian-claude-integration.git
   cd obsidian-claude-integration
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建插件**
   ```bash
   npm run build
   ```

4. **在 Obsidian 中启用插件**
   - 打开 Obsidian 设置
   - 进入"社区插件"
   - 关闭"安全模式"
   - 在已安装插件列表中找到"Claude Integration"
   - 启用插件

5. **配置 API Key**
   - 在插件设置中输入你的 Anthropic API Key
   - 配置其他选项(可选)

## 使用方法

### 在 Obsidian 中使用

#### 与 Claude 对话

1. 打开命令面板 (`Ctrl/Cmd + P`)
2. 运行命令 "Chat with Claude"
3. 在弹出的对话框中与 Claude 交流
4. 可以将 Claude 的回复插入到笔记中

#### 分析笔记

1. 打开要分析的笔记
2. 运行命令 "Analyze current note with Claude"
3. Claude 会分析笔记内容并提供见解

#### 改进文本

1. 选中要改进的文本
2. 运行命令 "Improve selected text with Claude"
3. 选中的文本会被 Claude 改进后的版本替换

### 作为 MCP Server 使用

#### 1. 编译 MCP Server

```bash
npm run build
# 或者创建独立的 MCP server 构建
npx tsc mcp-server.ts --outDir dist --module nodenext
```

#### 2. 配置 Claude Desktop

编辑 Claude Desktop 的配置文件:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

添加以下配置:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": [
        "/path/to/your/vault/.obsidian/plugins/obsidian-claude-integration/dist/mcp-server.js"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/your/obsidian/vault"
      }
    }
  }
}
```

将路径替换为你的实际路径:
- `args` 中的路径应该指向编译后的 `mcp-server.js`
- `OBSIDIAN_VAULT_PATH` 应该指向你的 Obsidian vault 根目录

#### 3. 重启 Claude Desktop

重启 Claude Desktop 后,Claude 就可以访问和操作你的笔记了。

#### 4. 在 Claude Desktop 中使用

现在你可以在 Claude Desktop 中这样说:

- "列出我的所有笔记"
- "读取 daily/2024-01-01.md 的内容"
- "在 ideas/new-project.md 中创建一个新的项目想法笔记"
- "搜索包含 'meeting' 的所有笔记"
- "帮我总结这周的所有 daily notes"

## 配置选项

### Obsidian 插件设置

- **Claude API Key**: 你的 Anthropic API 密钥
- **Model**: 使用的 Claude 模型(Sonnet, Haiku, Opus)
- **Max Tokens**: 响应的最大 token 数
- **Temperature**: 生成响应的温度(0-1)
- **Enable MCP Server**: 是否启用 MCP Server 功能
- **MCP Server Port**: MCP Server 端口(需要重启)

## 开发

### 开发模式

```bash
npm run dev
```

这会启动 esbuild 的监视模式,自动重新编译代码。

### 构建生产版本

```bash
npm run build
```

### 项目结构

```
obsidian-claude-integration/
├── main.ts              # Obsidian 插件主文件
├── mcp-server.ts        # MCP Server 实现
├── claude-client.ts     # Claude API 客户端
├── note-tools.ts        # 笔记操作工具类
├── manifest.json        # Obsidian 插件清单
├── package.json         # Node.js 项目配置
├── tsconfig.json        # TypeScript 配置
├── esbuild.config.mjs   # esbuild 配置
└── README.md            # 本文件
```

## 安全注意事项

1. **API Key 安全**: 不要将 API Key 提交到版本控制系统
2. **路径验证**: MCP Server 会验证所有路径,确保不会访问 vault 外的文件
3. **权限控制**: 建议为 MCP Server 使用只读模式(可以通过修改代码实现)

## 故障排除

### Obsidian 插件无法加载

- 确保已运行 `npm install` 和 `npm run build`
- 检查 Obsidian 控制台是否有错误信息(Ctrl/Cmd + Shift + I)
- 确保插件文件夹在正确的位置

### Claude API 调用失败

- 验证 API Key 是否正确
- 检查网络连接
- 确认 API Key 有足够的额度

### MCP Server 无法连接

- 确认 `OBSIDIAN_VAULT_PATH` 环境变量设置正确
- 检查 `mcp-server.js` 文件是否存在并已正确编译
- 查看 Claude Desktop 的日志文件

### Claude Desktop 找不到工具

- 确认 Claude Desktop 配置文件格式正确
- 重启 Claude Desktop
- 检查 Node.js 版本是否符合要求

## 路线图

- [ ] 支持更多 Claude 模型
- [ ] 添加模板功能
- [ ] 实现笔记自动摘要
- [ ] 支持批量操作
- [ ] 添加聊天历史保存
- [ ] 实现更多 MCP 工具
- [ ] 支持图片和附件
- [ ] 添加快捷键配置

## 贡献

欢迎提交 Issue 和 Pull Request!

## 许可证

MIT License

## 相关链接

- [Obsidian API 文档](https://docs.obsidian.md/Home)
- [Anthropic API 文档](https://docs.anthropic.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/download)

## 致谢

- Obsidian 团队提供优秀的笔记应用
- Anthropic 提供强大的 Claude AI
- Model Context Protocol 让 AI 集成更简单
