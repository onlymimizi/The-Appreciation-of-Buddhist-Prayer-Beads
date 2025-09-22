// shequ.js
Page({
  data: {
    currentTab: 0,
    hasMore: true,
    allPosts: [
      {
        id: 1,
        username: '佛珠收藏家',
        avatar: '/images/avatar1.jpg',
        time: '2小时前',
        title: '刚入手的小叶紫檀，大家帮忙看看品相如何？',
        content: '这串小叶紫檀是朋友推荐的，说是印度老料，油性很足。我看纹理确实很细腻，颜色也比较深沉，就是不太确定是不是真的老料...',
        images: ['/images/post1-1.jpg', '/images/post1-2.jpg', '/images/post1-3.jpg'],
        likes: 128,
        comments: 45,
        views: 892,
        isLiked: false,
        isHot: true,
        isElite: false,
        category: 'latest'
      },
      {
        id: 2,
        username: '菩提玩家',
        avatar: '/images/avatar2.jpg',
        time: '5小时前',
        title: '金刚菩提盘玩一年的变化对比',
        content: '这串五瓣金刚菩提盘了整整一年，从最初的浅色到现在的深红色，变化真的很明显。分享一下盘玩心得...',
        images: ['/images/post2-1.jpg', '/images/post2-2.jpg'],
        likes: 256,
        comments: 78,
        views: 1543,
        isLiked: true,
        isHot: true,
        isElite: true,
        category: 'hot'
      },
      {
        id: 3,
        username: '文玩新手',
        avatar: '/images/avatar3.jpg',
        time: '1天前',
        title: '新手求教：星月菩提怎么选择？',
        content: '刚接触文玩，想入手一串星月菩提练手。听说要选正月的，但是不太懂怎么看，求各位大神指教...',
        images: ['/images/post3-1.jpg'],
        likes: 89,
        comments: 67,
        views: 445,
        isLiked: false,
        isHot: false,
        isElite: false,
        category: 'latest'
      },
      {
        id: 4,
        username: '木质专家',
        avatar: '/images/avatar4.jpg',
        time: '2天前',
        title: '海南黄花梨真假鉴别方法详解',
        content: '最近市面上假的海南黄花梨很多，作为玩了十几年的老玩家，分享一些鉴别真假的实用方法，希望对大家有帮助...',
        images: ['/images/post4-1.jpg', '/images/post4-2.jpg', '/images/post4-3.jpg', '/images/post4-4.jpg'],
        likes: 445,
        comments: 123,
        views: 2876,
        isLiked: false,
        isHot: true,
        isElite: true,
        category: 'elite'
      },
      {
        id: 5,
        username: '南红爱好者',
        avatar: '/images/avatar5.jpg',
        time: '3天前',
        title: '保山南红和凉山南红的区别',
        content: '很多朋友问保山南红和凉山南红有什么区别，今天详细说说这两种南红的特点和价值差异...',
        images: ['/images/post5-1.jpg', '/images/post5-2.jpg'],
        likes: 167,
        comments: 34,
        views: 678,
        isLiked: false,
        isHot: false,
        isElite: true,
        category: 'elite'
      }
    ],
    currentPosts: []
  },

  onLoad() {
    this.loadPosts()
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTab: index
    })
    this.loadPosts()
  },

  loadPosts() {
    let posts = []
    const { currentTab, allPosts } = this.data
    
    switch (currentTab) {
      case 0: // 最新
        posts = allPosts.sort((a, b) => new Date(b.time) - new Date(a.time))
        break
      case 1: // 热门
        posts = allPosts.filter(post => post.isHot).sort((a, b) => b.likes - a.likes)
        break
      case 2: // 精华
        posts = allPosts.filter(post => post.isElite).sort((a, b) => b.likes - a.likes)
        break
    }

    this.setData({
      currentPosts: posts
    })
  },

  createPost() {
    wx.showToast({
      title: '发帖功能开发中',
      icon: 'none'
    })
  },

  viewPost(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${id}`
    })
  },

  likePost(e) {
    const id = e.currentTarget.dataset.id
    const { allPosts, currentPosts } = this.data
    
    // 更新allPosts中的数据
    const postIndex = allPosts.findIndex(post => post.id === id)
    if (postIndex !== -1) {
      allPosts[postIndex].isLiked = !allPosts[postIndex].isLiked
      allPosts[postIndex].likes += allPosts[postIndex].isLiked ? 1 : -1
    }

    // 更新currentPosts中的数据
    const currentIndex = currentPosts.findIndex(post => post.id === id)
    if (currentIndex !== -1) {
      currentPosts[currentIndex].isLiked = !currentPosts[currentIndex].isLiked
      currentPosts[currentIndex].likes += currentPosts[currentIndex].isLiked ? 1 : -1
    }

    this.setData({
      allPosts,
      currentPosts
    })
  },

  previewImage(e) {
    const src = e.currentTarget.dataset.src
    const list = e.currentTarget.dataset.list
    wx.previewImage({
      current: src,
      urls: list
    })
  },

  onShareAppMessage() {
    return {
      title: '佛珠社区 - 分享佛珠文化',
      path: '/pages/shequ/shequ'
    }
  }
})