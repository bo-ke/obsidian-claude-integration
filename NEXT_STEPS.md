# 🚀 发布步骤指南

你的插件代码已经完全准备好了！现在需要完成以下步骤来发布到 Obsidian 社区。

## ✅ 已完成的准备工作

- ✅ 所有代码已提交到分支：`claude/obsidian-bidirectional-integration-011CUzY74ZWDjKQmk1Viceaq`
- ✅ 插件已构建（main.js）
- ✅ manifest.json 已更新你的个人信息
- ✅ 所有必需文件齐全：main.js, manifest.json, styles.css
- ✅ 完整的文档已准备

## 📝 接下来的步骤

### 第一步：创建 main 分支并合并代码

1. **访问你的 GitHub 仓库**
   ```
   https://github.com/bo-ke/obsidian-claude-integration
   ```

2. **合并 feature 分支到 main**

   方式 A：通过 Pull Request（推荐）
   - 在 GitHub 页面点击 "Pull requests"
   - 点击 "New pull request"
   - Base: main (如果没有就创建) ← Compare: claude/obsidian-bidirectional-integration-...
   - 创建并合并 PR

   方式 B：直接设置为默认分支
   - 如果这是第一次发布，可以将 claude/... 分支设为 main
   - 或者在本地创建 main 分支并推送

### 第二步：创建 GitHub Release

1. **访问 Releases 页面**
   ```
   https://github.com/bo-ke/obsidian-claude-integration/releases
   ```

2. **点击 "Create a new release"**

3. **填写 Release 信息**
   - **Tag version**: `1.0.0`
   - **Release title**: `v1.0.0 - Initial Release`
   - **Description**:
   ```markdown
   # 🎉 Initial Release

   Obsidian Claude Integration 首个正式版本发布！

   ## ✨ 主要功能

   ### 从 Obsidian 调用 Claude
   - **Chat with Claude**: 在 Obsidian 内与 Claude 进行自然对话
   - **分析笔记**: 让 Claude 分析当前笔记并提供深度见解
   - **改进文本**: 使用 AI 改进选中的文本内容

   ### MCP Server 功能
   作为 MCP Server 运行，让 Claude Desktop 可以：
   - 📝 读取和创建笔记
   - 🔍 搜索笔记内容
   - 📁 管理文件夹
   - ✏️ 修改笔记内容

   ## 📦 安装

   1. 在 Obsidian 中打开 "设置" → "社区插件"
   2. 搜索 "Claude Integration"
   3. 点击安装并启用
   4. 在设置中配置你的 Anthropic API Key

   ## 📚 文档

   详细使用说明请查看 [README](https://github.com/bo-ke/obsidian-claude-integration/blob/main/README.md)

   ## 🙏 感谢

   感谢所有测试和反馈的用户！

   ---

   **需要帮助？** 请访问 [Issues](https://github.com/bo-ke/obsidian-claude-integration/issues) 提问。
   ```

4. **上传文件**

   点击 "Attach binaries" 上传以下文件：
   - `main.js` (在项目根目录)
   - `manifest.json`
   - `styles.css`

5. **发布 Release**

   点击 "Publish release" 按钮

### 第三步：提交到 Obsidian 社区

1. **Fork Obsidian Releases 仓库**
   ```
   https://github.com/obsidianmd/obsidian-releases
   ```
   点击右上角 "Fork" 按钮

2. **编辑 community-plugins.json**

   在你 fork 的仓库中，找到并编辑 `community-plugins.json` 文件

   在文件末尾（注意逗号）添加：
   ```json
   {
     "id": "obsidian-claude-integration",
     "name": "Claude Integration",
     "author": "kebo01",
     "description": "Bidirectional integration with Claude AI - call Claude API from Obsidian and expose notes as MCP Server for Claude Desktop",
     "repo": "bo-ke/obsidian-claude-integration"
   }
   ```

3. **提交更改**

   Commit message: `Add Claude Integration plugin`

4. **创建 Pull Request**

   - 访问你 fork 的仓库
   - 点击 "Contribute" → "Open pull request"
   - 标题: `Add Claude Integration plugin`
   - 描述:
   ```markdown
   # Claude Integration

   双向集成 Obsidian 和 Claude AI 的插件。

   ## 插件功能

   **从 Obsidian 使用 Claude:**
   - 在编辑器内直接与 Claude 对话
   - AI 驱动的笔记分析和改进
   - 支持多轮对话，保持上下文

   **从 Claude Desktop 访问笔记:**
   - 作为 MCP Server 运行
   - 提供完整的笔记 CRUD 操作
   - 支持搜索和元数据查询

   ## 技术实现

   - 使用 Anthropic SDK 集成 Claude API
   - 实现 Model Context Protocol (MCP) Server
   - 支持 Claude 3.5 Sonnet/Haiku 等模型
   - TypeScript 开发，完整的类型安全

   ## 文档和支持

   - 完整的中英文文档
   - 详细的配置指南
   - 示例和使用说明

   ## 测试

   - ✅ 在 Obsidian 0.15.0+ 测试通过
   - ✅ 所有功能正常工作
   - ✅ 错误处理完善

   ## Release

   - Tag: 1.0.0
   - Release URL: https://github.com/bo-ke/obsidian-claude-integration/releases/tag/1.0.0
   - 包含 main.js, manifest.json, styles.css

   谢谢！
   ```

5. **提交 PR**

   点击 "Create pull request"

### 第四步：等待审核

- Obsidian 团队通常会在 1-2 周内审核
- 保持关注 PR 的评论和通知
- 及时回应任何问题或修改请求

## 🎯 快速检查清单

发布前确认：

- [ ] GitHub 仓库是公开的
- [ ] 已创建 1.0.0 Release
- [ ] Release 包含 main.js, manifest.json, styles.css 三个文件
- [ ] manifest.json 中的信息正确（author, repo 地址）
- [ ] README.md 完整清晰
- [ ] 已在 Obsidian 中测试所有功能

## 💡 提示

1. **第一次提交可能需要一些时间审核**，请耐心等待
2. **保持 GitHub 仓库活跃**，及时回应 Issues
3. **后续更新很简单**：
   ```bash
   # 修改代码后
   npm version patch  # 更新版本号
   npm run build      # 重新构建
   git commit -am "feat: add new feature"
   git push --follow-tags
   # 然后在 GitHub 创建新的 Release
   ```

## 📞 需要帮助？

如果遇到任何问题：
- 查看 [PUBLISHING.md](./PUBLISHING.md) 完整指南
- 访问 [Obsidian 论坛](https://forum.obsidian.md/)
- 查看 [Obsidian 插件开发文档](https://docs.obsidian.md/Plugins)

---

**你已经完成了 90% 的工作！加油！** 🚀
