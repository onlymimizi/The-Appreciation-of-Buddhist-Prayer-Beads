// utils/util.js

/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的时间字符串
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

/**
 * 格式化数字，小于10的数字前面补0
 * @param {number} n 数字
 * @returns {string} 格式化后的字符串
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 上传图片到临时路径
 * @param {string} source 图片来源 'camera' | 'album'
 * @returns {Promise<string>} 图片临时路径
 */
const uploadImage = (source = 'album') => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [source],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        resolve(tempFilePath)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 压缩图片
 * @param {string} src 图片路径
 * @param {number} quality 压缩质量 0-100
 * @returns {Promise<string>} 压缩后的图片路径
 */
const compressImage = (src, quality = 80) => {
  return new Promise((resolve, reject) => {
    wx.compressImage({
      src,
      quality,
      success: (res) => {
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 显示加载提示
 * @param {string} title 提示文字
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 显示成功提示
 * @param {string} title 提示文字
 */
const showSuccess = (title) => {
  wx.showToast({
    title,
    icon: 'success',
    duration: 2000
  })
}

/**
 * 显示错误提示
 * @param {string} title 提示文字
 */
const showError = (title) => {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 获取相对时间描述
 * @param {string|Date} time 时间
 * @returns {string} 相对时间描述
 */
const getRelativeTime = (time) => {
  const now = new Date()
  const targetTime = new Date(time)
  const diff = now - targetTime
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`
  } else {
    return targetTime.toLocaleDateString()
  }
}

module.exports = {
  formatTime,
  formatNumber,
  uploadImage,
  compressImage,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  getRelativeTime
}