// mock-api/server.js
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 模拟佛珠材质数据
const materials = [
  {
    name: '小叶紫檀',
    priceRange: [800, 3000],
    features: ['密度高', '油性足', '香味淡雅', '纹理细腻'],
    description: '帝王之木，质地坚硬，纹理细腻，是制作佛珠的上等材料'
  },
  {
    name: '海南黄花梨',
    priceRange: [2000, 8000],
    features: ['纹理丰富', '香味浓郁', '材质坚硬', '颜色金黄'],
    description: '木中黄金，纹理变化多端，香味浓郁持久，极具收藏价值'
  },
  {
    name: '金刚菩提',
    priceRange: [200, 1000],
    features: ['质地坚硬', '纹路清晰', '盘玩变色', '寓意吉祥'],
    description: '坚硬如金刚，寓意坚不可摧的智慧，是文玩爱好者的首选'
  },
  {
    name: '星月菩提',
    priceRange: [150, 600],
    features: ['密度适中', '星点均匀', '盘玩变化', '价格适中'],
    description: '表面布满星星点点，中间有月亮般的圆点，寓意众星捧月'
  },
  {
    name: '南红玛瑙',
    priceRange: [500, 2500],
    features: ['颜色鲜艳', '质地温润', '透明度好', '收藏价值高'],
    description: '色如朝霞，质如美玉，中国独有的宝石，备受收藏家喜爱'
  },
  {
    name: '沉香木',
    priceRange: [1000, 5000],
    features: ['香味独特', '质地坚实', '药用价值', '稀有珍贵'],
    description: '香中之王，具有独特的香味和药用价值，极其珍贵'
  }
]

const crafts = [
  '手工打磨',
  '机器加工',
  '传统工艺',
  '现代工艺',
  '精工制作',
  '古法制作'
]

const comments = [
  '包浆自然，纹理清晰，工艺较佳，具有一定的收藏价值',
  '材质优良，色泽温润，值得收藏，建议长期持有',
  '品相完好，密度适中，盘玩效果佳，适合日常佩戴',
  '纹理独特，油性充足，品质上乘，市场认可度高',
  '工艺精湛，形制规整，具有收藏价值，升值潜力较大',
  '材质纯正，做工精细，包浆温润，是不可多得的精品',
  '颜色正宗，质地坚实，盘玩手感佳，值得推荐',
  '纹路自然，密度较高，整体品相良好，具有投资价值'
]

// 佛珠分析API
app.post('/analyze', (req, res) => {
  console.log('收到分析请求:', req.body)
  
  // 模拟分析延时
  setTimeout(() => {
    // 随机选择材质
    const material = materials[Math.floor(Math.random() * materials.length)]
    const craft = crafts[Math.floor(Math.random() * crafts.length)]
    const comment = comments[Math.floor(Math.random() * comments.length)]
    
    // 生成价格区间
    const minPrice = material.priceRange[0] + Math.floor(Math.random() * 200)
    const maxPrice = material.priceRange[1] - Math.floor(Math.random() * 300)
    const estimate = `¥${minPrice} - ¥${maxPrice}`
    
    // 生成置信度 (75-95之间)
    const confidence = 75 + Math.floor(Math.random() * 20)
    
    const result = {
      success: true,
      data: {
        material: material.name,
        craft: craft,
        estimate: estimate,
        comment: comment,
        confidence: confidence,
        features: material.features,
        description: material.description,
        analysisTime: new Date().toISOString()
      }
    }
    
    console.log('返回分析结果:', result)
    res.json(result.data)
  }, 1000 + Math.random() * 2000) // 1-3秒的随机延时
})

// 获取材质信息API
app.get('/materials', (req, res) => {
  res.json({
    success: true,
    data: materials
  })
})

// 健康检查API
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '佛珠鉴赏API服务正常运行',
    timestamp: new Date().toISOString()
  })
})

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 佛珠鉴赏Mock API服务已启动`)
  console.log(`📡 服务地址: http://localhost:${port}`)
  console.log(`🔍 分析接口: POST http://localhost:${port}/analyze`)
  console.log(`📚 材质接口: GET http://localhost:${port}/materials`)
  console.log(`❤️  健康检查: GET http://localhost:${port}/health`)
  console.log(`\n请确保小程序中的API_BASE_URL设置为: http://localhost:${port}`)
})

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: err.message
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  })
})