const axios = require('axios');

class QwenService {
  constructor() {
    this.provider = process.env.QWEN_PROVIDER || 'openrouter';
    this.apiKey = process.env.QWEN_API_KEY;
    
    // OpenRouter 配置（推荐）
    this.openrouterConfig = {
      baseURL: process.env.OPENROUTER_API_BASE || 'https://openrouter.ai/api/v1',
      model: process.env.OPENROUTER_MODEL || 'qwen/qwen-vl-plus'
    };
    
    // DashScope 配置（阿里云官方）
    this.dashscopeConfig = {
      baseURL: process.env.DASHSCOPE_API_BASE || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      model: process.env.DASHSCOPE_MODEL || 'qwen-vl-plus'
    };
    
    if (!this.apiKey) {
      console.warn('警告: 未配置 QWEN_API_KEY');
    }
  }

  async analyzeBeads(imageBuffer) {
    if (!this.apiKey) {
      throw new Error('Qwen API密钥未配置');
    }

    try {
      // 将图片转换为base64
      const base64Image = imageBuffer.toString('base64');
      
      const prompt = `请作为专业的佛珠鉴赏师，仔细分析这张佛珠图片，并提供详细的鉴赏报告。

请从以下几个方面进行分析：
1. 材质识别：判断佛珠的材质类型（如小叶紫檀、海南黄花梨、金刚菩提、星月菩提、南红玛瑙、沉香木等）
2. 工艺评估：分析制作工艺（手工打磨、机器加工、传统工艺等）
3. 品相评价：评估佛珠的品相、包浆、纹理等
4. 价值估算：给出合理的价格区间
5. 文化背景：简述该类佛珠的文化历史背景
6. 保养建议：提供专业的保养和盘玩建议

请以JSON格式返回结果，包含以下字段：
{
  "material": "材质名称",
  "craft": "工艺类型", 
  "estimate": "价格区间（如：¥800 - ¥2000）",
  "comment": "详细的鉴赏评价",
  "confidence": "置信度（0-100的数字）",
  "features": ["特征1", "特征2", "特征3"],
  "description": "材质详细描述",
  "culturalBackground": "文化历史背景",
  "careInstructions": "保养盘玩建议"
}`;

      let response;
      
      if (this.provider === 'openrouter') {
        response = await this.callOpenRouter(base64Image, prompt);
      } else if (this.provider === 'dashscope') {
        response = await this.callDashScope(base64Image, prompt);
      } else {
        throw new Error(`不支持的 Qwen 提供者: ${this.provider}`);
      }

      const content = response.data.choices[0].message.content;
      
      // 尝试解析JSON响应
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return this.validateAndFormatResult(result);
        }
      } catch (parseError) {
        console.warn('Qwen响应解析失败，使用文本解析:', parseError);
      }

      // 如果JSON解析失败，使用文本解析
      return this.parseTextResponse(content);

    } catch (error) {
      console.error('Qwen API调用失败:', error.message);
      
      if (error.response) {
        console.error('API响应错误:', error.response.data);
      }
      
      throw new Error(`Qwen分析失败: ${error.message}`);
    }
  }

  async callOpenRouter(base64Image, prompt) {
    return await axios.post(
      `${this.openrouterConfig.baseURL}/chat/completions`,
      {
        model: this.openrouterConfig.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/onlymimizi/The-Appreciation-of-Buddhist-Prayer-Beads',
          'X-Title': 'Buddhist Prayer Beads AI Analysis'
        },
        timeout: 30000
      }
    );
  }

  async callDashScope(base64Image, prompt) {
    return await axios.post(
      `${this.dashscopeConfig.baseURL}/chat/completions`,
      {
        model: this.dashscopeConfig.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
  }

  validateAndFormatResult(result) {
    return {
      material: result.material || '未知材质',
      craft: result.craft || '工艺待定',
      estimate: result.estimate || '价格待估',
      comment: result.comment || '需要进一步鉴定',
      confidence: Math.min(100, Math.max(0, parseInt(result.confidence) || 0)),
      features: Array.isArray(result.features) ? result.features : [],
      description: result.description || '',
      culturalBackground: result.culturalBackground || '',
      careInstructions: result.careInstructions || ''
    };
  }

  parseTextResponse(content) {
    // 简单的文本解析逻辑
    const materials = ['小叶紫檀', '海南黄花梨', '金刚菩提', '星月菩提', '南红玛瑙', '沉香木'];
    const crafts = ['手工打磨', '机器加工', '传统工艺', '现代工艺'];
    
    let material = '未知材质';
    let craft = '工艺待定';
    
    // 尝试从文本中提取材质信息
    for (const mat of materials) {
      if (content.includes(mat)) {
        material = mat;
        break;
      }
    }
    
    // 尝试从文本中提取工艺信息
    for (const cr of crafts) {
      if (content.includes(cr)) {
        craft = cr;
        break;
      }
    }

    return {
      material,
      craft,
      estimate: '¥500 - ¥1500',
      comment: content.substring(0, 200) + '...',
      confidence: 75,
      features: ['Qwen-VL识别特征'],
      description: '基于通义千问视觉模型的分析结果',
      culturalBackground: '佛珠承载着深厚的佛教文化内涵',
      careInstructions: '避免接触化学物品，定期保养'
    };
  }

  // 获取服务状态
  getServiceInfo() {
    return {
      provider: this.provider,
      model: this.provider === 'openrouter' ? this.openrouterConfig.model : this.dashscopeConfig.model,
      baseURL: this.provider === 'openrouter' ? this.openrouterConfig.baseURL : this.dashscopeConfig.baseURL,
      configured: !!this.apiKey
    };
  }
}

module.exports = new QwenService();