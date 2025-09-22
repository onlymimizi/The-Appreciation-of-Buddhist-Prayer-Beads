# 佛珠鉴赏 Mock API 服务

这是一个为佛珠鉴赏微信小程序提供的模拟API服务，使用Node.js和Express框架构建。

## 功能特性

- 🔍 佛珠图片分析接口
- 📚 佛珠材质信息查询
- 🎯 智能价格估算
- ⚡ 快速响应（1-3秒模拟分析时间）
- 🛡️ 错误处理和日志记录

## 安装和运行

### 1. 安装依赖

```bash
cd mock-api
npm install
```

### 2. 启动服务

```bash
# 生产模式
npm start

# 开发模式（自动重启）
npm run dev
```

服务将在 `http://localhost:3000` 启动

## API 接口

### 1. 佛珠分析接口

**POST** `/analyze`

请求体：
```json
{
  "imageUrl": "图片地址"
}
```

响应：
```json
{
  "material": "小叶紫檀",
  "craft": "手工打磨",
  "estimate": "¥800 - ¥1500",
  "comment": "包浆自然，纹理清晰，工艺较佳",
  "confidence": 85,
  "features": ["密度高", "油性足", "香味淡雅", "纹理细腻"],
  "description": "帝王之木，质地坚硬，纹理细腻",
  "analysisTime": "2024-01-01T12:00:00.000Z"
}
```

### 2. 材质信息接口

**GET** `/materials`

响应：
```json
{
  "success": true,
  "data": [
    {
      "name": "小叶紫檀",
      "priceRange": [800, 3000],
      "features": ["密度高", "油性足", "香味淡雅", "纹理细腻"],
      "description": "帝王之木，质地坚硬，纹理细腻"
    }
  ]
}
```

### 3. 健康检查接口

**GET** `/health`

响应：
```json
{
  "success": true,
  "message": "佛珠鉴赏API服务正常运行",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 小程序配置

在小程序的 `utils/api.js` 文件中，确保 `API_BASE_URL` 设置正确：

```javascript
const API_BASE_URL = 'http://localhost:3000'
```

## 注意事项

1. **开发环境使用**：此Mock API仅用于开发和测试，不适用于生产环境
2. **网络配置**：确保小程序开发工具中已配置本地网络访问权限
3. **端口占用**：如果3000端口被占用，可以修改 `server.js` 中的端口号
4. **跨域处理**：已配置CORS中间件，支持跨域请求

## 扩展功能

可以根据需要扩展以下功能：

- 用户认证和授权
- 数据持久化存储
- 图片上传和处理
- 更复杂的分析算法
- 实时数据统计

## 故障排除

### 常见问题

1. **端口占用错误**
   ```bash
   Error: listen EADDRINUSE: address already in use :::3000
   ```
   解决方案：修改端口号或关闭占用3000端口的程序

2. **小程序无法访问API**
   - 检查小程序开发工具的网络设置
   - 确认API服务正在运行
   - 验证API地址配置是否正确

3. **依赖安装失败**
   ```bash
   npm install --registry https://registry.npmmirror.com
   ```

## 开发日志

- v1.0.0: 初始版本，支持基础的佛珠分析功能
- 支持6种常见佛珠材质的模拟识别
- 智能价格区间估算
- 随机置信度生成