const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const aiService = require('./services/aiService');
const { validateImage, handleError } = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3000;

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 10, // 限制每个IP 1分钟内最多10个AI请求
  message: {
    error: 'AI分析请求过于频繁，请稍后再试'
  }
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 配置multer用于文件上传
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型，请上传 JPG、PNG 或 WebP 格式的图片'));
    }
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '佛珠鉴赏 AI 服务正常运行',
    timestamp: new Date().toISOString(),
    service: process.env.AI_SERVICE || 'openai'
  });
});

// AI 服务状态检查
app.get('/api/ai/status', (req, res) => {
  try {
    const status = aiService.getServiceStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('获取AI服务状态失败:', error);
    res.status(500).json({
      success: false,
      error: '无法获取AI服务状态',
      details: error.message
    });
  }
});

// AI 分析接口 - 支持图片上传
app.post('/api/analyze', aiLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请上传图片文件'
      });
    }

    // 验证图片
    const validation = await validateImage(req.file.buffer);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // 压缩图片
    const compressedImage = await sharp(req.file.buffer)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // 调用AI服务分析
    const result = await aiService.analyzeBeads(compressedImage);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('AI分析错误:', error);
    handleError(res, error);
  }
});

// AI 分析接口 - 支持base64图片
app.post('/api/analyze-base64', aiLimiter, async (req, res) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({
        success: false,
        error: '请提供图片数据'
      });
    }

    // 解析base64图片
    let imageBuffer;
    try {
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: '无效的图片数据格式'
      });
    }

    // 验证图片
    const validation = await validateImage(imageBuffer);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // 压缩图片
    const compressedImage = await sharp(imageBuffer)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // 调用AI服务分析
    const result = await aiService.analyzeBeads(compressedImage);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('AI分析错误:', error);
    handleError(res, error);
  }
});

// 获取支持的材质列表
app.get('/api/materials', (req, res) => {
  const materials = [
    {
      name: '小叶紫檀',
      description: '帝王之木，质地坚硬，纹理细腻',
      priceRange: [800, 3000],
      features: ['密度高', '油性足', '香味淡雅', '纹理细腻']
    },
    {
      name: '海南黄花梨',
      description: '木中黄金，纹理变化多端，香味浓郁持久',
      priceRange: [2000, 8000],
      features: ['纹理丰富', '香味浓郁', '材质坚硬', '颜色金黄']
    },
    {
      name: '金刚菩提',
      description: '坚硬如金刚，寓意坚不可摧的智慧',
      priceRange: [200, 1000],
      features: ['质地坚硬', '纹路清晰', '盘玩变色', '寓意吉祥']
    },
    {
      name: '星月菩提',
      description: '表面布满星星点点，中间有月亮般的圆点',
      priceRange: [150, 600],
      features: ['密度适中', '星点均匀', '盘玩变化', '价格适中']
    },
    {
      name: '南红玛瑙',
      description: '色如朝霞，质如美玉，中国独有的宝石',
      priceRange: [500, 2500],
      features: ['颜色鲜艳', '质地温润', '透明度好', '收藏价值高']
    },
    {
      name: '沉香木',
      description: '香中之王，具有独特的香味和药用价值',
      priceRange: [1000, 5000],
      features: ['香味独特', '质地坚实', '药用价值', '稀有珍贵']
    }
  ];

  res.json({
    success: true,
    data: materials
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: '文件大小超出限制，请上传小于5MB的图片'
      });
    }
  }
  
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    error: '服务器内部错误'
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 佛珠鉴赏 AI 后端服务已启动`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🤖 AI服务: ${process.env.AI_SERVICE || 'openai'}`);
  console.log(`🔍 分析接口: POST http://localhost:${PORT}/api/analyze`);
  console.log(`📚 材质接口: GET http://localhost:${PORT}/api/materials`);
  console.log(`❤️  健康检查: GET http://localhost:${PORT}/health`);
  console.log(`\n请确保已配置 .env 文件中的 API 密钥`);
});

module.exports = app;