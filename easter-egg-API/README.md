# EasterEggVault API

Backend API for the EasterEggVault platform - 专注于用户互动功能

> **📝 重要更新 (v2.0)**: 内容数据已迁移至前端本地文件，后端API现仅处理评论评分功能。

## Features

- **RESTful API** with Express.js
- **评论系统** - 用户评论管理
- **评分系统** - 用户评分功能
- **认证系统** - JWT管理员认证
- **CORS enabled** for frontend integration
- **Rate limiting** and security middleware
- **Ready for Vercel deployment** with Neon database

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### 认证系统
- `POST /api/auth/login` - 管理员登录
- `POST /api/auth/logout` - 管理员登出

### 评论系统
- `GET /api/comments` - 获取评论列表
- `GET /api/comments?contentId=&contentType=` - 获取特定内容的评论
- `POST /api/comments` - 创建评论
- `PUT /api/comments/:id` - 更新评论
- `DELETE /api/comments/:id` - 删除评论

### 评分系统
- `GET /api/ratings` - 获取评分列表
- `GET /api/ratings?contentId=&contentType=` - 获取特定内容的评分
- `POST /api/ratings` - 提交评分
- `PUT /api/ratings/:id` - 更新评分

### 评价系统
- `GET /api/reviews` - 获取评价列表
- `POST /api/reviews` - 创建评价
- `PUT /api/reviews/:id` - 更新评价
- `DELETE /api/reviews/:id` - 删除评价

---

> **⚠️ 已禁用的路由**: 内容路由（games/movies/tv/news/search/categories）已禁用，前端使用本地数据。

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Search & Filtering
- `search` - Search in title and description
- `classify` - Filter by classifications (comma-separated)
- `mediaType` - Filter by media type (games, movies, tv)

### Examples

```bash
# Search for action games
GET /api/games?search=action&classify=Action&page=1&limit=5

# Get latest movies
GET /api/movies/latest?limit=10

# Global search for "Marvel"
GET /api/search?q=Marvel&mediaType=movies

# Get search suggestions
GET /api/search/suggestions?q=elden&limit=5
```

## Environment Variables

Create a `.env` file based on `env.example`:

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# CORS配置
CORS_ORIGIN_DEV=http://localhost:5173
CORS_ORIGIN_PROD=https://eastereggvault.com/

# 速率限制
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=500

# 数据库配置 (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=30d
```

## Development

### Scripts

```bash
# Development with hot reload
npm run dev

# Production build
npm start

# 导出数据库数据到前端本地文件
npm run export
```

## 数据导出功能

### 快速导出

将数据库中的所有数据导出到前端本地文件：

```bash
npm run export
```

### 导出内容
脚本会自动：
- ✅ 连接数据库读取所有数据
- ✅ 转换字段格式（数据库 → 本地）
- ✅ 提取并生成分类列表
- ✅ 生成4个数据文件（games/movies/tv/news）
- ✅ 覆盖前端 `src/data/` 目录下的文件

### 字段映射
```
数据库           →  本地数据
address_bar      →  addressBar
publish_date     →  publishDate
image_url        →  imageUrl
image_alt        →  imageAlt
iframe_url       →  iframeUrl
seo_title        →  seo.title
seo_description  →  seo.description
seo_keywords     →  seo.keywords
is_home          →  isHome
is_latest        →  isLatest
classify         →  classify (array)
tag              →  tag (array)
details_html     →  detailsHtml
```

**详细使用说明**: 查看 `EXPORT_GUIDE.md`

### Project Structure

```
easter-egg-API/
├── config/          # Database configuration
├── routes/          # API route handlers
├── scripts/         # Database migration and seeding
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## Deployment to Vercel

### 1. Prepare for Production

```bash
# Install production dependencies only
npm ci --only=production

# Build the project (if needed)
npm run build
```

### 2. Vercel Configuration

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 3. Environment Variables

Set these in Vercel dashboard:
- `DATABASE_URL` - Your Neon database connection string
- `NODE_ENV` - Set to "production"
- `CORS_ORIGIN` - Your frontend domain

### 4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Database Migration (Future)

When ready to migrate to Neon database:

```bash
# Run database migration
npm run db:migrate

# Seed with initial data
npm run db:seed
```

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the API endpoints
5. Submit a pull request

## License

MIT License - see LICENSE file for details
