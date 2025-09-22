# 图标文件说明

## 缺失的图标文件

当前 `app.json` 中配置的 tabBar 需要以下图标文件：

### 首页图标
- `home.png` - 首页未选中图标
- `home-active.png` - 首页选中图标

### 百科图标  
- `baike.png` - 百科未选中图标
- `baike-active.png` - 百科选中图标

### 社区图标
- `shequ.png` - 社区未选中图标  
- `shequ-active.png` - 社区选中图标

### 个人中心图标
- `mine.png` - 个人中心未选中图标
- `mine-active.png` - 个人中心选中图标

## 图标规格要求

- **尺寸**: 40px × 40px (推荐 81px × 81px 以支持高分辨率)
- **格式**: PNG 格式
- **背景**: 透明背景
- **颜色**: 
  - 未选中状态：灰色 (#999999)
  - 选中状态：蓝色 (#007AFF)

## 临时解决方案

目前已将 `app.json` 中的 `tabBar` 配置临时移除，避免报错。

当图标文件准备好后，可以将以下配置重新添加到 `app.json` 中：

```json
"tabBar": {
  "color": "#999999",
  "selectedColor": "#007AFF", 
  "backgroundColor": "#ffffff",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/index/index",
      "text": "首页",
      "iconPath": "images/home.png",
      "selectedIconPath": "images/home-active.png"
    },
    {
      "pagePath": "pages/baike/baike", 
      "text": "百科",
      "iconPath": "images/baike.png",
      "selectedIconPath": "images/baike-active.png"
    },
    {
      "pagePath": "pages/shequ/shequ",
      "text": "社区", 
      "iconPath": "images/shequ.png",
      "selectedIconPath": "images/shequ-active.png"
    },
    {
      "pagePath": "pages/mine/mine",
      "text": "我的",
      "iconPath": "images/mine.png", 
      "selectedIconPath": "images/mine-active.png"
    }
  ]
}
```

## 获取图标的方法

1. **设计工具**: 使用 Figma、Sketch、Photoshop 等设计工具创建
2. **图标库**: 从 iconfont、Feather Icons 等图标库下载
3. **AI生成**: 使用 AI 工具生成简单的图标
4. **在线工具**: 使用在线图标生成器

## 注意事项

- 图标文件名必须与 `app.json` 中配置的完全一致
- 图标文件必须放在 `miniprogram/images/` 目录下
- 建议使用矢量图标，确保在不同设备上显示清晰