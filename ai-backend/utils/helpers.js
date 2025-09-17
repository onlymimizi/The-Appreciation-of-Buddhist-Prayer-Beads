const sharp = require('sharp');

/**
 * 验证图片文件
 * @param {Buffer} imageBuffer 图片缓冲区
 * @returns {Object} 验证结果
 */
async function validateImage(imageBuffer) {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    
    // 检查图片格式
    const allowedFormats = ['jpeg', 'png', 'webp'];
    if (!allowedFormats.includes(metadata.format)) {
      return {
        valid: false,
        error: '不支持的图片格式，请上传 JPG、PNG 或 WebP 格式的图片'
      };
    }

    // 检查图片尺寸
    if (metadata.width < 100 || metadata.height < 100) {
      return {
        valid: false,
        error: '图片尺寸过小，请上传至少 100x100 像素的图片'
      };
    }

    if (metadata.width > 4096 || metadata.height > 4096) {
      return {
        valid: false,
        error: '图片尺寸过大，请上传小于 4096x4096 像素的图片'
      };
    }

    return {
      valid: true,
      metadata
    };
  } catch (error) {
    return {
      valid: false,
      error: '无效的图片文件'
    };
  }
}

/**
 * 统一错误处理
 * @param {Object} res Express响应对象
 * @param {Error} error 错误对象
 */
function handleError(res, error) {
  console.error('处理错误:', error);

  // API限流错误
  if (error.message.includes('rate limit') || error.message.includes('quota')) {
    return res.status(429).json({
      success: false,
      error: 'API调用频率超限，请稍后再试'
    });
  }

  // API密钥错误
  if (error.message.includes('API密钥') || error.message.includes('unauthorized')) {
    return res.status(401).json({
      success: false,
      error: 'API密钥配置错误，请检查配置'
    });
  }

  // 网络超时错误
  if (error.message.includes('timeout') || error.code === 'ECONNABORTED') {
    return res.status(408).json({
      success: false,
      error: 'AI服务响应超时，请重试'
    });
  }

  // 图片相关错误
  if (error.message.includes('图片') || error.message.includes('image')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  // 默认服务器错误
  res.status(500).json({
    success: false,
    error: '服务暂时不可用，请稍后重试'
  });
}

/**
 * 生成唯一文件名
 * @param {string} originalName 原始文件名
 * @returns {string} 新文件名
 */
function generateFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const ext = originalName.split('.').pop();
  return `${timestamp}_${random}.${ext}`;
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 * @returns {string} 格式化后的大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  validateImage,
  handleError,
  generateFileName,
  formatFileSize
};