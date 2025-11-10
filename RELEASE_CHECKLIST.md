# 发布检查清单

在发布插件到 Obsidian 社区之前，请完成以下所有检查项。

## 📦 发布前检查（首次发布）

### 1. 代码和构建
- [ ] 代码已完成所有计划功能
- [ ] 运行 `npm install` 安装所有依赖
- [ ] 运行 `npm run build` 成功构建
- [ ] `main.js` 文件已生成
- [ ] 没有 TypeScript 编译错误
- [ ] 没有 ESLint 警告（如果使用）

### 2. 在 Obsidian 中测试
- [ ] 在 Obsidian 测试库中安装插件
- [ ] 测试所有功能正常工作
- [ ] 测试 Chat with Claude 功能
- [ ] 测试 Analyze note 功能
- [ ] 测试 Improve text 功能
- [ ] 验证 API Key 配置流程
- [ ] 验证所有设置项都能正确保存
- [ ] 检查没有控制台错误
- [ ] 测试错误处理（网络错误、API 错误等）
- [ ] 在 Windows/Mac/Linux 上测试（如果可能）

### 3. 文件完整性
- [ ] `manifest.json` 包含所有必需字段
  - [ ] id（唯一且正确）
  - [ ] name（清晰易懂）
  - [ ] version（遵循语义化版本）
  - [ ] minAppVersion（正确的最低版本）
  - [ ] description（准确描述功能）
  - [ ] author（你的名字）
  - [ ] authorUrl（你的 GitHub 地址）
  - [ ] fundingUrl（可选，捐赠链接）
- [ ] `versions.json` 已更新
- [ ] `README.md` 完整且清晰
  - [ ] 功能介绍
  - [ ] 安装说明
  - [ ] 使用教程
  - [ ] 配置说明
  - [ ] 截图或 GIF
  - [ ] API Key 获取说明
  - [ ] 常见问题
- [ ] `LICENSE` 文件存在（MIT 或其他开源许可）
- [ ] `.gitignore` 正确配置

### 4. 文档和说明
- [ ] README 中有清晰的功能截图或 GIF
- [ ] 有详细的 API Key 配置说明
- [ ] 列出了所有依赖和前置要求
- [ ] 包含使用示例
- [ ] 说明了 MCP Server 的配置方法
- [ ] 添加了安全提示（API Key 不要泄露等）
- [ ] 有故障排除指南
- [ ] 链接到相关资源（Anthropic API 文档等）

### 5. GitHub 仓库设置
- [ ] 仓库是公开的
- [ ] 仓库名称合适（建议：obsidian-claude-integration）
- [ ] 添加了仓库描述
- [ ] 添加了相关标签（obsidian, obsidian-plugin, claude, ai）
- [ ] 设置了 `.github/workflows/release.yml`
- [ ] 确保 GitHub Actions 已启用

### 6. 安全和隐私
- [ ] 代码中没有硬编码的 API Key
- [ ] 不会在日志中输出敏感信息
- [ ] API 调用使用了安全的方式
- [ ] 用户数据只存储在本地
- [ ] 已添加适当的错误处理
- [ ] 文档中说明了隐私政策

### 7. 社区规范
- [ ] 插件 ID 是唯一的（不与现有插件冲突）
- [ ] 插件名称不侵犯商标
- [ ] 遵循 Obsidian 插件开发指南
- [ ] 代码质量良好，易于维护
- [ ] 有适当的注释

## 🚀 发布步骤

### 第一步：创建首个 Release
```bash
# 1. 确保所有更改已提交
git add .
git commit -m "chore: prepare for v1.0.0 release"
git push origin main

# 2. 创建 tag
git tag -a 1.0.0 -m "Release version 1.0.0"
git push origin 1.0.0

# 3. GitHub Actions 会自动创建 Release
# 或手动创建：
gh release create 1.0.0 \
  --title "v1.0.0 - Initial Release" \
  --notes "🎉 Initial release of Claude Integration plugin

## Features
- Chat with Claude within Obsidian
- Analyze notes with Claude
- Improve text with AI
- MCP Server for Claude Desktop access

## Installation
See README for detailed instructions." \
  main.js manifest.json styles.css
```

### 第二步：提交到 Obsidian 社区
- [ ] Fork https://github.com/obsidianmd/obsidian-releases
- [ ] 编辑 `community-plugins.json`
- [ ] 添加你的插件信息：
  ```json
  {
    "id": "obsidian-claude-integration",
    "name": "Claude Integration",
    "author": "Your Name",
    "description": "Bidirectional integration with Claude AI - call Claude API from Obsidian and expose notes as MCP Server for Claude Desktop",
    "repo": "yourusername/obsidian-claude-integration"
  }
  ```
- [ ] 创建 Pull Request
- [ ] 在 PR 中描述插件功能
- [ ] 等待审核

## 🔄 更新版本检查清单

每次发布新版本时：

- [ ] 更新 `manifest.json` 中的 version
- [ ] 更新 `versions.json`
- [ ] 更新 `package.json` 中的 version（可选）
- [ ] 在 README 中记录更新内容
- [ ] 测试新功能
- [ ] 运行 `npm run build`
- [ ] 提交更改
- [ ] 创建新的 git tag
- [ ] 推送 tag，触发自动发布

```bash
# 快速更新版本
npm version patch  # 1.0.0 -> 1.0.1
# 或
npm version minor  # 1.0.0 -> 1.1.0
# 或
npm version major  # 1.0.0 -> 2.0.0

# 推送（带 tags）
git push --follow-tags
```

## 📝 Release Notes 模板

```markdown
## 🎉 What's New
- 新功能描述

## 🐛 Bug Fixes
- 修复的 bug 描述

## 🔧 Improvements
- 改进的功能描述

## 📖 Documentation
- 文档更新说明

## ⚠️ Breaking Changes
- 不兼容的更改（如果有）

## 🙏 Thank you
感谢所有贡献者和提供反馈的用户！
```

## ❗ 常见错误

### 构建失败
- 检查 Node.js 版本（需要 v18+）
- 运行 `npm ci` 而不是 `npm install`
- 删除 `node_modules` 和 `package-lock.json` 后重新安装

### Release 没有 main.js
- 确保运行了 `npm run build`
- 检查 `esbuild.config.mjs` 配置
- 确保 `main.js` 没有在 `.gitignore` 中

### PR 被拒绝
常见原因：
- manifest.json 格式错误
- 描述不清晰
- 代码质量问题
- 与现有插件 ID 冲突
- 缺少必要文档

## 📚 相关资源

- [Obsidian 插件开发文档](https://docs.obsidian.md/Plugins)
- [Obsidian Releases 仓库](https://github.com/obsidianmd/obsidian-releases)
- [示例插件](https://github.com/obsidianmd/obsidian-sample-plugin)
- [Obsidian 论坛](https://forum.obsidian.md/)
- [Obsidian Discord](https://discord.gg/obsidianmd)

## ✅ 最终确认

在提交 PR 之前，再次确认：

- [ ] 我已经在 Obsidian 中测试了所有功能
- [ ] 代码没有明显的 bug
- [ ] 文档清晰完整
- [ ] GitHub Release 已创建
- [ ] Release 包含 main.js, manifest.json, styles.css
- [ ] 我理解发布后的维护责任
- [ ] 我准备好回应用户反馈

**准备好了？提交你的 PR 吧！🚀**
