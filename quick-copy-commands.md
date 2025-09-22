# 快速复制命令指南

## 🚀 一键复制所有文件到 GitHub 项目

### 方法一：使用命令行（推荐）

```bash
# 1. 克隆你的 GitHub 仓库
git clone https://github.com/onlymimizi/The-Appreciation-of-Buddhist-Prayer-Beads.git
cd The-Appreciation-of-Buddhist-Prayer-Beads

# 2. 创建开发分支
git checkout -b feature/ai-integration

# 3. 创建 AI 后端目录结构
mkdir -p ai-backend/services ai-backend/utils

# 4. 进入 CodeBuddy 生成的文件目录
cd /path/to/CodeBuddy/20250917141048

# 5. 复制所有 AI 后端文件
cp -r ai-backend/* ../The-Appreciation-of-Buddhist-Prayer-Beads/ai-backend/

# 6. 复制前端更新文件
cp frontend-updates/utils/api.js ../The-Appreciation-of-Buddhist-Prayer-Beads/utils/
cp frontend-updates/pages/index/* ../The-Appreciation-of-Buddhist-Prayer-Beads/pages/index/
cp frontend-updates/pages/result/* ../The-Appreciation-of-Buddhist-Prayer-Beads/pages/result/
cp frontend-updates/app.json ../The-Appreciation-of-Buddhist-Prayer-Beads/

# 7. 复制配置和文档文件
cp .env.example ../The-Appreciation-of-Buddhist-Prayer-Beads/
cp deployment-guide.md ../The-Appreciation-of-Buddhist-Prayer-Beads/
cp README.md ../The-Appreciation-of-Buddhist-Prayer-Beads/README-AI.md

# 8. 返回项目目录并提交
cd ../The-Appreciation-of-Buddhist-Prayer-Beads
git add .
git commit -m "feat: 添加 AI 智能鉴赏功能"
git push origin feature/ai-integration
```

### 方法二：手动复制文件

如果你在 Windows 系统或无法使用命令行，可以手动复制：

#### 1. 下载项目文件
从当前 CodeBuddy 工作目录复制以下文件到你的 GitHub 项目：

**AI 后端文件：**
```
ai-backend/
├── package.json
├── server.js  
├── README.md
├── services/
│   ├── aiService.js
│   ├── openaiService.js
│   └── geminiService.js
└── utils/
    └── helpers.js
```

**前端更新文件：**
```
frontend-updates/
├── utils/
│   └── api.js
├── pages/
│   ├── index/
│   │   ├── index.js
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── result/
│       ├── result.js
│       ├── result.wxml
│       └── result.wxss
└── app.json
```

**配置文件：**
```
.env.example
deployment-guide.md
README.md (重命名为 README-AI.md)
```

#### 2. 文件放置位置

将文件复制到 GitHub 项目的对应位置：

```
The-Appreciation-of-Buddhist-Prayer-Beads/
├── ai-backend/                    # 新建文件夹，复制所有 AI 后端文件
├── utils/
│   └── api.js                     # 替换原文件
├── pages/
│   ├── index/
│   │   ├── index.js              # 替换原文件
│   │   ├── index.wxml            # 替换原文件
│   │   └── index.wxss            # 替换原文件
│   └── result/
│       ├── result.js             # 替换原文件
│       ├── result.wxml           # 替换原文件
│       └── result.wxss           # 替换原文件
├── .env.example                   # 新增文件
├── deployment-guide.md            # 新增文件
├── README-AI.md                   # 新增文件
└── app.json                       # 替换原文件
```

### 方法三：使用 GitHub Desktop

1. **克隆仓库**
   - 打开 GitHub Desktop
   - 点击 "Clone a repository from the Internet"
   - 输入：`https://github.com/onlymimizi/The-Appreciation-of-Buddhist-Prayer-Beads`

2. **创建分支**
   - 点击 "Current branch" → "New branch"
   - 输入分支名：`feature/ai-integration`

3. **复制文件**
   - 手动将生成的文件复制到克隆的项目目录
   - GitHub Desktop 会自动检测文件变更

4. **提交更改**
   - 在 GitHub Desktop 中查看变更
   - 输入提交信息
   - 点击 "Commit to feature/ai-integration"
   - 点击 "Publish branch"

### 📋 复制完成后的验证步骤

1. **检查文件结构**
```bash
ls -la ai-backend/
ls -la utils/
ls -la pages/index/
ls -la pages/result/
```

2. **安装后端依赖**
```bash
cd ai-backend
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的 API 密钥
```

4. **测试后端服务**
```bash
npm run dev
```

5. **在微信开发者工具中测试小程序**

### 🔧 API 密钥配置

在 `.env` 文件中配置你的 API 密钥：

```env
# 选择使用的 AI 服务
AI_SERVICE=openai

# OpenAI 配置（推荐）
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1

# Google Gemini 配置（免费额度更多）
GEMINI_API_KEY=your-gemini-api-key-here

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 📱 微信小程序配置

1. **修改 API 地址**
   在 `utils/api.js` 中：
   ```javascript
   const API_BASE_URL = 'http://localhost:3000' // 开发环境
   // const API_BASE_URL = 'https://your-domain.com' // 生产环境
   ```

2. **配置服务器域名**
   在微信公众平台配置：
   - request合法域名：`https://your-domain.com`
   - uploadFile合法域名：`https://your-domain.com`

### ✅ 完成检查清单

- [ ] AI 后端文件已复制到 `ai-backend/` 目录
- [ ] 前端文件已更新（utils/api.js, pages/index/*, pages/result/*）
- [ ] 配置文件已添加（.env.example, deployment-guide.md）
- [ ] 小程序配置已更新（app.json）
- [ ] 后端依赖已安装（npm install）
- [ ] 环境变量已配置（.env 文件）
- [ ] API 地址已修改
- [ ] 代码已提交到 GitHub
- [ ] 功能测试通过

完成这些步骤后，你的佛珠鉴赏小程序就成功集成了 AI 智能识别功能！🎉