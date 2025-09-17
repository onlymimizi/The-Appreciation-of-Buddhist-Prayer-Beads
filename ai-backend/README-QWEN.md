# Qwen-VL-Plus 集成指南

## 概述

本项目现已支持通义千问 Qwen-VL-Plus 视觉模型，提供国内化的 AI 佛珠鉴赏服务。支持两种接入方式：OpenRouter（推荐）和阿里云 DashScope。

## 🚀 快速开始

### 1. 环境配置

在 `.env` 文件中配置 Qwen 服务：

```env
# 使用 Qwen-VL-Plus
AI_SERVICE=qwen

# Qwen 配置
QWEN_PROVIDER=openrouter  # 或 dashscope
QWEN_API_KEY=your_qwen_api_key_here

# OpenRouter 配置（推荐）
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
OPENROUTER_MODEL=qwen/qwen-vl-plus

# DashScope 配置（阿里云官方）
DASHSCOPE_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL=qwen-vl-plus
```

### 2. 启动服务

```bash
npm run dev
```

### 3. 测试集成

```bash
# 运行 Qwen 集成测试
node scripts/test-qwen.js

# 或使用 npm 脚本
npm run test:qwen
```

## 🔧 接入方式

### 方式一：OpenRouter（推荐）

**优点：**
- 兼容 OpenAI API 格式
- 接入简单，无需额外适配
- 支持多种模型切换
- 国际化服务，稳定性好

**配置：**
```env
AI_SERVICE=qwen
QWEN_PROVIDER=openrouter
QWEN_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=qwen/qwen-vl-plus
```

**获取 API Key：**
1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账号并充值
3. 在 API Keys 页面创建新的密钥
4. 选择 `qwen/qwen-vl-plus` 模型

### 方式二：阿里云 DashScope

**优点：**
- 阿里云官方服务
- 国内访问速度快
- 直接对接通义千问
- 价格相对优惠

**配置：**
```env
AI_SERVICE=qwen
QWEN_PROVIDER=dashscope
QWEN_API_KEY=your_dashscope_api_key
DASHSCOPE_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1
```

**获取 API Key：**
1. 访问 [阿里云 DashScope](https://dashscope.aliyuncs.com/)
2. 开通通义千问服务
3. 在控制台获取 API Key
4. 确保开通了 `qwen-vl-plus` 模型权限

## 🔄 切换 AI 服务

### 切换到 Qwen
```env
AI_SERVICE=qwen
QWEN_PROVIDER=openrouter
QWEN_API_KEY=your_key_here
```

### 回退到 OpenAI
```env
AI_SERVICE=openai
OPENAI_API_KEY=your_openai_key_here
```

### 切换到 Gemini
```env
AI_SERVICE=gemini
GEMINI_API_KEY=your_gemini_key_here
```

## 🧪 测试和验证

### 运行集成测试

```bash
# 完整测试套件
node scripts/test-qwen.js

# 仅测试健康检查
curl http://localhost:3000/health

# 测试 AI 服务状态
curl http://localhost:3000/api/ai/status

# 测试图片分析（需要准备测试图片）
curl -X POST http://localhost:3000/api/analyze-base64 \
  -H "Content-Type: application/json" \
  -d '{"imageData": "data:image/jpeg;base64,..."}'
```

### 测试结果验证

成功的测试应该返回包含以下字段的 JSON：
```json
{
  "success": true,
  "data": {
    "material": "小叶紫檀",
    "craft": "手工打磨",
    "estimate": "¥800 - ¥2000",
    "comment": "详细的鉴赏评价",
    "confidence": 85,
    "features": ["特征1", "特征2"],
    "description": "材质详细描述",
    "culturalBackground": "文化历史背景",
    "careInstructions": "保养建议",
    "aiService": "qwen"
  }
}
```

## 📊 性能对比

| 特性 | OpenAI GPT-4V | Gemini Vision | Qwen-VL-Plus |
|------|---------------|---------------|---------------|
| 中文理解 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 图像识别 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 响应速度 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 成本效益 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 国内访问 | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🔍 故障排除

### 常见问题

**1. API Key 无效**
```
错误: Qwen API密钥未配置
解决: 检查 .env 文件中的 QWEN_API_KEY 配置
```

**2. 模型不支持**
```
错误: 不支持的 Qwen 提供者
解决: 确保 QWEN_PROVIDER 设置为 openrouter 或 dashscope
```

**3. 网络连接问题**
```
错误: 请求超时
解决: 检查网络连接，或尝试切换提供者
```

**4. 图片格式问题**
```
错误: 无效的图片数据格式
解决: 确保图片为 JPG/PNG/WebP 格式，大小小于 5MB
```

### 调试模式

启用详细日志：
```env
NODE_ENV=development
DEBUG=qwen:*
```

### 服务状态检查

```bash
# 检查服务状态
curl http://localhost:3000/api/ai/status

# 预期响应
{
  "success": true,
  "data": {
    "currentService": "qwen",
    "provider": "openrouter",
    "model": "qwen/qwen-vl-plus",
    "baseURL": "https://openrouter.ai/api/v1",
    "configured": true,
    "available": true
  }
}
```

## 📚 相关链接

- [OpenRouter Qwen 模型页面](https://openrouter.ai/models/qwen/qwen-vl-plus)
- [阿里云 DashScope 文档](https://help.aliyun.com/zh/dashscope/)
- [通义千问官方文档](https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-qianwen-vl-plus-api)
- [项目 GitHub 仓库](https://github.com/onlymimizi/The-Appreciation-of-Buddhist-Prayer-Beads)

## 🔐 安全注意事项

1. **API Key 安全**：
   - 不要将 API Key 提交到代码仓库
   - 使用环境变量或密钥管理服务
   - 定期轮换 API Key

2. **访问控制**：
   - 配置适当的 CORS 策略
   - 使用 API 限流防止滥用
   - 监控 API 使用情况

3. **数据隐私**：
   - 图片数据仅用于分析，不会存储
   - 遵循相关数据保护法规
   - 用户数据加密传输

## 📈 监控和日志

### 日志级别
- `INFO`: 正常操作日志
- `WARN`: 警告信息（如 API Key 未配置）
- `ERROR`: 错误信息（如 API 调用失败）
- `DEBUG`: 调试信息（开发模式）

### 监控指标
- API 调用成功率
- 响应时间
- 错误率
- 并发请求数

## 🚀 生产部署

### 环境变量配置
```env
NODE_ENV=production
AI_SERVICE=qwen
QWEN_PROVIDER=openrouter
QWEN_API_KEY=${QWEN_API_KEY}
PORT=3000
```

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

### 健康检查
```bash
# 容器健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1