// index.js - 更新版本，支持 AI 后端服务
const { uploadImage, compressImage, showLoading, hideLoading, showSuccess, showError } = require('../../utils/util')
const { analyzeBeads, checkHealth, saveAnalysisHistory } = require('../../utils/api')

Page({
  data: {
    totalAnalysis: 0,
    todayAnalysis: 0,
    aiServiceStatus: 'unknown', // unknown, healthy, unhealthy
    swiperList: [
      {
        id: 1,
        image: '/images/swiper1.jpg'
      },
      {
        id: 2,
        image: '/images/swiper2.jpg'
      },
      {
        id: 3,
        image: '/images/swiper3.jpg'
      }
    ],
    recommendList: [
      {
        id: 1,
        name: '小叶紫檀佛珠',
        desc: '印度老料，油性十足',
        price: '￥1,280',
        image: '/images/recommend1.jpg'
      },
      {
        id: 2,
        name: '海南黄花梨',
        desc: '纹理清晰，香味浓郁',
        price: '￥2,680',
        image: '/images/recommend2.jpg'
      },
      {
        id: 3,
        name: '金刚菩提',
        desc: '五瓣金刚，品相完美',
        price: '￥580',
        image: '/images/recommend3.jpg'
      },
      {
        id: 4,
        name: '星月菩提',
        desc: '正月高密，包浆温润',
        price: '￥380',
        image: '/images/recommend4.jpg'
      }
    ],
    knowledgeList: [
      {
        id: 1,
        title: '如何鉴别小叶紫檀真假',
        summary: '从颜色、纹理、密度等方面教你识别真正的小叶紫檀...'
      },
      {
        id: 2,
        title: '佛珠的正确盘玩方法',
        summary: '掌握正确的盘玩技巧，让你的佛珠越来越美...'
      },
      {
        id: 3,
        title: '各种菩提子的特点对比',
        summary: '金刚、星月、凤眼等菩提子的区别和选择建议...'
      }
    ]
  },

  onLoad() {
    this.loadStats()
    this.checkAIService()
  },

  onShow() {
    this.loadStats()
  },

  onPullDownRefresh() {
    this.loadStats()
    this.checkAIService()
    wx.stopPullDownRefresh()
  },

  loadStats() {
    const totalAnalysis = wx.getStorageSync('totalAnalysis') || 0
    const todayAnalysis = this.getTodayAnalysis()
    
    this.setData({
      totalAnalysis,
      todayAnalysis
    })
  },

  getTodayAnalysis() {
    const today = new Date().toDateString()
    const todayKey = `analysis_${today}`
    return wx.getStorageSync(todayKey) || 0
  },

  updateTodayAnalysis() {
    const today = new Date().toDateString()
    const todayKey = `analysis_${today}`
    const currentCount = wx.getStorageSync(todayKey) || 0
    wx.setStorageSync(todayKey, currentCount + 1)
    
    // 更新总分析次数
    const totalAnalysis = wx.getStorageSync('totalAnalysis') || 0
    wx.setStorageSync('totalAnalysis', totalAnalysis + 1)
  },

  // 检查AI服务状态
  async checkAIService() {
    try {
      const status = await checkHealth()
      this.setData({
        aiServiceStatus: status.healthy ? 'healthy' : 'unhealthy'
      })
    } catch (error) {
      console.error('检查AI服务状态失败:', error)
      this.setData({
        aiServiceStatus: 'unhealthy'
      })
    }
  },

  // 拍照上传
  async takePhoto() {
    try {
      // 检查相机权限
      const authResult = await this.checkCameraAuth()
      if (!authResult) {
        return
      }

      showLoading('准备拍照...')
      const imagePath = await uploadImage('camera')
      hideLoading()
      this.analyzeImage(imagePath)
    } catch (error) {
      hideLoading()
      console.error('拍照失败:', error)
      showError('拍照失败，请重试')
    }
  },

  // 从相册选择
  async chooseImage() {
    try {
      showLoading('选择图片...')
      const imagePath = await uploadImage('album')
      hideLoading()
      this.analyzeImage(imagePath)
    } catch (error) {
      hideLoading()
      console.error('选择图片失败:', error)
      showError('选择图片失败，请重试')
    }
  },

  // 检查相机权限
  checkCameraAuth() {
    return new Promise((resolve) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.camera'] === false) {
            // 用户拒绝了相机权限，引导用户去设置
            wx.showModal({
              title: '需要相机权限',
              content: '请在设置中开启相机权限，以便拍照识别佛珠',
              confirmText: '去设置',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.openSetting({
                    success: (settingRes) => {
                      resolve(settingRes.authSetting['scope.camera'])
                    },
                    fail: () => resolve(false)
                  })
                } else {
                  resolve(false)
                }
              }
            })
          } else {
            resolve(true)
          }
        },
        fail: () => resolve(true)
      })
    })
  },

  // 分析图片
  async analyzeImage(imagePath) {
    try {
      showLoading('AI正在分析中...', true)
      
      // 压缩图片以提高上传速度
      const compressedPath = await compressImage(imagePath, 80)
      
      // 调用AI分析API
      const result = await analyzeBeads(compressedPath)
      
      hideLoading()
      
      // 保存分析历史
      saveAnalysisHistory(compressedPath, result)
      
      // 更新统计
      this.updateTodayAnalysis()
      this.loadStats()
      
      // 显示成功提示
      if (result.aiService !== 'fallback') {
        showSuccess('AI分析完成')
      } else {
        wx.showToast({
          title: '使用离线模式分析',
          icon: 'none',
          duration: 2000
        })
      }
      
      // 跳转到结果页面
      wx.navigateTo({
        url: `/pages/result/result?imageUrl=${encodeURIComponent(compressedPath)}&result=${encodeURIComponent(JSON.stringify(result))}`
      })
      
    } catch (error) {
      hideLoading()
      console.error('分析失败:', error)
      
      // 根据错误类型显示不同的提示
      let errorMsg = '分析失败，请重试'
      if (error.message.includes('网络')) {
        errorMsg = '网络连接失败，请检查网络后重试'
      } else if (error.message.includes('图片')) {
        errorMsg = '图片格式不支持，请选择其他图片'
      } else if (error.message.includes('超时')) {
        errorMsg = 'AI服务响应超时，请稍后重试'
      }
      
      showError(errorMsg)
    }
  },

  // 查看商品详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({
      title: `查看商品${id}详情`,
      icon: 'none'
    })
  },

  // 查看知识详情
  viewKnowledge(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/baike/baike?id=${id}`
    })
  },

  // 查看分析历史
  viewHistory() {
    wx.navigateTo({
      url: '/pages/analysis-history/analysis-history'
    })
  },

  // 查看AI服务状态
  viewAIStatus() {
    const statusText = {
      'healthy': 'AI服务正常运行',
      'unhealthy': 'AI服务暂时不可用，将使用离线模式',
      'unknown': '正在检查AI服务状态...'
    }
    
    wx.showModal({
      title: 'AI服务状态',
      content: statusText[this.data.aiServiceStatus],
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '佛珠鉴赏 - AI智能鉴赏佛珠',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '佛珠鉴赏 - AI智能鉴赏佛珠',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})