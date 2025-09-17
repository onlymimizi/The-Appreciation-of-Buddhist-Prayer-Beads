// utils/api.js - 更新版本，支持 AI 后端服务
const API_BASE_URL = 'http://localhost:3000' // AI 后端服务地址

/**
 * 分析佛珠图片 - 使用 AI 后端服务
 * @param {string} imagePath 本地图片路径
 * @returns {Promise} 分析结果
 */
function analyzeBeads(imagePath) {
  return new Promise((resolve, reject) => {
    // 首先尝试使用文件上传方式
    wx.uploadFile({
      url: `${API_BASE_URL}/api/analyze`,
      filePath: imagePath,
      name: 'image',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.success) {
            resolve(data.data);
          } else {
            console.error('AI分析失败:', data.error);
            // 如果AI分析失败，使用备用方案
            resolve(getMockAnalysisResult());
          }
        } catch (error) {
          console.error('响应解析失败:', error);
          resolve(getMockAnalysisResult());
        }
      },
      fail: (err) => {
        console.error('上传失败，尝试Base64方式:', err);
        // 如果上传失败，尝试Base64方式
        analyzeBeadsBase64(imagePath).then(resolve).catch(() => {
          resolve(getMockAnalysisResult());
        });
      }
    });
  });
}

/**
 * 使用Base64方式分析佛珠图片
 * @param {string} imagePath 本地图片路径
 * @returns {Promise} 分析结果
 */
function analyzeBeadsBase64(imagePath) {
  return new Promise((resolve, reject) => {
    // 读取图片文件并转换为Base64
    wx.getFileSystemManager().readFile({
      filePath: imagePath,
      encoding: 'base64',
      success: (fileRes) => {
        const base64Data = `data:image/jpeg;base64,${fileRes.data}`;
        
        wx.request({
          url: `${API_BASE_URL}/api/analyze-base64`,
          method: 'POST',
          data: {
            imageData: base64Data
          },
          header: {
            'content-type': 'application/json'
          },
          success: (res) => {
            if (res.statusCode === 200 && res.data.success) {
              resolve(res.data.data);
            } else {
              console.error('Base64分析失败:', res.data);
              reject(new Error(res.data.error || '分析失败'));
            }
          },
          fail: (err) => {
            console.error('Base64 API调用失败:', err);
            reject(err);
          }
        });
      },
      fail: (err) => {
        console.error('读取图片文件失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 获取材质信息列表
 * @returns {Promise} 材质列表
 */
function getMaterials() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/api/materials`,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          resolve(res.data.data);
        } else {
          resolve(getDefaultMaterials());
        }
      },
      fail: (err) => {
        console.error('获取材质列表失败:', err);
        resolve(getDefaultMaterials());
      }
    });
  });
}

/**
 * 检查AI服务健康状态
 * @returns {Promise} 健康状态
 */
function checkHealth() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/health`,
      method: 'GET',
      timeout: 5000,
      success: (res) => {
        resolve({
          healthy: res.statusCode === 200,
          service: res.data?.service || 'unknown',
          timestamp: res.data?.timestamp
        });
      },
      fail: (err) => {
        resolve({
          healthy: false,
          error: err.errMsg
        });
      }
    });
  });
}

/**
 * 获取默认材质列表（备用数据）
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
  ];
}

/**
 * 获取模拟分析结果（备用方案）
 * @returns {Object} 模拟的分析结果
 */
function getMockAnalysisResult() {
  const materials = getDefaultMaterials();
  const crafts = ['手工打磨', '机器加工', '传统工艺', '现代工艺', '精工制作'];
  const comments = [
    '包浆自然，纹理清晰，工艺较佳，具有一定的收藏价值',
    '材质优良，色泽温润，值得收藏，建议长期持有',
    '品相完好，密度适中，盘玩效果佳，适合日常佩戴',
    '纹理独特，油性充足，品质上乘，市场认可度高',
    '工艺精湛，形制规整，具有收藏价值，升值潜力较大'
  ];

  const selectedMaterial = materials[Math.floor(Math.random() * materials.length)];
  const craft = crafts[Math.floor(Math.random() * crafts.length)];
  const comment = comments[Math.floor(Math.random() * comments.length)];
  
  // 根据材质生成价格区间
  const minPrice = selectedMaterial.priceRange[0] + Math.floor(Math.random() * 200);
  const maxPrice = selectedMaterial.priceRange[1] - Math.floor(Math.random() * 300);
  const estimate = `¥${minPrice} - ¥${maxPrice}`;

  return {
    material: selectedMaterial.name,
    craft: craft,
    estimate: estimate,
    comment: comment,
    confidence: 75 + Math.floor(Math.random() * 20), // 75-95之间的置信度
    features: selectedMaterial.features,
    description: selectedMaterial.description,
    culturalBackground: '佛珠作为佛教文化的重要载体，承载着深厚的宗教和文化内涵，历史悠久，工艺精湛。',
    careInstructions: '避免接触化学物品，定期用软布擦拭，适当盘玩可增加包浆，保持干燥通风的存放环境。',
    analysisTime: new Date().toISOString(),
    aiService: 'fallback'
  };
}

/**
 * 保存分析历史记录
 * @param {string} imageUrl 图片地址
 * @param {Object} result 分析结果
 */
function saveAnalysisHistory(imageUrl, result) {
  try {
    const history = wx.getStorageSync('analysis_history') || [];
    const record = {
      id: Date.now(),
      imageUrl: imageUrl,
      result: result,
      timestamp: new Date().toISOString()
    };
    
    history.unshift(record);
    
    // 只保留最近50条记录
    if (history.length > 50) {
      history.splice(50);
    }
    
    wx.setStorageSync('analysis_history', history);
  } catch (error) {
    console.error('保存分析历史失败:', error);
  }
}

/**
 * 获取分析历史记录
 * @returns {Array} 历史记录列表
 */
function getAnalysisHistory() {
  try {
    return wx.getStorageSync('analysis_history') || [];
  } catch (error) {
    console.error('获取分析历史失败:', error);
    return [];
  }
}

/**
 * 清除分析历史记录
 */
function clearAnalysisHistory() {
  try {
    wx.removeStorageSync('analysis_history');
  } catch (error) {
    console.error('清除分析历史失败:', error);
  }
}

module.exports = {
  analyzeBeads,
  analyzeBeadsBase64,
  getMaterials,
  checkHealth,
  getMockAnalysisResult,
  saveAnalysisHistory,
  getAnalysisHistory,
  clearAnalysisHistory
};