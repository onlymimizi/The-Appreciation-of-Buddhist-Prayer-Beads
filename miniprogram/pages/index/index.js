const api = require('../../utils/api')

Page({
  data: {
    selectedImage: null,
    analyzing: false,
    uploadProgress: 0,
    totalAnalysis: 0,
    todayAnalysis: 0,
    swiperList: [
      {
        id: 1,
        image: '/images/banner1.jpg'
      },
      {
        id: 2,
        image: '/images/banner2.jpg'
      },
      {
        id: 3,
        image: '/images/banner3.jpg'
      }
    ],
    recommendList: [
      {
        id: 1,
        name: '小叶紫檀手串',
        desc: '印度老料，油性十足',
        price: '¥1,280',
        image: '/images/recommend1.jpg'
      },
      {
        id: 2,
        name: '海南黄花梨',
        desc: '纹理清晰，香味浓郁',
        price: '¥3,680',
        image: '/images/recommend2.jpg'
      }
    ],
    knowledgeList: [
      {
        id: 1,
        title: '如何鉴别小叶紫檀真假',
        summary: '从颜色、纹理、密度等方面详细介绍'
      },
      {
        id: 2,
        title: '佛珠的保养方法',
        summary: '正确的保养能让佛珠更加光泽'
      }
    ]
  },

  onLoad() {
    // 页面加载时的初始化
    console.log('首页加载完成')
    this.loadStats()
  },

  onShow() {
    // 页面显示时刷新统计数据
    this.loadStats()
  },

  // 加载统计数据
  async loadStats() {
    try {
      // 获取总分析次数
      const totalResult = await wx.cloud.callFunction({
        name: 'appraiseBeads',
        data: { action: 'getTotalStats' }
      })
      
      // 获取今日分析次数
      const todayResult = await wx.cloud.callFunction({
        name: 'appraiseBeads',
        data: { action: 'getTodayStats' }
      })
      
      console.log('📊 统计数据:', { total: totalResult.result, today: todayResult.result })
      
      if (totalResult.result.success && todayResult.result.success) {
        this.setData({
          totalAnalysis: totalResult.result.data.total || 0,
          todayAnalysis: todayResult.result.data.today || 0
        })
      }
    } catch (err) {
      console.error('❌ 获取统计数据失败:', err)
      // 设置默认值
      this.setData({
        totalAnalysis: 0,
        todayAnalysis: 0
      })
    }
  },

  // 拍照识别
  takePhoto() {
    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      camera: 'back',
      success: (res) => {
        console.log('拍照成功:', res)
        const tempFilePath = res.tempFiles[0].tempFilePath
        that.analyzeSelectedImage(tempFilePath)
      },
      fail: (err) => {
        console.error('拍照失败:', err)
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        })
      }
    })
  },

  // 选择图片
  chooseImage() {
    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: (res) => {
        console.log('选择图片成功:', res)
        const tempFilePath = res.tempFiles[0].tempFilePath
        // 直接开始分析
        that.analyzeSelectedImage(tempFilePath)
      },
      fail: (err) => {
        console.error('选择图片失败:', err)
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    })
  },

  // 分析选中的图片
  async analyzeSelectedImage(imagePath) {
    this.setData({ 
      analyzing: true,
      selectedImage: imagePath
    })

    try {
      // 1. 先上传图片到云存储
      wx.showLoading({
        title: '正在上传图片...',
        mask: true
      })
      
      const uploadResult = await api.uploadImage(imagePath)
      console.log('✅ 图片上传成功:', uploadResult)
      
      wx.hideLoading()
      
      // 2. 调用云函数进行分析
      wx.showLoading({
        title: 'AI正在分析中...',
        mask: true
      })
      
      const analysisResult = await api.analyzeImage(uploadResult.fileID)
      console.log('🤖 AI分析完成:', analysisResult)
      
      wx.hideLoading()
      
      // 3. 刷新统计数据
      this.loadStats()
      
      // 4. 跳转到结果页面
      wx.navigateTo({
        url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify({
          ...analysisResult.data,
          imageUrl: imagePath,
          fileID: uploadResult.fileID
        }))}`
      })
      
    } catch (error) {
      console.error('❌ 分析过程出错:', error)
      wx.hideLoading()
      wx.showModal({
        title: '分析失败',
        content: error.message || '分析过程中出现错误，请重试',
        showCancel: false,
        confirmText: '确定'
      })
    } finally {
      this.setData({ 
        analyzing: false
      })
    }
  },

  // 查看历史记录
  viewHistory() {
    wx.navigateTo({
      url: '/pages/analysis-history/analysis-history'
    })
  },

  // 查看百科
  viewBaike() {
    wx.navigateTo({
      url: '/pages/baike/baike'
    })
  },

  // 进入社区
  enterShequ() {
    wx.navigateTo({
      url: '/pages/shequ/shequ'
    })
  },

  // 个人中心
  goToMine() {
    wx.navigateTo({
      url: '/pages/mine/mine'
    })
  },

  // 查看商品详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    console.log('查看商品详情:', id)
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 查看知识详情
  viewKnowledge(e) {
    const id = e.currentTarget.dataset.id
    console.log('查看知识详情:', id)
    wx.navigateTo({
      url: '/pages/baike/baike'
    })
  }
})