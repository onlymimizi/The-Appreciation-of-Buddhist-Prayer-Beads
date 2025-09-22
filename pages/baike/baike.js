// baike.js
Page({
  data: {
    searchValue: '',
    currentCategory: 1,
    categoryList: [
      { id: 1, name: '木质佛珠' },
      { id: 2, name: '菩提类' },
      { id: 3, name: '宝石类' },
      { id: 4, name: '盘玩技巧' },
      { id: 5, name: '保养知识' }
    ],
    allData: {
      1: [ // 木质佛珠
        {
          id: 1,
          title: '小叶紫檀',
          desc: '帝王之木，质地坚硬，纹理细腻',
          detail: '小叶紫檀学名檀香紫檀，是紫檀中的精品，密度大，棕眼小，多产于印度南部。其木质坚硬，色泽深沉，香气淡雅，是制作佛珠的上等材料。',
          features: ['密度高，入水即沉', '油性足，光泽度好', '香味淡雅持久', '纹理细腻美观'],
          tips: ['真品颜色深沉，假品过于鲜艳', '真品有淡淡檀香味', '用白纸擦拭会有红色痕迹', '重量较重，手感厚实'],
          expanded: false
        },
        {
          id: 2,
          title: '海南黄花梨',
          desc: '香气浓郁，纹理如鬼脸，极具收藏价值',
          detail: '海南黄花梨又称降香黄檀，是中国特有的珍贵木材，有"木中黄金"之称。其纹理变化多端，香味浓郁持久，是文玩界的顶级材料。',
          features: ['纹理变化丰富，如鬼脸、水波纹', '香味浓郁，闻之心旷神怡', '材质坚硬，不易开裂', '颜色金黄，光泽温润'],
          tips: ['真品香味浓郁且持久', '纹理自然流畅，不规则', '材质坚硬，敲击声清脆', '价格昂贵，需谨防假货'],
          expanded: false
        }
      ],
      2: [ // 菩提类
        {
          id: 3,
          title: '金刚菩提',
          desc: '坚硬如金刚，寓意坚不可摧的智慧',
          detail: '金刚菩提是一种大型常绿阔叶树木的果实，主要产于尼泊尔、印度等地。因其坚硬的质地和独特的纹路而备受喜爱。',
          features: ['质地坚硬，不易损坏', '纹路清晰，立体感强', '盘玩后颜色变深', '寓意吉祥，驱邪避凶'],
          tips: ['选择纹路清晰的', '避免有裂痕的', '新籽颜色较浅', '盘玩需要耐心'],
          expanded: false
        },
        {
          id: 4,
          title: '星月菩提',
          desc: '表面布满星星点点，中间有月亮般的圆点',
          detail: '星月菩提是黄藤的果实，因其表面布满均匀的黑点和一个较大的圆点而得名，寓意众星捧月。',
          features: ['密度适中，手感舒适', '星点分布均匀', '盘玩变化明显', '价格适中，适合入门'],
          tips: ['选择正月（圆点居中）', '星点要分布均匀', '避免阴皮、花皮', '新籽呈白色或淡黄色'],
          expanded: false
        }
      ],
      3: [ // 宝石类
        {
          id: 5,
          title: '南红玛瑙',
          desc: '色如朝霞，质如美玉，中国独有的宝石',
          detail: '南红玛瑙是中国独有的品种，因其产地主要在南方而得名。颜色鲜艳，质地温润，是近年来备受追捧的宝石类佛珠材料。',
          features: ['颜色鲜艳，以红色为主', '质地温润，手感舒适', '透明度适中', '具有很高的收藏价值'],
          tips: ['真品颜色自然，假品过于鲜艳', '质地温润，不会过于光滑', '有一定的重量感', '价格较高，需谨慎购买'],
          expanded: false
        }
      ],
      4: [ // 盘玩技巧
        {
          id: 6,
          title: '正确的盘玩方法',
          desc: '掌握技巧，让佛珠越盘越美',
          detail: '盘玩是文玩佛珠保养和增值的重要方式，正确的盘玩方法能让佛珠形成美丽的包浆，提升其观赏价值和收藏价值。',
          features: ['净手盘玩，保持清洁', '适度用力，避免过猛', '定期休息，让佛珠氧化', '避免汗手直接接触'],
          tips: ['新珠先用棉布盘玩', '每天盘玩时间不宜过长', '定期让佛珠自然氧化', '避免接触化学物品'],
          expanded: false
        }
      ],
      5: [ // 保养知识
        {
          id: 7,
          title: '佛珠保养要点',
          desc: '正确保养，延长佛珠使用寿命',
          detail: '佛珠的保养关系到其使用寿命和美观程度，正确的保养方法能让佛珠保持最佳状态。',
          features: ['避免磕碰，轻拿轻放', '远离高温和阳光直射', '定期清洁，保持干净', '适当上油，保持润泽'],
          tips: ['存放时用软布包裹', '避免接触化学物品', '定期检查绳子状况', '发现问题及时处理'],
          expanded: false
        }
      ]
    },
    currentList: []
  },

  onLoad(options) {
    this.setData({
      currentList: this.data.allData[1]
    })
    
    // 如果有传入ID，展开对应项目
    if (options.id) {
      this.expandItem(parseInt(options.id))
    }
  },

  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
    this.filterContent()
  },

  switchCategory(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({
      currentCategory: categoryId,
      currentList: this.data.allData[categoryId] || [],
      searchValue: ''
    })
  },

  viewDetail(e) {
    const item = e.currentTarget.dataset.item
    const currentList = this.data.currentList
    const index = currentList.findIndex(i => i.id === item.id)
    
    if (index !== -1) {
      currentList[index].expanded = !currentList[index].expanded
      this.setData({
        currentList: currentList
      })
    }
  },

  expandItem(id) {
    const currentList = this.data.currentList
    const index = currentList.findIndex(i => i.id === id)
    
    if (index !== -1) {
      currentList[index].expanded = true
      this.setData({
        currentList: currentList
      })
    }
  },

  filterContent() {
    const searchValue = this.data.searchValue.toLowerCase()
    if (!searchValue) {
      this.setData({
        currentList: this.data.allData[this.data.currentCategory]
      })
      return
    }

    const allItems = this.data.allData[this.data.currentCategory]
    const filteredItems = allItems.filter(item => 
      item.title.toLowerCase().includes(searchValue) ||
      item.desc.toLowerCase().includes(searchValue)
    )

    this.setData({
      currentList: filteredItems
    })
  },

  onShareAppMessage() {
    return {
      title: '佛珠百科 - 学习佛珠知识',
      path: '/pages/baike/baike'
    }
  }
})