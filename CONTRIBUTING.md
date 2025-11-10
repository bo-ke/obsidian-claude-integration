# 贡献指南

感谢你对 Claude Integration 插件的兴趣！我们欢迎各种形式的贡献。

## 如何贡献

### 报告 Bug

如果你发现了 bug，请创建一个 Issue，包含：

1. **清晰的标题**：描述问题
2. **重现步骤**：详细的操作步骤
3. **期望行为**：你期望发生什么
4. **实际行为**：实际发生了什么
5. **环境信息**：
   - Obsidian 版本
   - 插件版本
   - 操作系统
6. **截图或日志**：如果适用

### 提出功能建议

创建 Feature Request Issue，包含：

1. **功能描述**：清楚地描述建议的功能
2. **使用场景**：为什么需要这个功能
3. **可能的实现**：如果有想法的话
4. **替代方案**：其他可能的解决方案

### 提交代码

#### 开发环境设置

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/your-username/obsidian-claude-integration.git
cd obsidian-claude-integration

# 2. 安装依赖
npm install

# 3. 开发模式（自动重新编译）
npm run dev

# 4. 构建
npm run build
```

#### 开发流程

1. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

2. **进行更改**
   - 编写清晰的代码
   - 添加必要的注释
   - 遵循现有代码风格

3. **测试更改**
   - 在 Obsidian 中测试功能
   - 确保没有控制台错误
   - 测试边界情况

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # 或
   git commit -m "fix: resolve issue with..."
   ```

5. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   ```

#### 提交信息规范

使用语义化的提交信息：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 添加测试
- `chore:` 构建/工具更改

示例：
```
feat: add streaming response support
fix: resolve API key validation issue
docs: update installation instructions
```

#### Pull Request 指南

PR 应该：

1. **描述清晰**：说明做了什么改变以及为什么
2. **小而专注**：一个 PR 解决一个问题
3. **通过测试**：确保代码能正常工作
4. **更新文档**：如果添加了新功能
5. **关联 Issue**：如果适用，使用 "Fixes #123"

PR 模板：
```markdown
## 描述
简要描述这个 PR 的目的

## 改变类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 代码重构
- [ ] 其他

## 测试
描述你如何测试了这些更改

## 相关 Issue
Fixes #(issue number)

## 截图（如果适用）
添加截图来帮助解释你的更改
```

### 改进文档

文档改进也是重要的贡献：

- 修正拼写错误
- 改进说明清晰度
- 添加使用示例
- 翻译文档

### 代码风格

- 使用 TypeScript
- 遵循 ESLint 规则（如果配置了）
- 使用有意义的变量名
- 添加必要的注释
- 保持代码简洁清晰

## 开发技巧

### 在 Obsidian 中测试插件

1. 创建一个测试 vault
2. 将插件目录软链接到 vault 的插件文件夹：
   ```bash
   ln -s /path/to/obsidian-claude-integration /path/to/vault/.obsidian/plugins/
   ```
3. 在 Obsidian 中启用插件
4. 修改代码后，禁用并重新启用插件，或重启 Obsidian

### 调试

- 使用 `console.log()` 输出调试信息
- 在 Obsidian 中打开开发者工具：`Ctrl/Cmd + Shift + I`
- 查看 Console 标签页的错误和日志

### 常见任务

```bash
# 监视文件变化，自动重新编译
npm run dev

# 构建生产版本
npm run build

# 更新版本号
npm version patch

# 检查 TypeScript 错误
npx tsc --noEmit
```

## 发布流程

维护者发布新版本的步骤：

1. 更新版本号：`npm version patch/minor/major`
2. 更新 CHANGELOG
3. 提交更改
4. 创建 tag 并推送：`git push --follow-tags`
5. GitHub Actions 自动创建 Release

## 行为准则

请保持：

- **尊重他人**：友善和专业
- **包容性**：欢迎所有背景的贡献者
- **建设性**：提供有帮助的反馈
- **合作精神**：共同改进项目

## 需要帮助？

- 查看 [Issues](../../issues)
- 阅读 [Obsidian 插件文档](https://docs.obsidian.md/Plugins)
- 加入 [Obsidian Discord](https://discord.gg/obsidianmd)

## 许可证

贡献的代码将在与项目相同的许可证（MIT）下发布。

---

再次感谢你的贡献！🎉
