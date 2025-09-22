/**
 * API调用工具函数
 * 封装云函数调用逻辑
 */

/**
 * 调用佛珠鉴赏云函数
 * @param {string} fileID - 云存储文件ID
 * @returns {Promise} 分析结果
 */
function analyzeImage(fileID) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '正在分析中...',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'appraiseBeads',
      data: {
        action: 'analyze',
        fileID: fileID
      },
      success: res => {
        wx.hideLoading()
        console.log('云函数调用成功:', res)
        
        if (res.result && res.result.success) {
          resolve(res.result)
        } else {
          const errorMsg = res.result?.error || '分析失败，请重试'
          reject(new Error(errorMsg))
        }
      },
      fail: err => {
        wx.hideLoading()
        console.error('云函数调用失败:', err)
        reject(new Error('网络连接失败，请检查网络后重试'))
      }
    })
  })
}

/**
 * 获取分析历史记录
 * @returns {Promise} 历史记录列表
 */
function getAnalysisHistory() {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'appraiseBeads',
      data: {
        action: 'getHistory'
      },
      success: res => {
        console.log('获取历史记录成功:', res)
        
        if (res.result && res.result.success) {
          resolve(res.result)
        } else {
          const errorMsg = res.result?.error || '获取历史记录失败'
          reject(new Error(errorMsg))
        }
      },
      fail: err => {
        console.error('获取历史记录失败:', err)
        reject(new Error('网络连接失败，请检查网络后重试'))
      }
    })
  })
}

/**
 * 上传图片到云存储
 * @param {string} filePath - 本地文件路径
 * @returns {Promise} 上传结果
 */
function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    const cloudPath = `beads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        console.log('图片上传成功:', res)
        resolve(res)
      },
      fail: err => {
        console.error('图片上传失败:', err)
        reject(new Error('图片上传失败，请重试'))
      }
    })
  })
}

/**
 * 保存分析结果
 * @param {Object} data - 分析结果数据
 * @returns {Promise} 保存结果
 */
function saveAnalysisResult(data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'appraiseBeads',
      data: {
        action: 'saveResult',
        data: data
      },
      success: res => {
        console.log('保存结果成功:', res)
        
        if (res.result && res.result.success) {
          resolve(res.result)
        } else {
          const errorMsg = res.result?.error || '保存失败'
          reject(new Error(errorMsg))
        }
      },
      fail: err => {
        console.error('保存结果失败:', err)
        reject(new Error('保存失败，请重试'))
      }
    })
  })
}

/**
 * 兼容旧版本的analyzeBeads函数
 * @param {string} imagePath - 本地图片路径
 * @returns {Promise} 分析结果
 */
function analyzeBeads(imagePath) {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. 上传图片到云存储
      const uploadResult = await uploadImage(imagePath)
      
      // 2. 调用云函数进行分析
      const analysisResult = await analyzeImage(uploadResult.fileID)
      
      // 3. 返回结果
      resolve(analysisResult.data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取本地存储的分析历史记录（备用方案）
 * @returns {Array} 历史记录列表
 */
function getLocalAnalysisHistory() {
  try {
    return wx.getStorageSync('analysis_history') || []
  } catch (error) {
    console.error('获取本地分析历史失败:', error)
    return []
  }
}

/**
 * 保存分析历史记录到本地存储（备用方案）
 * @param {string} imageUrl 图片地址
 * @param {Object} result 分析结果
 */
function saveLocalAnalysisHistory(imageUrl, result) {
  try {
    const history = wx.getStorageSync('analysis_history') || []
    const record = {
      id: Date.now(),
      imageUrl: imageUrl,
      result: result,
      timestamp: new Date().toISOString()
    }
    
    history.unshift(record)
    
    // 只保留最近50条记录
    if (history.length > 50) {
      history.splice(50)
    }
    
    wx.setStorageSync('analysis_history', history)
  } catch (error) {
    console.error('保存本地分析历史失败:', error)
  }
}

/**
 * 清除本地分析历史记录
 */
function clearLocalAnalysisHistory() {
  try {
    wx.removeStorageSync('analysis_history')
  } catch (error) {
    console.error('清除本地分析历史失败:', error)
  }
}

/**
 * 获取默认材质列表
 * @returns {Array} 材质列表
 */
function getDefaultMaterials() {
  return [
    {
      name: '小叶紫檀',
      description: '帝王之木，质地坚硬，纹理细腻',
      priceRange: [800, 3000],
      features: ['密度高', '油性足', '香味淡雅', '纹理细腻']
    },
    {
      name: '海南黄花梨',
      description: '木中黄金，纹理变化多端，香味浓郁持久',
      priceRange: [2000, 8000],
      features: ['纹理丰富', '香味浓郁', '材质坚硬', '颜色金黄']
    },
    {
      name: '金刚菩提',
      description: '坚硬如金刚，寓意坚不可摧的智慧',
      priceRange: [200, 1000],
      features: ['质地坚硬', '纹路清晰', '盘玩变色', '寓意吉祥']
    },
    {
      name: '星月菩提',
      description: '表面布满星星点点，中间有月亮般的圆点',
      priceRange: [150, 600],
      features: ['密度适中', '星点均匀', '盘玩变化', '价格适中']
    },
    {
      name: '南红玛瑙',
      description: '色如朝霞，质如美玉，中国独有的宝石',
      priceRange: [500, 2500],
      features: ['颜色鲜艳', '质地温润', '透明度好', '收藏价值高']
    },
    {
      name: '沉香木',
      description: '香中之王，具有独特的香味和药用价值',
      priceRange: [1000, 5000],
      features: ['香味独特', '质地坚实', '药用价值', '稀有珍贵']
    }
  ]
}

module.exports = {
  // 云函数相关
  analyzeImage,
  getAnalysisHistory,
  uploadImage,
  saveAnalysisResult,
  
  // 兼容性函数
  analyzeBeads,
  
  // 本地存储相关
  getLocalAnalysisHistory,
  saveLocalAnalysisHistory,
  clearLocalAnalysisHistory,
  
  // 工具函数
  getDefaultMaterials
}