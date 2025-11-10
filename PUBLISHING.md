# 发布到 Obsidian 社区插件市场

本指南将指导你如何将插件发布到 Obsidian 官方社区插件市场。

## 📋 发布前准备

### 1. 必需文件检查

确保你的仓库包含以下文件：

- [x] `manifest.json` - 插件清单文件
- [x] `main.js` - 编译后的插件主文件
- [x] `styles.css` - 样式文件（可选）
- [x] `README.md` - 详细的使用文档
- [x] `LICENSE` - 开源许可证
- [x] `versions.json` - 版本历史记录

### 2. 完善插件信息

#### 更新 manifest.json

确保以下字段正确填写：

```json
{
  "id": "obsidian-claude-integration",
  "name": "Claude Integration",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "Bidirectional integration with Claude AI",
  "author": "Your Name",
  "authorUrl": "https://github.com/yourusername",
  "fundingUrl": "https://buymeacoffee.com/yourusername",
  "isDesktopOnly": true
}
```

#### 完善 README.md

README 应包含：
- 清晰的功能介绍
- 详细的安装说明
- 使用示例和截图
- 配置说明
- 常见问题解答
- 支持和反馈方式

### 3. 代码质量检查

- [ ] 代码已经过测试
- [ ] 没有控制台错误
- [ ] 遵循 Obsidian 插件最佳实践
- [ ] 处理了错误情况
- [ ] 添加了合适的用户提示

## 🚀 发布流程

### 第一步：准备 GitHub 仓库

1. **创建公开的 GitHub 仓库**
   ```bash
   # 如果还没有创建仓库
   gh repo create obsidian-claude-integration --public --source=. --remote=origin
   ```

2. **确保仓库结构正确**
   ```
   obsidian-claude-integration/
   ├── .github/
   │   └── workflows/
   │       └── release.yml
   ├── main.js
   ├── manifest.json
   ├── styles.css
   ├── versions.json
   └── README.md
   ```

3. **构建插件**
   ```bash
   npm install
   npm run build
   ```

4. **提交所有更改**
   ```bash
   git add .
   git commit -m "chore: prepare for first release"
   git push origin main
   ```

### 第二步：创建 GitHub Release

1. **创建 Git Tag**
   ```bash
   git tag -a 1.0.0 -m "Release version 1.0.0"
   git push origin 1.0.0
   ```

2. **创建 GitHub Release**

   方式一：使用 GitHub CLI
   ```bash
   gh release create 1.0.0 \
     --title "v1.0.0 - Initial Release" \
     --notes "Initial release with Claude integration features" \
     main.js manifest.json styles.css
   ```

   方式二：使用 GitHub 网页
   - 访问仓库的 Releases 页面
   - 点击 "Create a new release"
   - 选择 tag: 1.0.0
   - 填写 Release title 和描述
   - 上传文件：`main.js`, `manifest.json`, `styles.css`
   - 点击 "Publish release"

### 第三步：提交到 Obsidian 插件市场

