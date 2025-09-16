// mine.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    totalAnalysis: 0,
    favoriteCount: 0,
    historyCount: 0
  },

  onLoad() {
    this.loadUserInfo()
    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  loadUserInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  loadStats() {
    // 从本地存储加载统计数据
    const totalAnalysis = wx.getStorageSync('totalAnalysis') || 0
    const favoriteCount = wx.getStorageSync('favoriteCount') || 0
    const historyCount = wx.getStorageSync('historyCount') || 0

    this.setData({
      totalAnalysis,
      favoriteCount,
      historyCount
    })
  },

  getUserInfo(e) {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: (err) => {
        console.log('获取用户信息失败', err)
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    })
  },

  viewFavorites() {
    wx.showToast({
      title: '收藏功能开发中',
      icon: 'none'
    })
  },

  viewHistory() {
    wx.showToast({
      title: '浏览记录功能开发中',
      icon: 'none'
    })
  },

  viewAnalysisHistory() {
    wx.navigateTo({
      url: '/pages/analysis-history/analysis-history'
    })
  },

  showSettings() {
    wx.showActionSheet({
      itemList: ['清除缓存', '意见反馈', '关于我们'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.clearCache()
            break
          case 1:
            this.feedback()
            break
          case 2:
            this.showAbout()
            break
        }
      }
    })
  },

  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          this.setData({
            totalAnalysis: 0,
            favoriteCount: 0,
            historyCount: 0
          })
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          })
        }
      }
    })
  },

  feedback() {
    wx.showToast({
      title: '意见反馈功能开发中',
      icon: 'none'
    })
  },

  showAbout() {
    wx.showModal({
      title: '关于佛珠鉴赏',
      content: '佛珠鉴赏小程序 v1.0.0\n专业的佛珠鉴赏平台\n提供AI智能鉴赏服务',
      showCancel: false
    })
  },

  onShareAppMessage() {
    return {
      title: '佛珠鉴赏 - 我的个人中心',
      path: '/pages/mine/mine'
    }
  }
})