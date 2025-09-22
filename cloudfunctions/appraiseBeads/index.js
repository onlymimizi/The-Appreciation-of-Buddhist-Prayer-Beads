const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * 佛珠鉴赏云函数
 * 接收前端上传的图片文件ID，调用AI服务进行鉴赏分析
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { fileID, action = 'analyze' } = event
    
    console.log('云函数调用参数:', { fileID, action, openid: wxContext.OPENID })
    
    switch (action) {
      case 'analyze':
        return await analyzeBeads(fileID, wxContext.OPENID)
      case 'getHistory':
        return await getAnalysisHistory(wxContext.OPENID)
      case 'saveResult':
        return await saveAnalysisResult(event.data, wxContext.OPENID)
      default:
        throw new Error('不支持的操作类型')
    }
    
  } catch (error) {
    console.error('云函数执行错误:', error)
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    }
  }
}

/**
 * 分析佛珠图片
 */
async function analyzeBeads(fileID, openid) {
  if (!fileID) {
    throw new Error('缺少图片文件ID')
  }
  
  try {
    // 1. 下载图片文件
    console.log('开始下载图片文件:', fileID)
    const downloadResult = await cloud.downloadFile({
      fileID: fileID
    })
    
    if (!downloadResult.buffer) {
      throw new Error('图片文件下载失败')
    }
    
    // 2. 将图片转换为base64
    const imageBase64 = downloadResult.buffer.toString('base64')
    console.log('图片转换完成，大小:', imageBase64.length)
    
    // 3. 调用AI服务进行分析
    const analysisResult = await callAIService(imageBase64)
    
    // 4. 保存分析结果到数据库
    const saveResult = await db.collection('analysis_records').add({
      data: {
        openid: openid,
        fileID: fileID,
        result: analysisResult,
        createTime: new Date(),
        updateTime: new Date()
      }
    })
    
    console.log('分析结果已保存:', saveResult._id)
    
    return {
      success: true,
      data: {
        ...analysisResult,
        recordId: saveResult._id
      }
    }
    
  } catch (error) {
    console.error('佛珠分析失败:', error)
    throw error
  }
}

/**
 * 调用AI服务进行图片分析
 */
async function callAIService(imageBase64) {
  const axios = require('axios')
  
  // 从环境变量获取AI服务配置
  const AI_API_KEY = process.env.AI_API_KEY
  const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions'
  const AI_MODEL = process.env.AI_MODEL || 'gpt-4-vision-preview'
  
  if (!AI_API_KEY) {
    throw new Error('AI服务API密钥未配置')
  }
  
  try {
    console.log('调用AI服务进行分析...')
    
    const prompt = `请作为专业的佛珠鉴赏师，对这张佛珠图片进行详细分析。请从以下几个方面进行评估：

1. 材质识别：判断佛珠的材质类型（如紫檀、沉香、菩提、玛瑙等）
2. 工艺评估：分析制作工艺、抛光程度、雕刻细节等
3. 品质等级：根据材质、工艺、完整度等因素评定品质等级
4. 文化价值：介绍该类佛珠的文化背景和寓意
5. 保养建议：提供专业的保养和使用建议
6. 市场参考：给出大致的市场价值范围

请以JSON格式返回分析结果，包含以下字段：
{
  "material": "材质名称",
  "materialDescription": "材质详细描述",
  "craftsmanship": "工艺评估",
  "quality": "品质等级(优秀/良好/一般/较差)",
  "culturalValue": "文化价值描述",
  "careInstructions": "保养建议",
  "marketValue": "市场价值范围",
  "confidence": "识别置信度(0-100)",
  "summary": "总体评价"
}`

    const requestData = {
      model: AI_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    }
    
    const response = await axios.post(AI_API_URL, requestData, {
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30秒超时
    })
    
    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('AI服务返回数据格式错误')
    }
    
    const aiResponse = response.data.choices[0].message.content
    console.log('AI分析完成:', aiResponse.substring(0, 200) + '...')
    
    // 尝试解析JSON响应
    let analysisResult
    try {
      // 提取JSON部分（去除可能的markdown格式）
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('无法从AI响应中提取JSON数据')
      }
    } catch (parseError) {
      console.warn('JSON解析失败，使用文本格式:', parseError.message)
      // 如果JSON解析失败，返回文本格式的结果
      analysisResult = {
        material: "未知",
        materialDescription: aiResponse,
        craftsmanship: "需要进一步分析",
        quality: "待评估",
        culturalValue: "请参考详细描述",
        careInstructions: "请咨询专业人士",
        marketValue: "需要专业评估",
        confidence: 70,
        summary: aiResponse.substring(0, 200) + "..."
      }
    }
    
    return analysisResult
    
  } catch (error) {
    console.error('AI服务调用失败:', error)
    
    if (error.response) {
      console.error('AI服务响应错误:', error.response.status, error.response.data)
      throw new Error(`AI服务错误: ${error.response.status} - ${error.response.data?.error?.message || '未知错误'}`)
    } else if (error.request) {
      throw new Error('AI服务网络连接失败')
    } else {
      throw new Error(`AI服务调用异常: ${error.message}`)
    }
  }
}

/**
 * 获取用户的分析历史记录
 */
async function getAnalysisHistory(openid, limit = 20) {
  try {
    const result = await db.collection('analysis_records')
      .where({
        openid: openid
      })
      .orderBy('createTime', 'desc')
      .limit(limit)
      .get()
    
    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('获取历史记录失败:', error)
    throw new Error('获取历史记录失败')
  }
}

/**
 * 保存分析结果
 */
async function saveAnalysisResult(data, openid) {
  try {
    const result = await db.collection('analysis_records').add({
      data: {
        ...data,
        openid: openid,
        createTime: new Date(),
        updateTime: new Date()
      }
    })
    
    return {
      success: true,
      data: {
        recordId: result._id
      }
    }
  } catch (error) {
    console.error('保存分析结果失败:', error)
    throw new Error('保存分析结果失败')
  }
}