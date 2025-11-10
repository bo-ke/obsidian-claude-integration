#!/bin/bash

# 准备发布的脚本
# 使用方法: ./scripts/prepare-release.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

echo "🚀 准备发布新版本..."

# 1. 检查工作目录是否干净
if [[ -n $(git status -s) ]]; then
  echo "❌ 工作目录不干净，请先提交或暂存更改"
  exit 1
fi

# 2. 确保在 main/master 分支
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
  echo "⚠️  警告: 当前不在 main/master 分支"
  read -p "是否继续? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# 3. 拉取最新代码
echo "📥 拉取最新代码..."
git pull

# 4. 安装依赖
echo "📦 安装依赖..."
npm ci

# 5. 构建插件
echo "🔨 构建插件..."
npm run build

# 6. 检查必需文件
echo "✅ 检查必需文件..."
FILES=("main.js" "manifest.json" "styles.css")
for file in "${FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "❌ 缺少文件: $file"
    exit 1
  fi
done

# 7. 更新版本号
echo "📝 更新版本号..."
npm version "$VERSION_TYPE"

# 8. 获取新版本号
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✨ 新版本: v$NEW_VERSION"

# 9. 推送更改和 tag
echo "⬆️  推送更改..."
git push --follow-tags

echo ""
echo "✅ 发布准备完成！"
echo ""
echo "GitHub Actions 将自动创建 Release。"
echo "请访问 GitHub 检查发布状态："
echo "https://github.com/yourusername/obsidian-claude-integration/actions"
echo ""
echo "如果需要手动创建 Release："
echo "gh release create v$NEW_VERSION --title \"v$NEW_VERSION\" --generate-notes main.js manifest.json styles.css"
