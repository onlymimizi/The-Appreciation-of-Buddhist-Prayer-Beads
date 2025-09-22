@echo off
echo 佛珠鉴赏助手 - 云函数文件复制工具
echo =====================================
echo.

REM 设置源目录（我们准备的云函数代码）
set SOURCE_DIR=%~dp0cloudfunctions\appraiseBeads

REM 检查源目录是否存在
if not exist "%SOURCE_DIR%" (
    echo 错误：找不到源目录 %SOURCE_DIR%
    echo 请确保在正确的项目根目录运行此脚本
    pause
    exit /b 1
)

echo 找到源目录：%SOURCE_DIR%
echo.

REM 提示用户输入目标目录
echo 请输入您的微信开发者工具项目路径：
echo 例如：C:\Users\用户名\WeChatProjects\佛珠鉴赏助手
echo.
set /p TARGET_PROJECT="项目路径: "

REM 检查目标项目目录是否存在
if not exist "%TARGET_PROJECT%" (
    echo 错误：目标项目目录不存在：%TARGET_PROJECT%
    pause
    exit /b 1
)

REM 设置目标云函数目录
set TARGET_DIR=%TARGET_PROJECT%\cloudfunctions\appraiseBeads

REM 检查目标云函数目录是否存在
if not exist "%TARGET_DIR%" (
    echo 错误：目标云函数目录不存在：%TARGET_DIR%
    echo 请先在微信开发者工具中创建 appraiseBeads 云函数
    pause
    exit /b 1
)

echo 找到目标目录：%TARGET_DIR%
echo.

REM 复制文件
echo 正在复制云函数文件...
copy "%SOURCE_DIR%\index.js" "%TARGET_DIR%\index.js" /Y
copy "%SOURCE_DIR%\package.json" "%TARGET_DIR%\package.json" /Y
copy "%SOURCE_DIR%\config.json" "%TARGET_DIR%\config.json" /Y

echo.
echo ✅ 文件复制完成！
echo.
echo 复制的文件：
echo - index.js      (云函数主逻辑)
echo - package.json  (依赖配置)
echo - config.json   (云函数配置)
echo.
echo 下一步操作：
echo 1. 在微信开发者工具中右键 appraiseBeads 文件夹
echo 2. 选择 "在终端中打开"
echo 3. 执行：npm install
echo 4. 右键 appraiseBeads 文件夹，选择 "上传并部署：云端安装依赖"
echo.
pause