# 佛珠鉴赏 AI 后端服务

基于 OpenAI GPT-4 Vision 和 Google Gemini Vision 的佛珠智能鉴赏后端服务。

## 功能特性

- 🤖 支持 OpenAI GPT-4 Vision 和 Google Gemini Vision
- 📸 图片上传和 Base64 图片分析
- 🔒 安全防护（限流、文件验证、CORS）
- 📊 专业的佛珠鉴赏分析
- 🎯 材质识别、工艺评估、价值估算
- 📚 文化背景和保养建议

## 快速开始

### 1. 安装依赖

```bash
cd ai-backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的 API 密钥：

```bash
cp ../.env.example .env
```

编辑 `.env` 文件：

```env
# 选择 AI 服务: openai 或 gemini
AI_SERVICE=openai

# OpenAI 配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1

# Google Gemini 配置  
GEMINI_API_KEY=your_gemini_api_key_here

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 3. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## API 接口

### 健康检查

```http
GET /health
```

### 图片上传分析

```http
POST /api/analyze
Content-Type: multipart/form-data

{
  "image": "图片文件"
}
```

### Base64 图片分析

```http
POST /api/analyze-base64
Content-Type: application/json

{
  "imageData": "data:image/jpeg;base64,..."
}
```

### 获取材质列表

```http
GET /api/materials
```

## 响应格式

```json
{
  "success": true,
  "data": {
    "material": "小叶紫檀",
    "craft": "手工打磨",
    "estimate": "¥800 - ¥2000",
    "comment": "包浆自然，纹理清晰，工艺较佳",
    "confidence": 85,
    "features": ["密度高", "油性足", "纹理细腻"],
    "description": "帝王之木，质地坚硬，纹理细腻",
    "culturalBackground": "佛珠文化历史背景...",
    "careInstructions": "保养和盘玩建议...",
    "analysisTime": "2024-01-01T00:00:00.000Z",
    "aiService": "openai"
  }
}
```

## 安全特性

- **限流保护**: 防止API滥用
- **文件验证**: 严格的图片格式和大小检查
- **CORS配置**: 跨域请求安全控制
- **错误处理**: 统一的错误响应格式

## 部署说明

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2 部署

```bash
npm install -g pm2
pm2 start server.js --name "fozhu-ai-backend"
```

## 故障排除

### 常见问题

1. **API 密钥错误**
   - 检查 `.env` 文件中的 API 密钥是否正确
   - 确认 API 密钥有足够的配额

2. **图片上传失败**
   - 检查图片格式（支持 JPG、PNG、WebP）
   - 确认图片大小不超过 5MB

3. **AI 分析超时**
   - 检查网络连接
   - 尝试使用更小的图片

### 日志查看

```bash
# PM2 日志
pm2 logs fozhu-ai-backend

# Docker 日志
docker logs container_name
```

## 开发指南

### 添加新的 AI 服务

1. 在 `services/` 目录下创建新的服务文件
2. 实现 `analyzeBeads(imageBuffer)` 方法
3. 在 `aiService.js` 中注册新服务

### 自定义分析逻辑

修改各服务文件中的 prompt 和结果处理逻辑来定制分析行为。

## 许可证

MIT License