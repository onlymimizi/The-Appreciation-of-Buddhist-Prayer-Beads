# 佛珠鉴赏 AI 智能识别系统

基于 OpenAI GPT-4 Vision 和 Google Gemini Vision 的佛珠智能鉴赏微信小程序。

## 🌟 项目特色

- 🤖 **双 AI 引擎**：支持 OpenAI GPT-4 Vision 和 Google Gemini Vision
- 📱 **微信小程序**：原生小程序体验，流畅便捷
- 🔍 **专业鉴赏**：材质识别、工艺评估、价值估算
- 📚 **文化传承**：提供佛珠文化背景和保养建议
- 🛡️ **安全可靠**：完善的错误处理和降级机制

## 🚀 功能特性

### AI 分析功能
- ✅ 佛珠材质识别（小叶紫檀、海南黄花梨、金刚菩提等）
- ✅ 工艺水平评估（手工打磨、传统工艺等）
- ✅ 市场价值估算
- ✅ 专业鉴赏建议
- ✅ 文化历史背景介绍
- ✅ 保养盘玩指导

### 用户体验
- 📸 拍照识别 + 相册选择
- 📊 AI 服务状态实时显示
- 📝 分析历史记录管理
- ❤️ 收藏和分享功能
- 🎯 置信度评估显示

### 技术特性
- 🔄 智能降级：AI 服务不可用时自动切换到离线模式
- 🖼️ 图片优化：自动压缩和格式转换
- 🛡️ 安全防护：API 限流、文件验证、CORS 配置
- ⚡ 高性能：并发处理、缓存机制

## 📦 项目结构

```
佛珠鉴赏-AI项目/
├── ai-backend/                 # AI 后端服务
│   ├── services/              # AI 服务模块
│   │   ├── openaiService.js   # OpenAI GPT-4 Vision
│   │   ├── geminiService.js   # Google Gemini Vision
│   │   └── aiService.js       # 统一 AI 接口
│   ├── utils/                 # 工具函数
│   ├── server.js              # 主服务器
│   └── package.json           # 依赖配置
├── frontend-updates/          # 前端更新文件
│   ├── pages/                 # 页面组件
│   ├── utils/                 # 工具函数
│   └── app.json              # 小程序配置
├── .env.example              # 环境变量模板
└── deployment-guide.md       # 部署指南
```

## 🛠️ 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone <your-repo-url>
cd buddhist-beads-ai

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 API 密钥
```

### 2. 后端部署

```bash
# 安装依赖
cd ai-backend
npm install

# 启动服务
npm run dev  # 开发模式
npm start    # 生产模式
```

### 3. 前端更新

将 `frontend-updates/` 目录下的文件复制到你的微信小程序项目中：

```bash
# 更新 API 调用文件
cp frontend-updates/utils/api.js your-miniprogram/utils/

# 更新页面文件
cp frontend-updates/pages/index/* your-miniprogram/pages/index/
cp frontend-updates/pages/result/* your-miniprogram/pages/result/

# 更新配置文件
cp frontend-updates/app.json your-miniprogram/
```

### 4. 配置说明

#### 环境变量配置 (.env)
```env
# 选择 AI 服务
AI_SERVICE=openai  # 或 gemini

# OpenAI 配置
OPENAI_API_KEY=sk-your-openai-key
OPENAI_BASE_URL=https://api.openai.com/v1

# Gemini 配置
GEMINI_API_KEY=your-gemini-key

# 服务器配置
PORT=3000
NODE_ENV=development
```

#### 微信小程序配置
在微信公众平台配置服务器域名：
- request合法域名：`https://your-domain.com`
- uploadFile合法域名：`https://your-domain.com`

## 🔧 API 接口

### 健康检查
```http
GET /health
```

### 图片分析
```http
POST /api/analyze
Content-Type: multipart/form-data

参数：image (图片文件)
```

### Base64 分析
```http
POST /api/analyze-base64
Content-Type: application/json

{
  "imageData": "data:image/jpeg;base64,..."
}
```

### 响应示例
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

## 🚀 生产部署

### Docker 部署
```bash
# 构建镜像
docker build -t fozhu-ai-backend .

# 运行容器
docker run -d -p 3000:3000 --env-file .env fozhu-ai-backend
```

### PM2 部署
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
cd ai-backend
pm2 start server.js --name "fozhu-ai-backend"
pm2 startup
pm2 save
```

### Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 10M;
    }
}
```

## 📊 功能演示

### 1. 拍照识别
用户可以通过拍照或选择相册图片进行佛珠识别

### 2. AI 分析结果
- **材质识别**：小叶紫檀、海南黄花梨、金刚菩提等
- **工艺评估**：手工打磨、传统工艺、现代工艺等
- **价值估算**：基于材质和工艺的市场价格区间
- **专业建议**：包浆、纹理、密度等专业评价

### 3. 文化传承
- **历史背景**：佛珠的文化历史和宗教意义
- **保养指导**：专业的盘玩和保养建议

## 🛡️ 安全特性

- **API 限流**：防止恶意调用
- **文件验证**：严格的图片格式和大小检查
- **错误处理**：完善的异常处理机制
- **降级策略**：AI 服务不可用时的备用方案

## 📈 性能优化

- **图片压缩**：自动压缩图片减少传输时间
- **缓存机制**：分析结果本地缓存
- **并发处理**：支持多用户同时使用
- **CDN 加速**：静态资源 CDN 分发

## 🔍 故障排除

### 常见问题

1. **API 密钥错误**
   - 检查 `.env` 文件配置
   - 确认 API 密钥有效且有足够配额

2. **图片上传失败**
   - 支持格式：JPG、PNG、WebP
   - 文件大小限制：5MB

3. **AI 分析超时**
   - 检查网络连接
   - 尝试压缩图片大小

### 日志查看
```bash
# PM2 日志
pm2 logs fozhu-ai-backend

# 实时日志
tail -f logs/app.log
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 技术支持

- 📧 邮箱：support@example.com
- 💬 微信：your-wechat-id
- 🐛 问题反馈：[GitHub Issues](https://github.com/your-repo/issues)

## 🙏 致谢

- OpenAI 提供的 GPT-4 Vision API
- Google 提供的 Gemini Vision API
- 微信小程序开发平台
- 所有贡献者和用户的支持

---

**让 AI 技术传承佛珠文化，让传统工艺焕发新的生机！** 🙏✨