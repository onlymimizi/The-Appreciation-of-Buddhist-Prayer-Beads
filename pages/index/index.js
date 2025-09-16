// index.js
const { uploadImage, compressImage, showLoading, hideLoading, showSuccess, showError } = require('../../utils/util')
const { analyzeBeads } = require('../../utils/api')

Page({
  data: {
    totalAnalysis: 0,
    todayAnalysis: 0,
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
  },

  onShow() {
    this.loadStats()
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
  },

  // 拍照上传
  async takePhoto() {
    try {
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

  // 分析图片
  async analyzeImage(imagePath) {
    try {
      showLoading('AI正在分析中...')
      
      // 压缩图片
      const compressedPath = await compressImage(imagePath, 80)
      
      // 调用分析API
      const result = await analyzeBeads(compressedPath)
      
      hideLoading()
      
      // 更新统计
      this.updateTodayAnalysis()
      
      // 跳转到结果页面
      wx.navigateTo({
        url: `/pages/result/result?imageUrl=${encodeURIComponent(compressedPath)}&result=${encodeURIComponent(JSON.stringify(result))}`
      })
      
    } catch (error) {
      hideLoading()
      console.error('分析失败:', error)
      showError('分析失败，请重试')
    }
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({
      title: `查看商品${id}详情`,
      icon: 'none'
    })
  },

  viewKnowledge(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/baike/baike?id=${id}`
    })
  },

  onShareAppMessage() {
    return {
      title: '佛珠鉴赏 - AI智能鉴赏佛珠',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})