// result.js
Page({
  data: {
    imageUrl: '',
    result: {
      material: '',
      craft: '',
      estimate: '',
      comment: '',
      confidence: 0
    },
    recommendList: [
      {
        id: 1,
        name: '小叶紫檀鉴别指南',
        desc: '详细介绍小叶紫檀的特征',
        image: '/images/guide1.jpg'
      },
      {
        id: 2,
        name: '佛珠保养技巧',
        desc: '让你的佛珠保持最佳状态',
        image: '/images/guide2.jpg'
      },
      {
        id: 3,
        name: '文玩市场行情',
        desc: '了解最新的市场价格',
        image: '/images/guide3.jpg'
      }
    ]
  },

  onLoad(options) {
    // 获取传递的参数
    if (options.imageUrl) {
      this.setData({
        imageUrl: decodeURIComponent(options.imageUrl)
      })
    }
    
    if (options.result) {
      try {
        const result = JSON.parse(decodeURIComponent(options.result))
        this.setData({
          result: result
        })
      } catch (e) {
        console.error('解析结果数据失败:', e)
      }
    }

    // 更新鉴赏次数统计
    this.updateAnalysisCount()
  },

  updateAnalysisCount() {
    const currentCount = wx.getStorageSync('totalAnalysis') || 0
    wx.setStorageSync('totalAnalysis', currentCount + 1)
  },

  previewImage() {
    wx.previewImage({
      current: this.data.imageUrl,
      urls: [this.data.imageUrl]
    })
  },

  saveResult() {
    const { imageUrl, result } = this.data
    const savedResults = wx.getStorageSync('analysisHistory') || []
    
    const newResult = {
      id: Date.now(),
      imageUrl,
      result,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    }
    
    savedResults.unshift(newResult)
    
    // 最多保存50条记录
    if (savedResults.length > 50) {
      savedResults.splice(50)
    }
    
    wx.setStorageSync('analysisHistory', savedResults)
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
  },

  shareResult() {
    // 分享功能会通过onShareAppMessage实现
    wx.showToast({
      title: '点击右上角分享',
      icon: 'none'
    })
  },

  viewRecommend(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/baike/baike?id=${id}`
    })
  },

  reanalyze() {
    wx.navigateBack({
      delta: 1
    })
  },

  onShareAppMessage() {
    const { result } = this.data
    return {
      title: `AI鉴赏结果：${result.material} - ${result.estimate}`,
      path: `/pages/result/result?imageUrl=${encodeURIComponent(this.data.imageUrl)}&result=${encodeURIComponent(JSON.stringify(this.data.result))}`,
      imageUrl: this.data.imageUrl
    }
  }
})