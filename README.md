# 佛珠鉴赏助手

基于微信小程序 + 云函数 + AI API 的智能佛珠鉴赏应用，帮助用户识别和了解各种佛珠的材质、工艺和文化价值。

## 项目简介

《佛珠鉴赏助手》是一款专业的佛珠识别与鉴赏微信小程序。用户只需上传佛珠图片，即可获得AI驱动的专业鉴赏结果，包括材质分析、工艺评估、文化背景等详细信息。

### 主要功能
- 📸 **智能识别**：上传佛珠图片，AI自动识别材质和特征
- 🔍 **专业鉴赏**：提供详细的材质、工艺、价值分析
- 📚 **佛珠百科**：丰富的佛珠知识库和文化介绍
- 📝 **历史记录**：保存用户的鉴赏历史，方便回顾
- 👥 **社区交流**：用户可以分享和讨论佛珠相关话题

## 技术架构

- **前端**：微信小程序（原生开发）
- **后端**：腾讯云函数（Node.js）
- **AI服务**：第三方AI图像识别API
- **存储**：微信云开发数据库和文件存储

## 目录结构

### 前端代码结构（miniprogram/）
```
miniprogram/
├── pages/                    # 小程序页面
│   ├── index/               # 首页 - 主要功能入口
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── result/              # 鉴赏结果页 - 显示AI分析结果
│   │   ├── result.js
│   │   ├── result.json
│   │   ├── result.wxml
│   │   └── result.wxss
│   ├── analysis-history/    # 历史记录页 - 查看过往鉴赏记录
│   │   ├── analysis-history.js
│   │   ├── analysis-history.json
│   │   ├── analysis-history.wxml
│   │   └── analysis-history.wxss
│   ├── baike/               # 百科页面 - 佛珠知识库
│   │   ├── baike.js
│   │   ├── baike.json
│   │   ├── baike.wxml
│   │   └── baike.wxss
│   ├── mine/                # 个人中心 - 用户信息和设置
│   │   ├── mine.js
│   │   ├── mine.json
│   │   ├── mine.wxml
│   │   └── mine.wxss
│   └── shequ/               # 社区页面 - 用户交流分享
│       ├── shequ.js
│       ├── shequ.json
│       ├── shequ.wxml
│       └── shequ.wxss
├── images/                  # 静态图片资源
│   ├── icons/               # 图标文件
│   ├── backgrounds/         # 背景图片
│   └── samples/             # 示例图片
├── utils/                   # 工具函数
│   ├── util.js              # 通用工具函数
│   ├── api.js               # API调用封装
│   └── constants.js         # 常量定义
├── app.js                   # 小程序入口文件
├── app.json                 # 小程序配置文件
├── app.wxss                 # 全局样式
└── project.config.json      # 项目配置文件
```

### 后端代码结构（cloudfunctions/）
```
cloudfunctions/
└── appraiseBeads/           # 佛珠鉴赏云函数
    ├── index.js             # 云函数主逻辑
    ├── package.json         # 依赖配置
    └── config.json          # 云函数配置（可选）
```

## 部署步骤

### 1. 前端部署（微信开发者工具）

1. **导入项目**
   - 打开微信开发者工具
   - 选择"导入项目"
   - 将 `miniprogram/` 文件夹作为项目根目录导入
   - 填入你的小程序AppID

2. **配置云开发**
   - 在 `app.js` 中初始化云开发环境
   ```javascript
   wx.cloud.init({
     env: 'your-env-id' // 替换为你的云开发环境ID
   })
   ```

3. **上传代码**
   - 点击"上传"按钮，将代码上传到微信小程序后台

### 2. 后端部署（腾讯云函数）

1. **创建云函数**
   - 在微信开发者工具中，右键点击 `cloudfunctions` 文件夹
   - 选择"新建Node.js云函数"
   - 命名为 `appraiseBeads`

2. **上传云函数代码**
   - 将 `cloudfunctions/appraiseBeads/` 中的所有文件复制到新建的云函数目录
   - 右键点击 `appraiseBeads` 文件夹，选择"上传并部署：云端安装依赖"

