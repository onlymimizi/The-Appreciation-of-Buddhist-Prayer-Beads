// pages/result/result.js - 更新版本，支持新的AI分析结果
const { saveAnalysisHistory } = require('../../utils/api')

Page({
  data: {
    imageUrl: '',
    result: null,
    loading: false,
    showFullComment: false,
    showCulturalBackground: false,
    showCareInstructions: false
  },

  onLoad(options) {
    if (options.imageUrl && options.result) {
      try {
        const result = JSON.parse(decodeURIComponent(options.result))
        this.setData({
          imageUrl: decodeURIComponent(options.imageUrl),
          result: result
        })
        
        // 设置页面标题
        wx.setNavigationBarTitle({
          title: `${result.material || '佛珠'}鉴赏结果`
        })
      } catch (error) {
        console.error('解析结果数据失败:', error)
        wx.showToast({
          title: '数据解析失败',
          icon: 'error'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    } else {
      wx.showToast({
        title: '缺少必要参数',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }
  },

  // 预览图片
  previewImage() {
    if (this.data.imageUrl) {
      wx.previewImage({
        urls: [this.data.imageUrl],
        current: this.data.imageUrl
      })
    }
  },

  // 切换完整评价显示
  toggleFullComment() {
    this.setData({
      showFullComment: !this.data.showFullComment
    })
  },

  // 切换文化背景显示
  toggleCulturalBackground() {
    this.setData({
      showCulturalBackground: !this.data.showCulturalBackground
    })
  },

  // 切换保养说明显示
  toggleCareInstructions() {
    this.setData({
      showCareInstructions: !this.data.showCareInstructions
    })
  },

  // 保存到相册
  saveToAlbum() {
    if (!this.data.imageUrl) {
      wx.showToast({
        title: '没有图片可保存',
        icon: 'error'
      })
      return
    }

    wx.showLoading({
      title: '保存中...'
    })

    wx.saveImageToPhotosAlbum({
      filePath: this.data.imageUrl,
      success: () => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      },
      fail: (error) => {
        wx.hideLoading()
        console.error('保存失败:', error)
        
        if (error.errMsg.includes('auth')) {
          wx.showModal({
            title: '需要相册权限',
            content: '请在设置中开启相册权限，以便保存图片',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'error'
          })
        }
      }
    })
  },

  // 重新分析
  reAnalyze() {
    wx.showModal({
      title: '重新分析',
      content: '是否要重新分析这张图片？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  },

  // 分享结果
  shareResult() {
    const { result } = this.data
    if (!result) return

    const shareText = `我用AI鉴赏了一串${result.material}佛珠：
材质：${result.material}
工艺：${result.craft}
估价：${result.estimate}
置信度：${result.confidence}%

${result.comment}`

    wx.setClipboardData({
      data: shareText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        })
      }
    })
  },

  // 查看相似商品
  viewSimilarProducts() {
    const { result } = this.data
    if (result && result.material) {
      wx.navigateTo({
        url: `/pages/baike/baike?material=${encodeURIComponent(result.material)}`
      })
    }
  },

  // 添加到收藏
  addToFavorites() {
    const { imageUrl, result } = this.data
    if (!result) return

    try {
      const favorites = wx.getStorageSync('favorites') || []
      const favorite = {
        id: Date.now(),
        imageUrl: imageUrl,
        result: result,
        timestamp: new Date().toISOString()
      }
      
      favorites.unshift(favorite)
      
      // 只保留最近20个收藏
      if (favorites.length > 20) {
        favorites.splice(20)
      }
      
      wx.setStorageSync('favorites', favorites)
      
      wx.showToast({
        title: '已添加到收藏',
        icon: 'success'
      })
    } catch (error) {
      console.error('添加收藏失败:', error)
      wx.showToast({
        title: '收藏失败',
        icon: 'error'
      })
    }
  },

  // 查看置信度说明
  showConfidenceInfo() {
    const confidence = this.data.result?.confidence || 0
    let description = ''
    
    if (confidence >= 90) {
      description = '置信度很高，AI对分析结果非常确信'
    } else if (confidence >= 75) {
      description = '置信度较高，AI对分析结果比较确信'
    } else if (confidence >= 60) {
      description = '置信度中等，建议结合专业人士意见'
    } else {
      description = '置信度较低，建议寻求专业鉴定'
    }

    wx.showModal({
      title: `置信度 ${confidence}%`,
      content: description,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 查看AI服务信息
  showAIServiceInfo() {
    const aiService = this.data.result?.aiService || 'unknown'
    const serviceNames = {
      'openai': 'OpenAI GPT-4 Vision',
      'gemini': 'Google Gemini Vision',
      'fallback': '离线模式',
      'unknown': '未知服务'
    }

    wx.showModal({
      title: 'AI服务信息',
      content: `本次分析使用：${serviceNames[aiService]}`,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 分享给好友
  onShareAppMessage() {
    const { result } = this.data
    if (!result) return {}

    return {
      title: `AI鉴赏：${result.material} - ${result.estimate}`,
      path: `/pages/result/result?imageUrl=${encodeURIComponent(this.data.imageUrl)}&result=${encodeURIComponent(JSON.stringify(result))}`,
      imageUrl: this.data.imageUrl
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { result } = this.data
    if (!result) return {}

    return {
      title: `AI鉴赏佛珠：${result.material}`,
      imageUrl: this.data.imageUrl
    }
  }
})