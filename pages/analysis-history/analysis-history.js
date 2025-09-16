// analysis-history.js
Page({
  data: {
    historyList: []
  },

  onLoad() {
    this.loadHistory()
  },

  onShow() {
    this.loadHistory()
  },

  loadHistory() {
    const historyList = wx.getStorageSync('analysisHistory') || []
    this.setData({
      historyList
    })
  },

  viewResult(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/result/result?imageUrl=${encodeURIComponent(item.imageUrl)}&result=${encodeURIComponent(JSON.stringify(item.result))}`
    })
  },

  shareItem(e) {
    const item = e.currentTarget.dataset.item
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条鉴赏记录吗？',
      success: (res) => {
        if (res.confirm) {
          let historyList = wx.getStorageSync('analysisHistory') || []
          historyList = historyList.filter(item => item.id !== id)
          wx.setStorageSync('analysisHistory', historyList)
          this.setData({
            historyList
          })
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  gotoHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  onShareAppMessage() {
    return {
      title: '我的佛珠鉴赏记录',
      path: '/pages/analysis-history/analysis-history'
    }
  }
})