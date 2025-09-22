# GitHub 项目更新指南

## 将 AI 功能更新到 GitHub 仓库

### 📋 准备工作

1. **克隆你的 GitHub 仓库**
```bash
git clone https://github.com/onlymimizi/The-Appreciation-of-Buddhist-Prayer-Beads.git
cd The-Appreciation-of-Buddhist-Prayer-Beads
```

2. **创建新分支进行开发**
```bash
git checkout -b feature/ai-integration
```

### 📁 文件更新清单

#### 1. 添加 AI 后端服务
在项目根目录创建 `ai-backend/` 文件夹，并添加以下文件：

```bash
mkdir ai-backend
mkdir ai-backend/services
mkdir ai-backend/utils

# 复制后端文件
cp /path/to/ai-backend/package.json ai-backend/
cp /path/to/ai-backend/server.js ai-backend/
cp /path/to/ai-backend/README.md ai-backend/
cp /path/to/ai-backend/services/* ai-backend/services/
cp /path/to/ai-backend/utils/* ai-backend/utils/
```

#### 2. 更新前端文件
```bash
# 更新 API 调用文件
cp /path/to/frontend-updates/utils/api.js utils/

# 更新首页文件
cp /path/to/frontend-updates/pages/index/index.js pages/index/
cp /path/to/frontend-updates/pages/index/index.wxml pages/index/
cp /path/to/frontend-updates/pages/index/index.wxss pages/index/

# 更新结果页文件
cp /path/to/frontend-updates/pages/result/result.js pages/result/
cp /path/to/frontend-updates/pages/result/result.wxml pages/result/
cp /path/to/frontend-updates/pages/result/result.wxss pages/result/

# 更新小程序配置
cp /path/to/frontend-updates/app.json .
```

#### 3. 添加配置文件
```bash
# 添加环境变量模板
cp /path/to/.env.example .

# 添加文档
cp /path/to/deployment-guide.md .
cp /path/to/README.md ./README-AI.md  # 保留原 README，新增 AI 说明
```

### 🔧 具体操作步骤

#### 步骤 1: 手动创建文件结构
```bash
# 在你的项目根目录执行
mkdir -p ai-backend/services ai-backend/utils
```

#### 步骤 2: 复制文件内容
由于我无法直接操作你的文件系统，你需要手动复制以下文件的内容：

**ai-backend/package.json**
```json
{
  "name": "fozhu-ai-backend",
  "version": "1.0.0",
  "description": "佛珠鉴赏 AI 后端服务",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "ai",
    "buddhist-beads",
    "openai",
    "gemini",
    "express"
  ],
  "author": "CodeBuddy",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1",
    "axios": "^1.6.0",
    "sharp": "^0.32.6",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "@google/generative-ai": "^0.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

**其他文件内容请参考之前生成的完整代码**

#### 步骤 3: 提交到 GitHub
```bash
# 添加所有新文件
git add .

# 提交更改
git commit -m "feat: 添加 AI 智能鉴赏功能

- 集成 OpenAI GPT-4 Vision 和 Google Gemini Vision API
- 添加专业佛珠材质识别和价值评估
- 实现图片上传和 AI 分析功能
- 添加文化背景和保养建议
- 支持分析历史记录和收藏功能
- 完善的错误处理和降级机制"

# 推送到 GitHub
git push origin feature/ai-integration
```

#### 步骤 4: 创建 Pull Request
1. 访问 https://github.com/onlymimizi/The-Appreciation-of-Buddhist-Prayer-Beads
2. 点击 "Compare & pull request"
3. 填写 PR 描述
4. 合并到主分支

### 📝 更新后的项目结构
```
The-Appreciation-of-Buddhist-Prayer-Beads/
├── ai-backend/                     # 新增：AI 后端服务
│   ├── services/
│   │   ├── aiService.js
│   │   ├── openaiService.js
│   │   └── geminiService.js
│   ├── utils/
│   │   └── helpers.js
│   ├── package.json
│   ├── server.js
│   └── README.md
├── pages/
│   ├── index/                      # 更新：支持 AI 功能
│   │   ├── index.js
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── result/                     # 更新：显示 AI 分析结果
│       ├── result.js
│       ├── result.wxml
│       └── result.wxss
├── utils/
│   └── api.js                      # 更新：AI API 调用
├── .env.example                    # 新增：环境变量模板
├── deployment-guide.md             # 新增：部署指南
├── README-AI.md                    # 新增：AI 功能说明
├── app.json                        # 更新：权限配置
└── ... (其他原有文件)
```

### 🚀 部署和测试

#### 1. 本地测试后端
```bash
cd ai-backend
npm install
cp ../.env.example .env
# 编辑 .env 文件，填入 API 密钥
npm run dev
```

#### 2. 测试小程序
1. 在微信开发者工具中打开项目
2. 修改 `utils/api.js` 中的 API 地址
3. 测试拍照和相册选择功能
4. 验证 AI 分析结果显示

#### 3. 配置微信小程序
在微信公众平台配置：
- request合法域名：你的服务器域名
- uploadFile合法域名：你的服务器域名

### 📋 检查清单

- [ ] 后端服务文件已添加
- [ ] 前端文件已更新
- [ ] 环境变量已配置
- [ ] 依赖包已安装
- [ ] API 地址已修改
- [ ] 微信小程序域名已配置
- [ ] 功能测试通过
- [ ] 代码已提交到 GitHub

### 🔍 常见问题

**Q: 如何获取 OpenAI API 密钥？**
A: 访问 https://platform.openai.com/api-keys 注册并创建 API 密钥

**Q: 如何获取 Gemini API 密钥？**
A: 访问 https://makersuite.google.com/app/apikey 获取免费 API 密钥

**Q: 本地测试时无法连接后端？**
A: 确保后端服务已启动，检查端口号和防火墙设置

**Q: 小程序提示网络错误？**
A: 检查微信公众平台的服务器域名配置

### 📞 技术支持

如果在更新过程中遇到问题：
1. 检查文件路径是否正确
2. 确认所有依赖已安装
3. 验证 API 密钥配置
4. 查看控制台错误信息

完成这些步骤后，你的佛珠鉴赏小程序就具备了完整的 AI 智能识别功能！