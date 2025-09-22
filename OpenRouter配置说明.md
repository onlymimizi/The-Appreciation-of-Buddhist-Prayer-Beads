# OpenRouter API 配置说明

## 📍 API密钥配置位置

### 1. 获取OpenRouter API密钥
1. 访问 [OpenRouter官网](https://openrouter.ai/)
2. 注册账号并登录
3. 进入 [API Keys页面](https://openrouter.ai/keys)
4. 创建新的API密钥
5. 复制生成的API密钥（格式类似：`sk-or-v1-xxxxxxxxxxxxx`）

### 2. 在微信云开发中配置环境变量

#### 方法一：通过微信开发者工具（推荐）

**第一步：先部署云函数**
1. 打开微信开发者工具
2. 确保已开启云开发（如果没有，点击工具栏"云开发"按钮开启）
3. 右键点击 `miniprogram/cloudfunctions/appraiseBads` 文件夹
4. 选择 **"上传并部署：云端安装依赖"**
5. 等待部署完成（会显示"上传成功"）

**第二步：配置云函数环境变量**
1. 部署成功后，点击工具栏中的 **"云开发"** 按钮
2. 进入云开发控制台
3. 在左侧菜单选择 **"云函数"**
4. 找到并点击 **"appraiseBads"** 云函数
5. 点击 **"版本与配置"** 选项卡
6. 点击 **"配置"** 子选项卡
7. 找到 **"环境变量"** 部分，点击 **"编辑"** 按钮

**第三步：添加环境变量（一个一个添加）**
```
第1个环境变量：
变量名: OPENROUTER_API_KEY
变量值: sk-or-v1-你的实际API密钥

第2个环境变量：
变量名: OPENROUTER_BASE_URL  
变量值: https://openrouter.ai/api/v1/chat/completions

第3个环境变量：
变量名: MODEL_NAME
变量值: qwen/qwen-vl-plus
```

**注意事项：**
- 每次只能添加一个环境变量，需要点击"添加"按钮三次
- 添加完所有变量后，点击"保存"按钮
- 保存后需要等待几分钟让配置生效

#### 方法二：通过微信云开发网页控制台
1. 访问 [微信云开发控制台](https://console.cloud.tencent.com/tcb)
2. 选择您的环境
3. 在左侧菜单选择"云函数"
4. 点击"appraiseBads"云函数
5. 进入"函数配置"选项卡
6. 找到"环境变量"部分，逐个添加上述三个环境变量

## 🔧 完整部署步骤（详细版）

### 步骤1：准备工作
1. 确保微信开发者工具已安装最新版本
2. 确保项目已开启云开发功能
3. 确保已获取OpenRouter API密钥

### 步骤2：部署云函数
1. 在微信开发者工具中打开项目
2. 右键点击 `miniprogram/cloudfunctions/appraiseBads` 文件夹
3. 选择 **"上传并部署：云端安装依赖"**
4. 等待上传完成（通常需要1-2分钟）
5. 看到"上传成功"提示

### 步骤3：配置环境变量（重要！）
1. 点击工具栏 **"云开发"** 按钮
2. 进入云开发控制台
3. 左侧菜单选择 **"云函数"**
4. 点击 **"appraiseBads"** 函数名
5. 点击 **"版本与配置"** 选项卡
6. 点击 **"配置"** 子选项卡
7. 找到 **"环境变量"** 区域，点击 **"编辑"**
8. 逐个添加三个环境变量：
   - 点击"添加"→ 输入变量名和值 → 点击"确定"
   - 重复3次添加所有变量
9. 点击 **"保存"** 按钮
10. 等待配置生效（约2-3分钟）

### 步骤4：验证部署
1. 在云函数列表中确认 `appraiseBads` 状态为"正常"
2. 点击函数名进入详情页
3. 查看"调用日志"确认无错误
4. 在"监控信息"中可以看到函数基本信息

### 步骤5：测试功能
在微信开发者工具的控制台中运行测试代码：
```javascript
wx.cloud.callFunction({
  name: 'appraiseBads',
  data: { action: 'materials' }
}).then(res => {
  console.log('测试成功：', res.result)
}).catch(err => {
  console.error('测试失败：', err)
})
```

## 📱 前端调用方式

### 在小程序页面中调用：
```javascript
// 分析佛珠图片
wx.cloud.callFunction({
  name: 'appraiseBads',  // 注意：函数名是 appraiseBads
  data: {
    fileID: 'cloud://your-file-id',
    action: 'analyze'
  },
  success: res => {
    if (res.result.success) {
      console.log('分析结果：', res.result.data)
      // 处理分析结果
      const analysis = res.result.data
      console.log('材质：', analysis.material)
      console.log('价格估算：', analysis.estimate)
      console.log('详细评价：', analysis.comment)
    } else {
      console.error('分析失败：', res.result.error)
    }
  },
  fail: err => {
    console.error('调用云函数失败：', err)
  }
})

// 获取历史记录
wx.cloud.callFunction({
  name: 'appraiseBads',
  data: {
    action: 'history'
  },
  success: res => {
    console.log('历史记录：', res.result.data)
  }
})

// 获取材质百科
wx.cloud.callFunction({
  name: 'appraiseBads',
  data: {
    action: 'materials'
  },
  success: res => {
    console.log('材质信息：', res.result.data)
  }
})
```

## 💰 OpenRouter费用说明

### Qwen-VL-Plus 模型费用：
- **输入费用**: $0.8 / 1M tokens
- **输出费用**: $2.4 / 1M tokens
- **图片处理**: 每张图片约消耗 ~1000 tokens

### 预估成本：
- 每次佛珠分析约消耗 1500-2000 tokens
- 单次分析成本约 $0.003-0.005 (约 ¥0.02-0.04)
- 1000次分析约消耗 $3-5 (约 ¥20-35)

## 🔍 测试验证

### 1. 测试云函数
```javascript
// 在微信开发者工具控制台中测试
wx.cloud.callFunction({
  name: 'appraiseBads',
  data: {
    action: 'materials'
  }
}).then(res => {
  console.log('测试结果：', res)
})
```

### 2. 查看日志
1. 在云开发控制台进入"云函数"
2. 点击 `appraiseBads` 函数
3. 查看"调用日志"确认运行状态

## ⚠️ 注意事项

1. **API密钥安全**: 绝对不要在前端代码中暴露API密钥
2. **费用控制**: 建议设置OpenRouter账户的使用限额
3. **错误处理**: 代码已包含备用方案，API失败时会返回本地分析结果
4. **图片格式**: 支持 JPEG、PNG 等常见格式
5. **图片大小**: 建议控制在 5MB 以内以提高处理速度

## 🚀 部署完成后的文件结构

```
miniprogram/
└── cloudfunctions/
    └── appraiseBads/
        ├── index.js          # 主要逻辑代码
        ├── package.json      # 依赖配置
        └── config.json       # 云函数配置
```

按照以上步骤配置完成后，您的佛珠鉴赏助手就可以使用OpenRouter的Qwen-VL-Plus模型进行智能分析了！🎉