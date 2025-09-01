# EasterEggVault Frontend

EasterEggVault 前端应用 - 复活节彩蛋发现平台

## 环境配置

### 开发环境
```sh
# 复制开发环境配置
cp env.development.example .env.development

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产环境
```sh
# 复制生产环境配置
cp env.production.example .env.production

# 构建生产版本
npm run build
```

## 环境变量说明

- `VITE_API_URL`: API服务器地址
- `VITE_API_VERSION`: API版本
- `VITE_APP_NAME`: 应用名称
- `VITE_APP_VERSION`: 应用版本
- `VITE_ENABLE_DEBUG`: 调试模式开关
- `VITE_ENABLE_ANALYTICS`: 分析功能开关
- `VITE_SITE_URL`: 网站URL
- `VITE_SITEMAP_URL`: 站点地图URL

## 开发命令

```sh
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 格式化代码
npm run format
```
