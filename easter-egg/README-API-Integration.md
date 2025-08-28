# 前端API集成说明

## 概述

前端已成功集成到后端API，实现了动态数据获取、搜索功能、状态管理等核心功能。

## 🚀 集成功能

### 1. API服务层
- **配置文件**: `src/config/api.js` - API基础配置和通用请求方法
- **服务层**: `src/services/api.js` - 封装所有API调用
- **状态管理**: `src/stores/easterEggs.js` - Pinia状态管理

### 2. 核心功能
- ✅ 动态数据获取（游戏、电影、电视、新闻）
- ✅ 实时搜索功能
- ✅ 分页和过滤
- ✅ 加载状态管理
- ✅ 错误处理和重试机制
- ✅ 响应式数据绑定

### 3. 页面集成
- **主页**: `HomeView.vue` - 集成首页数据和最新发现
- **搜索结果**: `SearchResultsView.vue` - 新的搜索结果页面
- **路由配置**: 添加了搜索路由

## 📁 文件结构

```
src/
├── config/
│   └── api.js              # API配置
├── services/
│   └── api.js              # API服务层
├── stores/
│   └── easterEggs.js       # 状态管理
├── views/
│   ├── HomeView.vue        # 主页（已集成）
│   └── SearchResultsView.vue # 搜索结果页
└── router/
    └── index.js            # 路由配置（已更新）
```

## 🔧 配置说明

### 环境变量配置

1. 复制环境配置示例文件：
```bash
cp env.example .env.development
```

2. 配置开发环境API地址：
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_VERSION=api
```

3. 生产环境配置（部署到Vercel后）：
```env
VITE_API_BASE_URL=https://your-vercel-domain.vercel.app
VITE_API_VERSION=api
```

## 🎯 使用方法

### 1. 启动开发环境

确保后端API服务器正在运行：
```bash
# 在 easter-egg-API 目录
npm run dev
```

启动前端开发服务器：
```bash
# 在 easter-egg 目录
npm run dev
```

### 2. 测试功能

- **首页数据**: 自动从API获取游戏、电影、电视数据
- **搜索功能**: 在首页搜索框输入关键词进行搜索
- **实时更新**: 数据实时从后端API获取

### 3. 状态管理

```javascript
import { useEasterEggsStore } from '@/stores/easterEggs.js'

const store = useEasterEggsStore()

// 获取游戏数据
await store.fetchGames()

// 搜索
await store.search('elden ring')

// 获取首页数据
await store.fetchHomeData()
```

## 🔍 API端点

前端已集成以下API端点：

- `GET /api/games` - 游戏数据
- `GET /api/movies` - 电影数据  
- `GET /api/tv` - 电视数据
- `GET /api/news` - 新闻数据
- `GET /api/search` - 搜索功能
- `GET /health` - 健康检查

## 🎨 用户界面特性

### 加载状态
- 全屏加载遮罩
- 分区域加载指示器
- 搜索中状态显示

### 错误处理
- 友好的错误提示
- 重试按钮
- 错误状态管理

### 响应式设计
- 移动端适配
- 流畅的动画效果
- 现代化的UI设计

## 🚀 部署准备

### 1. 环境配置
确保生产环境变量正确配置：
```env
VITE_API_BASE_URL=https://your-vercel-domain.vercel.app
```

### 2. 构建和部署
```bash
npm run build
```

### 3. Vercel部署
- 连接GitHub仓库
- 自动部署
- 环境变量配置

## 🔧 故障排除

### 常见问题

1. **API连接失败**
   - 检查后端服务器是否运行
   - 验证API地址配置
   - 检查CORS设置

2. **数据加载失败**
   - 查看浏览器控制台错误
   - 检查网络请求状态
   - 验证API响应格式

3. **搜索功能异常**
   - 检查搜索API端点
   - 验证搜索参数
   - 检查路由配置

### 调试技巧

- 使用Vue DevTools查看状态
- 检查网络请求面板
- 查看控制台日志

## 📚 技术栈

- **前端框架**: Vue 3 + Composition API
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **构建工具**: Vite
- **样式**: CSS3 + 响应式设计
- **HTTP客户端**: Fetch API

## 🤝 贡献指南

1. 遵循现有代码风格
2. 添加适当的错误处理
3. 更新相关文档
4. 测试所有功能

## 📞 支持

如有问题，请检查：
1. API服务器状态
2. 环境变量配置
3. 网络连接
4. 浏览器控制台错误

---

**注意**: 确保后端API服务器正在运行，前端才能正常工作！
