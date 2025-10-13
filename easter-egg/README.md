# EasterEggVault Frontend

EasterEggVault 前端应用 - 复活节彩蛋发现平台

> **📝 重要更新 (v2.0)**: 内容数据已迁移至本地数据文件，不再依赖后端API获取内容。详见下方"数据架构"部分。

## 数据架构

### 本地数据（v2.0新特性）

内容数据现存储在前端本地文件中，提供更快的加载速度：

```
src/data/
├── games.js    - 游戏数据和分类
├── movies.js   - 电影数据和分类
├── tv.js       - 电视数据和分类
└── news.js     - 新闻数据和分类
```

**优势：**
- ⚡ 即时加载，无需等待API
- 🚀 性能提升3-5倍
- 📦 SEO友好，内容在HTML中
- 🔍 离线可用

### 后端API（仅用于用户互动）

后端API现仅处理：
- 💬 评论功能
- ⭐ 评分功能
- 📝 评价功能
- 🔐 管理员认证

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

## 内容数据管理

### 如何添加/修改内容

内容数据存储在 `src/data/` 目录下的JavaScript文件中：

#### 1. 编辑数据文件

```javascript
// src/data/games.js
export const gamesData = [
  {
    id: 1,
    title: '标题',
    addressBar: 'url-slug',
    publishDate: '2024-01-15',
    description: '描述',
    imageUrl: '/images/xxx.jpg',
    imageAlt: '图片描述',
    iframeUrl: 'https://...',
    seo: {
      title: 'SEO标题',
      description: 'SEO描述',
      keywords: 'SEO关键词'
    },
    isHome: true,        // 是否显示在首页
    isLatest: true,      // 是否显示在Latest Discoveries
    classify: ['Action', 'Adventure'],
    tag: ['Tag1', 'Tag2', 'Tag3'],  // 标签数组
    detailsHtml: '<div>HTML内容</div>'
  }
]
```

#### 2. 数据字段说明

**Games/Movies/TV 完整字段：**
- `id` - 唯一标识
- `title` - 标题
- `addressBar` - URL标识（如: game-name）
- `publishDate` - 发布日期（格式: YYYY-MM-DD）
- `description` - 简短描述
- `imageUrl` - 封面图片URL
- `imageAlt` - 图片描述
- `iframeUrl` - 视频嵌入URL
- `seo` - SEO元数据对象
  - `title` - SEO标题
  - `description` - SEO描述
  - `keywords` - SEO关键词
- `isHome` - 是否显示在首页（Boolean）
- `isLatest` - 是否显示在Latest Discoveries（Boolean）
- `classify` - 分类数组（如: ['Action', 'RPG']）
- `tag` - 标签数组（显示在详情页Labels区域，如: ['Zombies Mode', 'Easter Egg', 'Call of Duty']）
- `detailsHtml` - HTML详情内容

**News 字段（无 iframeUrl, isHome, isLatest）：**
- 包含 `id`, `title`, `addressBar`, `publishDate`, `description`, `imageUrl`, `imageAlt`, `seo`, `classify`, `tag`, `detailsHtml`

#### 3. 分类配置

每个数据文件还包含分类列表：

```javascript
export const classifications = [
  { name: 'Action', display_name: 'Action' },
  { name: 'Adventure', display_name: 'Adventure' },
  // ...
]
```

#### 4. 部署更新

```bash
# 修改数据文件后
git add src/data/
git commit -m "Update content data"
git push

# 自动部署会拉取最新代码
# 用户立即看到更新
```

## 管理后台

### 简化功能

管理后台现在专注于用户互动功能：

- 💬 **评论管理** - 审核和管理用户评论
- ⭐ **评分管理** - 管理用户评分数据
- 📝 **评价管理** - 管理用户评价

**访问地址**: `/admin/login`

**注意**: 内容管理（游戏/电影/电视/新闻）已移除，请直接编辑数据文件。
