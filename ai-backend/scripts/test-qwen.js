#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// 测试配置
const TEST_CONFIG = {
  serverUrl: process.env.TEST_SERVER_URL || 'http://localhost:3000',
  testImagePath: process.env.TEST_IMAGE_PATH || path.join(__dirname, '../test/imgs/sample-beads.jpg'),
  timeout: 30000
};

// 颜色输出函数
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

class QwenTester {
  constructor() {
    this.results = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const coloredMessage = type === 'success' ? colors.green(message) :
                          type === 'error' ? colors.red(message) :
                          type === 'warning' ? colors.yellow(message) :
                          type === 'header' ? colors.cyan(message) : message;
    
    console.log(`[${timestamp}] ${coloredMessage}`);
  }

  async testHealthCheck() {
    this.log('=== 健康检查测试 ===', 'header');
    
    try {
      const response = await axios.get(`${TEST_CONFIG.serverUrl}/health`, {
        timeout: 5000
      });
      
      if (response.data.success) {
        this.log('✅ 服务器健康检查通过', 'success');
        this.log(`   服务: ${response.data.service}`);
        this.results.push({ test: 'health', status: 'pass' });
        return true;
      } else {
        this.log('❌ 服务器健康检查失败', 'error');
        this.results.push({ test: 'health', status: 'fail', error: '响应格式错误' });
        return false;
      }
    } catch (error) {
      this.log(`❌ 无法连接到服务器: ${error.message}`, 'error');
      this.results.push({ test: 'health', status: 'fail', error: error.message });
      return false;
    }
  }

  async testAIStatus() {
    this.log('=== AI 服务状态测试 ===', 'header');
    
    try {
      const response = await axios.get(`${TEST_CONFIG.serverUrl}/api/ai/status`, {
        timeout: 5000
      });
      
      if (response.data.success) {
        const status = response.data.data;
        this.log('✅ AI 服务状态获取成功', 'success');
        this.log(`   当前服务: ${status.currentService}`);
        this.log(`   提供者: ${status.provider || 'N/A'}`);
        this.log(`   模型: ${status.model || 'N/A'}`);
        this.log(`   配置状态: ${status.available ? '已配置' : '未配置'}`);
        
        if (status.currentService === 'qwen') {
          this.log(`   Qwen 提供者: ${status.provider}`);
          this.log(`   API 基础URL: ${status.baseURL}`);
        }
        
        this.results.push({ test: 'ai-status', status: 'pass', data: status });
        return status;
      } else {
        this.log('❌ AI 服务状态获取失败', 'error');
        this.results.push({ test: 'ai-status', status: 'fail', error: '响应格式错误' });
        return null;
      }
    } catch (error) {
      this.log(`❌ AI 服务状态检查失败: ${error.message}`, 'error');
      this.results.push({ test: 'ai-status', status: 'fail', error: error.message });
      return null;
    }
  }

