# 快速发布指南

如果你想快速了解如何发布插件到 Obsidian 社区，按照这个简化的步骤操作。

## 🚀 5 步发布流程

### 1️⃣ 准备仓库（5分钟）

```bash
# 更新 manifest.json 中的信息
# - author: 改成你的名字
# - authorUrl: 改成你的 GitHub 地址
# - fundingUrl: 改成你的捐赠链接（可选）

# 安装依赖并构建
npm install
npm run build

# 提交所有更改
git add .
git commit -m "chore: prepare for release"
git push origin main
```

### 2️⃣ 创建 GitHub Release（5分钟）

```bash
# 创建并推送 tag
git tag -a 1.0.0 -m "Release version 1.0.0"
git push origin 1.0.0

# GitHub Actions 会自动创建 Release
# 或者手动创建：
gh release create 1.0.0 \
  --title "v1.0.0 - Initial Release" \
  --notes "Initial release" \
  main.js manifest.json styles.css
```

**检查点**：访问你的 GitHub 仓库，确认 Release 已创建且包含 3 个文件。

### 3️⃣ 提交到 Obsidian 社区（10分钟）

1. **Fork 官方仓库**
   - 访问 https://github.com/obsidianmd/obsidian-releases
   - 点击右上角 Fork 按钮

2. **添加你的插件**
   ```bash
   git clone https://github.com/YOUR_USERNAME/obsidian-releases.git
   cd obsidian-releases
   ```

3. **编辑 community-plugins.json**

   在文件末尾添加（注意逗号）：
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

5. **在 GitHub 上完成 PR**
   - 访问你的 fork 仓库
   - 点击 "Contribute" → "Open pull request"
   - 填写说明并提交

### 4️⃣ 等待审核（1-2周）

Obsidian 团队会审核你的提交。期间他们可能会：
- 要求修改代码
- 要求改进文档
- 询问功能细节

**保持关注 PR 的评论和通知！**

### 5️⃣ 审核通过后

恭喜！你的插件现在在 Obsidian 社区插件市场上了！

用户可以在 Obsidian 的社区插件浏览器中找到并安装你的插件。

## 📝 发布前必查

在提交 PR 前，确保：

- [ ] ✅ 插件在 Obsidian 中测试通过
- [ ] ✅ README 清晰完整，有使用说明
- [ ] ✅ manifest.json 信息正确
- [ ] ✅ GitHub Release 已创建
- [ ] ✅ Release 包含 main.js, manifest.json, styles.css
- [ ] ✅ 没有明显的 bug

## 🔄 更新插件

发布新版本更简单：

```bash
# 修改代码后
npm run build
git add .
git commit -m "feat: add new feature"

# 使用脚本自动更新版本
./scripts/prepare-release.sh patch  # 或 minor/major

# 或手动：
npm version patch
git push --follow-tags
```

**就这样！** 用户会自动收到更新提示。

## 💡 提示

1. **第一次发布前**：仔细测试，确保功能完整
2. **编写好文档**：清晰的文档能减少支持工作
3. **及时响应**：快速回应用户反馈和 issue
4. **保持更新**：定期维护和改进插件

## 📚 详细指南

- 完整发布流程：见 [PUBLISHING.md](./PUBLISHING.md)
- 发布检查清单：见 [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)
- 贡献指南：见 [CONTRIBUTING.md](./CONTRIBUTING.md)

## ❓ 需要帮助？

- 查看 [Obsidian 插件文档](https://docs.obsidian.md/Plugins)
- 访问 [Obsidian 论坛](https://forum.obsidian.md/)
- 加入 [Obsidian Discord](https://discord.gg/obsidianmd)

---

**祝你发布顺利！** 🎉
