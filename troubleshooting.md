# AI 后端部署故障排除指南

## 🔧 常见问题解决方案

### 1. npm 依赖安装问题

如果遇到依赖安装失败，请按以下步骤操作：

```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install

# 如果还有问题，尝试使用 yarn
npm install -g yarn
yarn install
```

### 2. Sharp 依赖问题（Windows 常见）

Sharp 是图片处理库，在 Windows 上可能需要特殊处理：

```bash
# 方法1：使用预编译版本
npm install --platform=win32 --arch=x64 sharp

# 方法2：如果上述方法失败，安装替代版本
npm install sharp@0.32.6 --ignore-engines

# 方法3：使用 Python 构建工具
npm install --global windows-build-tools
npm install sharp
```

### 3. Multer 版本警告

看到 multer 版本警告是正常的，不影响功能：

```bash
# 如果想升级到最新版本（可选）
npm install multer@latest
```

### 4. 环境配置

确保正确配置环境变量：

```bash
# 复制环境配置文件
cp .env.example .env

# 编辑 .env 文件，添加你的 API 密钥
# AI_SERVICE=openai
# OPENAI_API_KEY=your_key_here
# 或
# AI_SERVICE=gemini  
# GEMINI_API_KEY=your_key_here
```

### 5. 启动服务

```bash
# 开发模式启动
npm run dev

# 生产模式启动
npm start
```

### 6. 测试 API

服务启动后，可以测试 API：

```bash
# 测试健康检查
curl http://localhost:3001/health

# 测试 AI 服务状态
curl http://localhost:3001/api/ai/status
```

## 🚨 如果所有方法都失败

可以使用简化版本的 package.json：

```json
{
  "name": "fozhu-ai-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.6.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

然后逐步添加其他依赖。

## 📞 获取帮助

如果问题持续存在，请提供：
1. 完整的错误日志
2. Node.js 版本 (`node --version`)
3. npm 版本 (`npm --version`)
4. 操作系统信息