1. **Fork Obsidian Releases 仓库**
   - 访问 https://github.com/obsidianmd/obsidian-releases
   - 点击右上角的 "Fork" 按钮

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/obsidian-releases.git
   cd obsidian-releases
   ```

3. **添加你的插件信息**

   编辑 `community-plugins.json` 文件，添加你的插件信息：
   ```json
   {
     "id": "obsidian-claude-integration",
     "name": "Claude Integration",
     "author": "Your Name",
     "description": "Bidirectional integration with Claude AI - call Claude API from Obsidian and expose notes as MCP Server for Claude Desktop",
     "repo": "yourusername/obsidian-claude-integration"
   }
   ```

4. **创建 Pull Request**
   ```bash
   git checkout -b add-claude-integration
   git add community-plugins.json
   git commit -m "Add Claude Integration plugin"
   git push origin add-claude-integration
   ```

5. **提交 PR 到官方仓库**
   - 访问你的 fork 仓库
   - 点击 "Contribute" -> "Open pull request"
   - 填写 PR 标题：`Add Claude Integration plugin`
   - 填写 PR 描述，说明插件功能
   - 提交 PR

### 第四步：等待审核

Obsidian 团队会审核你的 PR：

- **审核时间**：通常 1-2 周
- **审核内容**：
  - 代码质量和安全性
  - 插件功能描述准确性
  - 文档完整性
  - 与其他插件无冲突

- **可能的反馈**：
  - 要求修改代码
  - 完善文档
  - 修复 bug
  - 更新描述

## 🔄 后续更新流程

### 发布新版本

1. **更新版本号**
   ```bash
   npm version patch  # 或 minor, major
   ```

2. **构建并提交**
   ```bash
   npm run build
   git add .
   git commit -m "chore: release v1.0.1"
   git push
   ```

3. **创建新的 Release**
   ```bash
   git tag -a 1.0.1 -m "Release version 1.0.1"
   git push origin 1.0.1

   gh release create 1.0.1 \
     --title "v1.0.1 - Bug fixes" \
     --notes "- Fix issue #1
              - Improve error handling" \
     main.js manifest.json styles.css
   ```

4. **自动更新**
   - 用户会在 Obsidian 中自动收到更新提示
   - 无需再次提交 PR 到 obsidian-releases

## ⚙️ 自动化发布（推荐）

使用 GitHub Actions 自动化发布流程：

1. **设置好 `.github/workflows/release.yml`**（已包含在项目中）

2. **发布新版本只需**：
   ```bash
   npm version patch
   git push --follow-tags
   ```

3. **GitHub Actions 会自动**：
   - 运行测试
   - 构建插件
   - 创建 GitHub Release
   - 上传发布文件

## 📝 发布检查清单

在提交到社区之前，确保完成以下检查：

### 代码质量
- [ ] 代码通过构建，无错误
- [ ] 在 Obsidian 中测试所有功能
- [ ] 处理了所有已知的 bug
- [ ] 添加了错误处理
- [ ] 没有控制台警告或错误

### 文档
- [ ] README 包含清晰的功能介绍
- [ ] 有详细的安装和使用说明
- [ ] 包含配置示例
- [ ] 有截图或 GIF 演示
- [ ] 列出了所有依赖和要求

### 仓库设置
- [ ] 仓库是公开的
- [ ] 有合适的开源许可证
- [ ] manifest.json 信息完整
- [ ] 已创建至少一个 Release
- [ ] Release 包含 main.js, manifest.json, styles.css

### 社区规范
- [ ] 插件 ID 是唯一的
- [ ] 插件名称清晰易懂
- [ ] 描述准确且简洁
- [ ] 遵循 Obsidian 插件指南
- [ ] 不侵犯其他插件的功能

## 🔒 安全注意事项

1. **不要在代码中硬编码 API Key**
2. **验证所有用户输入**
3. **使用安全的 API 调用方式**
4. **明确说明需要的权限**
5. **处理敏感数据时提醒用户**

## 📞 获取帮助

- **Obsidian 论坛**：https://forum.obsidian.md/
- **Obsidian Discord**：https://discord.gg/obsidianmd
- **插件开发文档**：https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin
- **示例插件**：https://github.com/obsidianmd/obsidian-sample-plugin

## 🎯 发布后

### 维护插件

- 及时响应用户反馈
- 修复报告的 bug
- 定期更新依赖
- 添加用户请求的功能
- 保持文档更新

### 推广插件

- 在 Obsidian 论坛发帖介绍
- 在 Reddit r/ObsidianMD 分享
- 写一篇发布博客
- 制作视频教程
- 收集用户反馈

## 📊 版本管理建议

遵循语义化版本（Semantic Versioning）：

- **主版本号（Major）**：不兼容的 API 变更
  - 例如：1.0.0 -> 2.0.0
- **次版本号（Minor）**：向下兼容的功能新增
  - 例如：1.0.0 -> 1.1.0
- **修订号（Patch）**：向下兼容的问题修正
  - 例如：1.0.0 -> 1.0.1

## 常见问题

### Q: 我的 PR 被拒绝了怎么办？
A: 仔细阅读审核意见，按要求修改后重新提交。

### Q: 插件审核需要多长时间？
A: 通常 1-2 周，繁忙时可能更长。

### Q: 我可以更新已发布的插件吗？
A: 可以，只需创建新的 GitHub Release，用户会自动收到更新。

### Q: 插件必须开源吗？
A: 是的，所有社区插件必须是开源的。

### Q: 我可以收费吗？
A: 插件本身必须免费，但可以接受捐赠或提供付费服务。
