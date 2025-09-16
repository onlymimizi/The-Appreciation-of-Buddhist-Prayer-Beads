# 部署指南

本文档介绍如何部署佛珠鉴赏微信小程序到生产环境。

## 前置要求

- 微信小程序开发者账号
- 已完成小程序备案和认证
- Node.js 环境（用于Mock API）

## 小程序部署

### 1. 配置小程序信息

在 `app.json` 中配置：
```json
{
  "appid": "你的小程序AppID",
  "projectname": "佛珠鉴赏"
}
```

### 2. 配置服务器域名

在微信公众平台配置以下域名：
- request合法域名：你的API服务器域名
- uploadFile合法域名：图片上传服务器域名
- downloadFile合法域名：图片下载服务器域名

### 3. 上传代码

1. 在微信开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 上传成功后在微信公众平台提交审核

## API服务部署

### 1. 生产环境API

将Mock API部署到云服务器：

```bash
# 安装PM2进程管理器
npm install -g pm2

# 启动API服务
cd mock-api
npm install --production
pm2 start server.js --name "fozhu-api"
```

### 2. 配置反向代理

使用Nginx配置反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. HTTPS配置

为API服务配置SSL证书：

```bash
# 使用Let's Encrypt获取免费证书
certbot --nginx -d your-domain.com
```

## 数据库配置

### 1. 替换本地存储

将本地Storage替换为云数据库：

```javascript
// 使用微信云开发数据库
const db = wx.cloud.database()

// 保存鉴赏记录
db.collection('analysis_history').add({
  data: {
    imageUrl,
    result,
    timestamp: new Date()
  }
})
```

### 2. 云函数部署

创建云函数处理AI鉴赏：

```javascript
// 云函数：analyze
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  // AI鉴赏逻辑
  return {
    material: '小叶紫檀',
    craft: '手工打磨',
    estimate: '¥800 - ¥1500',
    comment: '包浆自然，纹理清晰'
  }
}
```

## 监控和日志

### 1. 错误监控

配置小程序错误监控：

```javascript
// app.js
App({
  onError(error) {
    // 上报错误信息
    wx.request({
      url: 'https://your-api.com/error',
      method: 'POST',
      data: {
        error: error,
        timestamp: new Date()
      }
    })
  }
})
```

### 2. 性能监控

监控小程序性能指标：

```javascript
// 页面性能监控
Page({
  onLoad() {
    const startTime = Date.now()
    
    // 页面加载完成后
    wx.nextTick(() => {
      const loadTime = Date.now() - startTime
      console.log('页面加载时间:', loadTime)
    })
  }
})
```

## 安全配置

### 1. API安全

- 配置API访问频率限制
- 添加请求签名验证
- 使用HTTPS加密传输

### 2. 数据安全

- 敏感数据加密存储
- 用户数据脱敏处理
- 定期备份重要数据

## 版本管理

### 1. 版本发布流程

1. 开发环境测试
2. 预发布环境验证
3. 提交微信审核
4. 发布到线上环境

### 2. 回滚策略

- 保留历史版本代码
- 快速回滚机制
- 数据库版本兼容

## 运维监控

### 1. 服务监控

- API服务可用性监控
- 数据库连接监控
- 服务器资源监控

### 2. 业务监控

- 用户活跃度统计
- 功能使用情况分析
- 错误率和性能指标

通过以上步骤，可以将佛珠鉴赏小程序成功部署到生产环境。