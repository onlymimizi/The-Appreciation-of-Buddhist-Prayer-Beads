@echo off
chcp 65001 >nul
echo 佛珠鉴赏助手 - 创建完整云函数结构
echo ========================================
echo.

REM 获取当前脚本所在目录
set SCRIPT_DIR=%~dp0

REM 检查源文件是否存在
if not exist "%SCRIPT_DIR%cloudfunctions\appraiseBeads" (
    echo ❌ 错误：找不到源云函数代码目录
    echo 请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

echo ✅ 找到源云函数代码目录
echo.

REM 提示用户输入微信开发者工具项目路径
echo 请输入您的微信开发者工具项目路径：
echo 提示：这是您导入 miniprogram 文件夹后的项目根目录
echo 例如：C:\Users\用户名\WeChatProjects\佛珠鉴赏助手
echo.
set /p TARGET_PROJECT="项目路径: "

REM 去除路径两端的引号
set TARGET_PROJECT=%TARGET_PROJECT:"=%

REM 检查目标项目目录是否存在
if not exist "%TARGET_PROJECT%" (
    echo ❌ 错误：目标项目目录不存在：%TARGET_PROJECT%
    echo 请检查路径是否正确
    pause
    exit /b 1
)

REM 检查是否存在 miniprogram 目录（确认是正确的微信小程序项目）
if not exist "%TARGET_PROJECT%\miniprogram" (
    echo ❌ 错误：这不是一个有效的微信小程序项目目录
    echo 请确保选择的是包含 miniprogram 文件夹的项目根目录
    pause
    exit /b 1
)

echo ✅ 找到有效的微信小程序项目目录
echo.

REM 创建云函数目录结构
echo 📁 创建云函数目录结构...
if not exist "%TARGET_PROJECT%\cloudfunctions" (
    mkdir "%TARGET_PROJECT%\cloudfunctions"
    echo   创建 cloudfunctions 目录
)

if not exist "%TARGET_PROJECT%\cloudfunctions\appraiseBeads" (
    mkdir "%TARGET_PROJECT%\cloudfunctions\appraiseBeads"
    echo   创建 appraiseBeads 目录
)

REM 复制云函数文件
echo.
echo 📄 复制云函数文件...
copy "%SCRIPT_DIR%cloudfunctions\appraiseBeads\index.js" "%TARGET_PROJECT%\cloudfunctions\appraiseBeads\index.js" /Y >nul
if %errorlevel% equ 0 (
    echo   ✅ index.js 复制成功
) else (
    echo   ❌ index.js 复制失败
)

copy "%SCRIPT_DIR%cloudfunctions\appraiseBeads\package.json" "%TARGET_PROJECT%\cloudfunctions\appraiseBeads\package.json" /Y >nul
if %errorlevel% equ 0 (
    echo   ✅ package.json 复制成功
) else (
    echo   ❌ package.json 复制失败
)

copy "%SCRIPT_DIR%cloudfunctions\appraiseBeads\config.json" "%TARGET_PROJECT%\cloudfunctions\appraiseBeads\config.json" /Y >nul
if %errorlevel% equ 0 (
    echo   ✅ config.json 复制成功
) else (
    echo   ❌ config.json 复制失败
)

REM 检查并更新 project.config.json
echo.
echo 🔧 检查项目配置...
if exist "%TARGET_PROJECT%\project.config.json" (
    echo   ✅ 找到 project.config.json
    echo   请手动检查是否包含 "cloudfunctionRoot": "cloudfunctions/"
) else (
    echo   ⚠️  未找到 project.config.json，创建基础配置...
    (
        echo {
        echo   "cloudfunctionRoot": "cloudfunctions/",
        echo   "miniprogramRoot": "miniprogram/",
        echo   "setting": {
        echo     "urlCheck": false,
        echo     "es6": true,
        echo     "enhance": true,
        echo     "postcss": true,
        echo     "minified": true,
        echo     "newFeature": false
        echo   }
        echo }
    ) > "%TARGET_PROJECT%\project.config.json"
    echo   ✅ 创建基础 project.config.json
)

echo.
echo 🎉 云函数结构创建完成！
echo.
echo 📁 创建的目录结构：
echo %TARGET_PROJECT%\
echo ├── miniprogram\          (小程序前端代码)
echo └── cloudfunctions\       (云函数代码)
echo     └── appraiseBeads\    (佛珠鉴赏云函数)
echo         ├── index.js      (主逻辑文件)
echo         ├── package.json  (依赖配置)
echo         └── config.json   (函数配置)
echo.
echo 🚀 下一步操作：
echo 1. 在微信开发者工具中刷新项目 (Ctrl+R 或 F5)
echo 2. 右键 appraiseBeads 文件夹 → 在终端中打开
echo 3. 执行：npm install
echo 4. 右键 appraiseBeads 文件夹 → 上传并部署：云端安装依赖
echo 5. 在云开发控制台配置环境变量 AI_API_KEY
echo.
echo 💡 如果微信开发者工具中看不到 cloudfunctions 目录：
echo    - 按 F5 刷新项目
echo    - 重启微信开发者工具
echo    - 检查 project.config.json 中的 cloudfunctionRoot 配置
echo.
pause