3. **配置环境变量**
   - 登录微信云开发控制台
   - 进入"云函数" → "环境变量"
   - 添加环境变量：
     ```
     AI_API_KEY = 你的AI服务API密钥
     AI_API_URL = AI服务的API地址
     ```

### 3. 测试验证

1. **功能测试**
   - 在微信开发者工具中预览小程序
   - 测试图片上传功能
   - 验证云函数调用是否正常
   - 检查AI鉴赏结果是否正确返回

2. **真机测试**
   - 使用微信扫码在真机上测试
   - 验证所有功能在真实环境下的表现

## 使用说明

### 用户使用流程
1. **上传图片**：用户在首页点击"拍照"或"从相册选择"上传佛珠图片
2. **图片处理**：前端将图片上传到云存储，获取文件ID
3. **调用云函数**：前端通过 `wx.cloud.callFunction` 调用 `appraiseBeads` 云函数
4. **AI分析**：云函数接收图片文件ID，下载图片并调用第三方AI API进行分析
5. **返回结果**：AI分析完成后，云函数将结果返回给前端
6. **展示结果**：前端跳转到结果页面，展示详细的鉴赏信息

### 核心代码示例

#### 前端调用云函数
```javascript
// pages/index/index.js
uploadAndAnalyze: function(filePath) {
  wx.showLoading({ title: '正在分析...' })
  
  // 上传图片到云存储
  wx.cloud.uploadFile({
    cloudPath: `beads/${Date.now()}.jpg`,
    filePath: filePath,
    success: res => {
      // 调用云函数进行鉴赏
      wx.cloud.callFunction({
        name: 'appraiseBeads',
        data: {
          fileID: res.fileID
        },
        success: result => {
          wx.hideLoading()
          // 跳转到结果页面
          wx.navigateTo({
            url: `/pages/result/result?data=${JSON.stringify(result.result)}`
          })
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({ title: '分析失败', icon: 'none' })
        }
      })
    }
  })
}
```

#### 云函数主逻辑
```javascript
// cloudfunctions/appraiseBeads/index.js
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()

exports.main = async (event, context) => {
  const { fileID } = event
  
  try {
    // 下载图片文件
    const res = await cloud.downloadFile({
      fileID: fileID
    })
    
    // 调用AI API进行鉴赏
    const aiResult = await axios.post(process.env.AI_API_URL, {
      image: res.buffer.toString('base64'),
      // 其他AI API参数
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    // 返回鉴赏结果
    return {
      success: true,
      data: aiResult.data
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
```

## 安全说明

- ✅ **API密钥安全**：所有API密钥存储在云函数环境变量中，前端无法访问
- ✅ **数据传输安全**：使用HTTPS协议进行数据传输
- ✅ **用户隐私保护**：用户上传的图片仅用于AI分析，不会被恶意使用
- ✅ **权限控制**：云函数具有适当的权限控制，防止未授权访问

## 开发环境要求

- Node.js >= 14.0.0
- 微信开发者工具最新版本
- 微信小程序账号（已认证）
- 腾讯云开发环境
- 第三方AI服务API账号

## 常见问题

### Q: 云函数调用失败怎么办？
A: 检查云函数是否正确部署，环境变量是否配置正确，网络连接是否正常。

### Q: AI识别准确率不高怎么办？
A: 建议用户上传清晰、光线充足的佛珠图片，避免模糊或过暗的照片。

### Q: 如何更换AI服务提供商？
A: 修改云函数中的API调用逻辑，更新环境变量中的API_KEY和API_URL即可。

## 版本更新

### v1.0.0 (当前版本)
- 基础的佛珠图片识别功能
- 完整的用户界面和交互流程
- 云函数后端架构
- 基础的百科和社区功能

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。在贡献代码前，请确保：
1. 代码符合项目的编码规范
2. 添加必要的注释和文档
3. 测试功能正常工作

## 许可证

本项目采用 MIT 许可证，详情请查看 LICENSE 文件。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues：[GitHub Issues](https://github.com/your-repo/issues)
- 邮箱：your-email@example.com

---

**注意**：使用本项目前，请确保已获得相应的AI服务API访问权限，并遵守相关服务条款。