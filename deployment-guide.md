# 佛珠鉴赏 AI 项目部署指南

## 项目概述

本项目为佛珠鉴赏微信小程序接入 AI 模型的完整解决方案，支持 OpenAI GPT-4 Vision 和 Google Gemini Vision API。

## 项目结构

```
├── .env.example                    # 环境变量配置模板
├── ai-backend/                     # AI 后端服务
│   ├── package.json               # 后端依赖配置
│   ├── server.js                  # 主服务器文件
│   ├── services/                  # AI 服务模块
│   │   ├── aiService.js          # AI 服务统一接口
│   │   ├── openaiService.js      # OpenAI 服务
│   │   └── geminiService.js      # Gemini 服务
│   ├── utils/                     # 工具函数
│   │   └── helpers.js            # 辅助函数
│   └── README.md                 # 后端说明文档
├── frontend-updates/              # 前端更新文件
│   ├── utils/
│   │   └── api.js                # 更新的 API 调用文件
│   ├── pages/
│   │   ├── index/                # 首页更新
│   │   │   ├── index.js
│   │   │   ├── index.wxml
│   │   │   └── index.wxss
│   │   └── result/               # 结果页更新
│   │       ├── result.js
│   │       ├── result.wxml
│   │       └── result.wxss
│   └── app.json                  # 小程序配置更新
└── deployment-guide.md           # 部署指南
```

## 快速开始

### 1. 后端服务部署

#### 安装依赖
```bash
cd ai-backend
npm install
```

#### 配置环境变量
```bash
# 复制环境变量模板
cp ../.env.example .env

# 编辑 .env 文件，填入你的 API 密钥
```

`.env` 文件配置示例：
```env
# 选择 AI 服务: openai 或 gemini
AI_SERVICE=openai

# OpenAI 配置
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1

# Google Gemini 配置  
GEMINI_API_KEY=your-gemini-api-key-here

# 服务器配置
PORT=3000
NODE_ENV=development
```

#### 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 2. 前端小程序更新

#### 更新文件
将 `frontend-updates/` 目录下的文件复制到你的微信小程序项目中：

```bash
# 复制更新的文件到小程序项目
cp frontend-updates/utils/api.js ../fozujiangshang/utils/
cp frontend-updates/pages/index/* ../fozujiangshang/pages/index/
cp frontend-updates/pages/result/* ../fozujiangshang/pages/result/
cp frontend-updates/app.json ../fozujiangshang/
```

#### 配置 API 地址
在 `utils/api.js` 中修改 API 地址：
```javascript
const API_BASE_URL = 'http://localhost:3000' // 开发环境
// const API_BASE_URL = 'https://your-domain.com' // 生产环境
```

### 3. 微信小程序配置

#### 添加服务器域名
在微信公众平台配置以下域名：
- request合法域名：`https://your-domain.com`
- uploadFile合法域名：`https://your-domain.com`

#### 权限配置
确保小程序已配置以下权限：
- 相机权限：`scope.camera`
- 相册权限：`scope.album`
- 保存到相册：`scope.writePhotosAlbum`

## API 接口说明

### 健康检查
```http
GET /health
```

### 图片上传分析
```http
POST /api/analyze
Content-Type: multipart/form-data

参数：
- image: 图片文件
```

### Base64 图片分析
```http
POST /api/analyze-base64
Content-Type: application/json

{
  "imageData": "data:image/jpeg;base64,..."
}
```

### 响应格式
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

## 生产环境部署

### 1. 服务器部署

#### 使用 PM2
```bash
npm install -g pm2
cd ai-backend
pm2 start server.js --name "fozhu-ai-backend"
pm2 startup
pm2 save
```

#### 使用 Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY ai-backend/package*.json ./
RUN npm ci --only=production
COPY ai-backend/ .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t fozhu-ai-backend .
docker run -d -p 3000:3000 --env-file .env fozhu-ai-backend
```

### 2. Nginx 反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 文件上传大小限制
        client_max_body_size 10M;
    }
    
    location /health {
        proxy_pass http://localhost:3000/health;
    }
}
```

### 3. HTTPS 配置
```bash
# 使用 Let's Encrypt 获取免费证书
certbot --nginx -d your-domain.com
```

## 功能特性

### AI 分析功能
- ✅ 支持 OpenAI GPT-4 Vision
- ✅ 支持 Google Gemini Vision
- ✅ 自动降级到离线模式
- ✅ 图片压缩和格式验证
- ✅ 专业的佛珠鉴赏分析

### 前端功能
- ✅ 拍照和相册选择
- ✅ AI 服务状态显示
- ✅ 分析历史记录
- ✅ 结果分享和收藏
- ✅ 响应式设计

### 安全特性
- ✅ API 限流保护
- ✅ 文件类型和大小验证
- ✅ CORS 跨域配置
- ✅ 错误处理和日志记录

## 故障排除

### 常见问题

1. **API 密钥错误**
   - 检查 `.env` 文件中的 API 密钥
   - 确认 API 密钥有足够的配额

2. **图片上传失败**
   - 检查图片格式（支持 JPG、PNG、WebP）
   - 确认图片大小不超过 5MB

3. **AI 分析超时**
   - 检查网络连接
   - 尝试使用更小的图片

4. **小程序权限问题**
   - 在微信公众平台配置服务器域名
   - 确保用户授权了相机和相册权限

### 日志查看
```bash
# PM2 日志
pm2 logs fozhu-ai-backend

# Docker 日志
docker logs container_name

# 实时日志
tail -f /var/log/nginx/access.log
```

## 性能优化

### 后端优化
- 使用图片压缩减少 API 调用成本
- 实现请求缓存机制
- 添加 CDN 加速

### 前端优化
- 图片懒加载
- 分析结果缓存
- 离线模式支持

## 监控和维护

### 监控指标
- API 响应时间
- 错误率统计
- 用户使用量
- AI 服务可用性

### 定期维护
- 清理过期的上传文件
- 更新 AI 模型版本
- 备份用户数据

## 成本控制

### OpenAI 成本优化
- 图片压缩到合适尺寸
- 设置合理的 API 限流
- 监控 API 使用量

### Gemini 成本优化
- 使用免费配额
- 实现智能降级策略

## 技术支持

如有问题，请检查：
1. 环境变量配置是否正确
2. 网络连接是否正常
3. API 密钥是否有效
4. 服务器资源是否充足

## 许可证

MIT License