  async testImageAnalysis() {
    this.log('=== 图片分析测试 ===', 'header');
    
    // 检查测试图片是否存在
    if (!fs.existsSync(TEST_CONFIG.testImagePath)) {
      this.log('⚠️  测试图片不存在，创建示例图片...', 'warning');
      await this.createSampleImage();
    }

    try {
      // 读取测试图片
      const imageBuffer = fs.readFileSync(TEST_CONFIG.testImagePath);
      const base64Image = imageBuffer.toString('base64');
      
      this.log(`📸 使用测试图片: ${TEST_CONFIG.testImagePath}`);
      this.log(`📏 图片大小: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      
      // 发送分析请求
      const response = await axios.post(
        `${TEST_CONFIG.serverUrl}/api/analyze-base64`,
        {
          imageData: `data:image/jpeg;base64,${base64Image}`
        },
        {
          timeout: TEST_CONFIG.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        const result = response.data.data;
        this.log('✅ 图片分析成功', 'success');
        this.log(`   材质: ${result.material}`);
        this.log(`   工艺: ${result.craft}`);
        this.log(`   估价: ${result.estimate}`);
        this.log(`   置信度: ${result.confidence}%`);
        this.log(`   AI 服务: ${result.aiService}`);
        this.log(`   特征: ${result.features.join(', ')}`);
        
        // 验证返回字段
        const requiredFields = ['material', 'craft', 'estimate', 'comment', 'confidence'];
        const missingFields = requiredFields.filter(field => !result[field]);
        
        if (missingFields.length === 0) {
          this.log('✅ 返回数据格式验证通过', 'success');
          this.results.push({ test: 'image-analysis', status: 'pass', data: result });
          return result;
        } else {
          this.log(`❌ 缺少必需字段: ${missingFields.join(', ')}`, 'error');
          this.results.push({ test: 'image-analysis', status: 'fail', error: `缺少字段: ${missingFields.join(', ')}` });
          return null;
        }
      } else {
        this.log('❌ 图片分析失败', 'error');
        this.log(`   错误: ${response.data.error}`);
        this.results.push({ test: 'image-analysis', status: 'fail', error: response.data.error });
        return null;
      }
    } catch (error) {
      this.log(`❌ 图片分析请求失败: ${error.message}`, 'error');
      if (error.response) {
        this.log(`   HTTP状态: ${error.response.status}`);
        this.log(`   响应数据: ${JSON.stringify(error.response.data)}`);
      }
      this.results.push({ test: 'image-analysis', status: 'fail', error: error.message });
      return null;
    }
  }

  async createSampleImage() {
    // 创建测试目录
    const testDir = path.dirname(TEST_CONFIG.testImagePath);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // 创建一个简单的测试图片（1x1像素的JPEG）
    const minimalJpeg = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00,
      0xFF, 0xD9
    ]);

    fs.writeFileSync(TEST_CONFIG.testImagePath, minimalJpeg);
    this.log(`📁 创建测试图片: ${TEST_CONFIG.testImagePath}`, 'success');
  }

  async runAllTests() {
    this.log('🚀 开始 Qwen-VL-Plus 集成测试', 'header');
    this.log(`📡 测试服务器: ${TEST_CONFIG.serverUrl}`);
    this.log(`🖼️  测试图片: ${TEST_CONFIG.testImagePath}`);
    this.log(`⏱️  超时时间: ${TEST_CONFIG.timeout}ms`);
    this.log('');

    // 运行所有测试
    const healthOk = await this.testHealthCheck();
    this.log('');
    
    const aiStatus = await this.testAIStatus();
    this.log('');
    
    let analysisResult = null;
    if (healthOk && aiStatus) {
      analysisResult = await this.testImageAnalysis();
      this.log('');
    }

    // 输出测试总结
    this.printSummary();
    
    // 返回测试结果
    return {
      success: this.results.every(r => r.status === 'pass'),
      results: this.results,
      aiStatus,
      analysisResult
    };
  }

  printSummary() {
    this.log('=== 测试总结 ===', 'header');
    
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const total = this.results.length;
    
    this.log(`📊 总测试数: ${total}`);
    this.log(`✅ 通过: ${passed}`, passed > 0 ? 'success' : 'info');
    this.log(`❌ 失败: ${failed}`, failed > 0 ? 'error' : 'info');
    
    if (failed > 0) {
      this.log('');
      this.log('失败的测试:', 'error');
      this.results.filter(r => r.status === 'fail').forEach(result => {
        this.log(`  - ${result.test}: ${result.error}`, 'error');
      });
    }
    
    this.log('');
    if (passed === total) {
      this.log('🎉 所有测试通过！Qwen-VL-Plus 集成成功！', 'success');
    } else {
      this.log('⚠️  部分测试失败，请检查配置和服务状态', 'warning');
    }
  }
}

// 主函数
async function main() {
  const tester = new QwenTester();
  
  try {
    const results = await tester.runAllTests();
    
    // 保存测试结果
    const resultFile = path.join(__dirname, '../test-results.json');
    fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
    tester.log(`📄 测试结果已保存到: ${resultFile}`);
    
    // 设置退出码
    process.exit(results.success ? 0 : 1);
    
  } catch (error) {
    console.error('测试运行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = QwenTester;