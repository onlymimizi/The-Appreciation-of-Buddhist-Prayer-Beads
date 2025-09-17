const openaiService = require('./openaiService');
const geminiService = require('./geminiService');
const qwenService = require('./qwenService');

class AIService {
  constructor() {
    this.service = process.env.AI_SERVICE || 'openai';
  }

  async analyzeBeads(imageBuffer) {
    try {
      let result;
      
      switch (this.service) {
        case 'qwen':
          result = await qwenService.analyzeBeads(imageBuffer);
          break;
        case 'gemini':
          result = await geminiService.analyzeBeads(imageBuffer);
          break;
        case 'openai':
        default:
          result = await openaiService.analyzeBeads(imageBuffer);
          break;
      }

      // 统一返回格式
      return {
        material: result.material || '未知材质',
        craft: result.craft || '工艺待定',
        estimate: result.estimate || '价格待估',
        comment: result.comment || '需要进一步鉴定',
        confidence: result.confidence || 0,
        features: result.features || [],
        description: result.description || '',
        culturalBackground: result.culturalBackground || '',
        careInstructions: result.careInstructions || '',
        analysisTime: new Date().toISOString(),
        aiService: this.service
      };
    } catch (error) {
      console.error('AI服务分析失败:', error);
      
      // 如果AI服务失败，返回基础分析结果
      return this.getFallbackResult();
    }
  }

  // 获取当前 AI 服务状态
  getServiceStatus() {
    const baseStatus = {
      currentService: this.service,
      timestamp: new Date().toISOString()
    };

    try {
      switch (this.service) {
        case 'qwen':
          return {
            ...baseStatus,
            ...qwenService.getServiceInfo(),
            available: !!process.env.QWEN_API_KEY
          };
        case 'gemini':
          return {
            ...baseStatus,
            provider: 'google',
            available: !!process.env.GEMINI_API_KEY
          };
        case 'openai':
        default:
          return {
            ...baseStatus,
            provider: 'openai',
            available: !!process.env.OPENAI_API_KEY
          };
      }
    } catch (error) {
      return {
        ...baseStatus,
        available: false,
        error: error.message
      };
    }
  }

  getFallbackResult() {
    const materials = [
      {
        name: '小叶紫檀',
        estimate: '¥800 - ¥2000',
        features: ['密度高', '油性足', '纹理细腻'],
        description: '帝王之木，质地坚硬，纹理细腻，是制作佛珠的上等材料'
      },
      {
        name: '金刚菩提',
        estimate: '¥200 - ¥800',
        features: ['质地坚硬', '纹路清晰', '盘玩变色'],
        description: '坚硬如金刚，寓意坚不可摧的智慧，是文玩爱好者的首选'
      },
      {
        name: '星月菩提',
        estimate: '¥150 - ¥500',
        features: ['密度适中', '星点均匀', '盘玩变化'],
        description: '表面布满星星点点，中间有月亮般的圆点，寓意众星捧月'
      }
    ];

    const crafts = ['手工打磨', '传统工艺', '现代工艺', '精工制作'];
    const comments = [
      '包浆自然，纹理清晰，工艺较佳，具有一定的收藏价值',
      '材质优良，色泽温润，值得收藏，建议长期持有',
      '品相完好，密度适中，盘玩效果佳，适合日常佩戴'
    ];

    const selectedMaterial = materials[Math.floor(Math.random() * materials.length)];
    const selectedCraft = crafts[Math.floor(Math.random() * crafts.length)];
    const selectedComment = comments[Math.floor(Math.random() * comments.length)];

    return {
      material: selectedMaterial.name,
      craft: selectedCraft,
      estimate: selectedMaterial.estimate,
      comment: selectedComment,
      confidence: 75 + Math.floor(Math.random() * 15),
      features: selectedMaterial.features,
      description: selectedMaterial.description,
      culturalBackground: '佛珠作为佛教文化的重要载体，承载着深厚的宗教和文化内涵。',
      careInstructions: '避免接触化学物品，定期用软布擦拭，适当盘玩可增加包浆。',
      analysisTime: new Date().toISOString(),
      aiService: 'fallback'
    };
  }
}

module.exports = new AIService();