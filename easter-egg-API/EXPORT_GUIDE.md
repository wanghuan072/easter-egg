# 数据库导出到本地文件指南

## 📋 功能说明

这个脚本会从数据库中导出所有数据并生成前端本地数据文件。

## 🚀 使用方法

### 1. 确保数据库连接正常

检查 `.env` 文件，确保数据库配置正确：

```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### 2. 运行导出脚本

```bash
# 在 easter-egg-API 目录下运行
node export-to-local.js
```

### 3. 查看导出结果

脚本会自动生成/覆盖以下文件：
```
../easter-egg/src/data/games.js
../easter-egg/src/data/movies.js
../easter-egg/src/data/tv.js
../easter-egg/src/data/news.js
```

## 📊 导出内容

### 从数据库读取
```
egg_games   → games.js
egg_movies  → movies.js
egg_tv      → tv.js
egg_news    → news.js
```

### 字段映射

**数据库字段** → **本地数据字段**

```javascript
// 通用字段
id              → id
title           → title
address_bar     → addressBar
publish_date    → publishDate
description     → description
image_url       → imageUrl
image_alt       → imageAlt
iframe_url      → iframeUrl
seo_title       → seo.title
seo_description → seo.description
seo_keywords    → seo.keywords
classify        → classify (数组)
tag             → tag (数组)
details_html    → detailsHtml

// Games/Movies/TV 特有
is_home         → isHome
is_latest       → isLatest

// News 不包含
// - iframeUrl
// - isHome
// - isLatest
```

### 自动生成分类列表

脚本会自动从数据中提取所有唯一的分类值，生成 classifications 数组：

```javascript
export const classifications = [
  { name: 'Action', display_name: 'Action' },
  { name: 'Adventure', display_name: 'Adventure' },
  // ...
]
```

## ⚙️ 脚本功能

### 数据转换
- ✅ 自动转换字段名（下划线 → 驼峰）
- ✅ 自动提取 SEO 字段为对象
- ✅ 处理 tag 字段（字符串 → 数组）
- ✅ 过滤空值和无效数据
- ✅ 按发布日期降序排序

### 分类提取
- ✅ 自动提取所有唯一分类
- ✅ 去重和排序
- ✅ 生成对象格式（name + display_name）

### 文件生成
- ✅ 自动创建/覆盖目标文件
- ✅ 格式化输出（2空格缩进）
- ✅ 添加注释说明
- ✅ 符合ESLint规范

## 📝 输出示例

### games.js
```javascript
// 游戏分类列表
export const classifications = [
  { name: 'Action', display_name: 'Action' },
  { name: 'Adventure', display_name: 'Adventure' }
]

// 游戏数据
export const gamesData = [
  {
    id: 1,
    title: 'Game Title',
    addressBar: 'game-slug',
    publishDate: '2024-01-15',
    description: 'Description...',
    imageUrl: '/images/game.jpg',
    imageAlt: 'Alt text',
    iframeUrl: 'https://...',
    seo: {
      title: 'SEO Title',
      description: 'SEO Description',
      keywords: 'keywords'
    },
    isHome: true,
    isLatest: true,
    classify: ['Action', 'RPG'],
    tag: ['Tag1', 'Tag2'],
    detailsHtml: '<div>...</div>'
  }
]
```

## ⚠️ 注意事项

### 备份现有数据
在运行脚本前，建议备份当前的数据文件：
```bash
cd ../easter-egg/src/data
cp games.js games.js.backup
cp movies.js movies.js.backup
cp tv.js tv.js.backup
cp news.js news.js.backup
```

### 数据验证
导出后，请检查：
- ✅ 所有必需字段都存在
- ✅ addressBar 唯一且有效
- ✅ publishDate 格式正确
- ✅ seo 对象完整
- ✅ tag 和 classify 都是数组
- ✅ detailsHtml 格式正确

### 文件大小
- 如果数据量很大（>1000条），考虑分批导出
- 建议单个文件不超过 2MB

## 🔧 故障排除

### 问题：数据库连接失败
**解决**：
1. 检查 `.env` 文件中的 `DATABASE_URL`
2. 确认数据库服务器可访问
3. 检查网络连接

### 问题：表不存在
**解决**：
1. 确认表名正确（egg_games, egg_movies, egg_tv, egg_news）
2. 检查数据库是否已迁移
3. 运行数据库迁移脚本

### 问题：导出文件为空
**解决**：
1. 检查数据库表中是否有数据
2. 查看控制台是否有错误信息
3. 确认文件路径正确

### 问题：字段格式错误
**解决**：
1. 检查数据库中的数据格式
2. 确认 classify 字段是 PostgreSQL 数组类型
3. 确认 tag 字段存在（可能需要先添加此列）

## 📚 高级用法

### 只导出特定类型
修改脚本，注释掉不需要导出的部分：

```javascript
// 只导出游戏数据
const gamesResult = await query('SELECT * FROM egg_games ORDER BY publish_date DESC');
// const moviesResult = ...
// const tvResult = ...
// const newsResult = ...
```

### 添加过滤条件
导出特定条件的数据：

```javascript
// 只导出首页数据
const gamesResult = await query('SELECT * FROM egg_games WHERE is_home = true ORDER BY publish_date DESC');

// 只导出最新数据
const gamesResult = await query('SELECT * FROM egg_games WHERE is_latest = true ORDER BY publish_date DESC');

// 按日期范围导出
const gamesResult = await query(`
  SELECT * FROM egg_games 
  WHERE publish_date >= '2024-01-01' 
  ORDER BY publish_date DESC
`);
```

### 自定义输出路径
修改 `frontendDataPath` 变量：

```javascript
const frontendDataPath = path.join(__dirname, 'custom/path/to/data');
```

## 📋 检查清单

导出完成后，请验证：

- [ ] 所有4个文件都已生成
- [ ] 文件大小合理（不为空）
- [ ] JSON 格式正确（无语法错误）
- [ ] classifications 数组已生成
- [ ] 数据条数与数据库一致
- [ ] addressBar 字段都存在且唯一
- [ ] seo 对象格式正确
- [ ] tag 和 classify 都是数组
- [ ] 前端应用可以正常加载数据

## 🔄 定期导出

建议建立定期导出流程：

1. **每次内容更新后**
   - 在管理后台修改数据
   - 运行导出脚本
   - 提交到 Git
   - 部署前端

2. **定期备份**
   - 每周运行一次导出
   - 保存历史版本
   - 便于回滚

3. **自动化**
   - 可以设置定时任务
   - 或在部署前自动运行

---

**版本**: v1.0
**作者**: EasterEggVault Team
**最后更新**: 2024

