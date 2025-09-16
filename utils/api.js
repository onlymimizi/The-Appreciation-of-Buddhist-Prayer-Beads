// utils/api.js
const API_BASE_URL = 'http://localhost:3000' // 本地Mock API地址

/**
 * 分析佛珠图片
 * @param {string} imageUrl 图片地址
 * @returns {Promise} 分析结果
 */
function analyzeBeads(imageUrl) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/analyze`,
      method: 'POST',
      data: {
        imageUrl: imageUrl
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error('分析失败'))
        }
      },
      fail: (err) => {
        console.error('API调用失败:', err)
        // 如果API调用失败，返回模拟数据
        resolve(getMockAnalysisResult())
      }
    })
  })
}

/**
 * 获取模拟分析结果
 * @returns {Object} 模拟的分析结果
 */
function getMockAnalysisResult() {
  const materials = ['小叶紫檀', '海南黄花梨', '金刚菩提', '星月菩提', '南红玛瑙', '沉香木']
  const crafts = ['手工打磨', '机器加工', '传统工艺', '现代工艺', '精工制作']
  const comments = [
    '包浆自然，纹理清晰，工艺较佳',
    '材质优良，色泽温润，值得收藏',
    '品相完好，密度适中，盘玩效果佳',
    '纹理独特，油性充足，品质上乘',
    '工艺精湛，形制规整，具有收藏价值'
  ]

  const material = materials[Math.floor(Math.random() * materials.length)]
  const craft = crafts[Math.floor(Math.random() * crafts.length)]
  const comment = comments[Math.floor(Math.random() * comments.length)]
  
  // 根据材质生成不同的价格区间
  let priceRange = ''
  switch (material) {
    case '小叶紫檀':
      priceRange = `¥${800 + Math.floor(Math.random() * 1200)} - ¥${2000 + Math.floor(Math.random() * 2000)}`
      break
    case '海南黄花梨':
      priceRange = `¥${2000 + Math.floor(Math.random() * 3000)} - ¥${5000 + Math.floor(Math.random() * 5000)}`
      break
    case '金刚菩提':
      priceRange = `¥${200 + Math.floor(Math.random() * 400)} - ¥${600 + Math.floor(Math.random() * 800)}`
      break
    case '星月菩提':
      priceRange = `¥${150 + Math.floor(Math.random() * 250)} - ¥${400 + Math.floor(Math.random() * 600)}`
      break
    case '南红玛瑙':
      priceRange = `¥${500 + Math.floor(Math.random() * 800)} - ¥${1300 + Math.floor(Math.random() * 1700)}`
      break
    case '沉香木':
      priceRange = `¥${1000 + Math.floor(Math.random() * 2000)} - ¥${3000 + Math.floor(Math.random() * 4000)}`
      break
    default:
      priceRange = `¥${300 + Math.floor(Math.random() * 500)} - ¥${800 + Math.floor(Math.random() * 1200)}`
  }

  return {
    material,
    craft,
    estimate: priceRange,
    comment,
    confidence: 75 + Math.floor(Math.random() * 20) // 75-95之间的置信度
  }
}

module.exports = {
  analyzeBeads,
  getMockAnalysisResult
}