# 动态站点地图功能

## 概述

本项目实现了真正的动态站点地图生成功能，每次访问时都会实时从数据库获取最新数据并生成站点地图XML。

## 功能特性

### 1. 动态站点地图生成
- **端点**: `GET /sitemap.xml`
- **功能**: 实时从数据库获取所有内容并生成站点地图
- **缓存**: 30分钟浏览器缓存
- **格式**: 标准XML站点地图格式

### 2. 站点地图统计
- **端点**: `GET /sitemap/stats`
- **功能**: 获取站点地图的统计信息
- **返回**: JSON格式的统计数据

### 3. 动态robots.txt
- **端点**: `GET /robots.txt`
- **功能**: 动态生成robots.txt，包含站点地图链接
- **缓存**: 24小时浏览器缓存

## 使用方法

### 启动服务器
```bash
cd easter-egg-API
npm start
```

### 访问动态站点地图
```
http://localhost:3000/sitemap.xml
```

### 查看统计信息
```
http://localhost:3000/sitemap/stats
```

### 查看robots.txt
```
http://localhost:3000/robots.txt
```

## 测试功能

运行测试脚本验证动态站点地图功能：

```bash
npm run test-sitemap
```

## 技术实现

### 数据获取
- 并行查询所有数据表（games, movies, tv, news）
- 只获取必要字段以提高性能
- 按发布日期排序

### 性能优化
- 并行数据库查询
- 30分钟HTTP缓存
- ETag支持
- 错误处理和降级

### 路由结构
```
静态路由 (14个):
- / (首页)
- /games, /movies, /tv, /news (分类页)
- /search, /popular (功能页)
- /privacy, /terms, /copyright (法律页)
- /about, /contact (信息页)

动态路由 (根据数据库内容):
- /games/{addressBar} (游戏详情页)
- /movies/{addressBar} (电影详情页)
- /tv/{addressBar} (电视详情页)
- /news/{addressBar} (新闻详情页)
```

## 配置

### 环境变量
```env
SITE_URL=https://eastereggvault.com  # 网站URL
```

### 数据库要求
- 所有内容必须有有效的 `address_bar` 字段
- 建议设置 `updated_at` 和 `publish_date` 字段

## 与静态站点地图的区别

| 特性 | 静态站点地图 | 动态站点地图 |
|------|-------------|-------------|
| 生成方式 | 预生成文件 | 实时生成 |
| 数据更新 | 需要重新生成 | 自动更新 |
| 性能 | 更快 | 稍慢但可接受 |
| 维护 | 需要手动运行脚本 | 无需维护 |
| 缓存 | 文件系统缓存 | HTTP缓存 |

## 搜索引擎优化

1. **自动发现**: robots.txt中包含站点地图链接
2. **实时更新**: 内容更新后立即反映在站点地图中
3. **标准格式**: 符合搜索引擎标准
4. **完整覆盖**: 包含所有公开页面

## 监控和调试

### 日志输出
服务器会输出详细的生成日志：
```
🗺️  Generating dynamic sitemap...
📊 Fetching all data for sitemap...
📈 Data fetched: Games(6), Movies(6), TV(6), News(2)
✅ Dynamic sitemap generated in 45ms: 34 total routes (14 static + 20 dynamic)
```

### 错误处理
- 数据库连接错误
- 查询超时
- 数据格式错误
- 网络错误

## 部署注意事项

1. **生产环境**: 确保 `SITE_URL` 环境变量正确设置
2. **数据库**: 确保数据库连接稳定
3. **缓存**: 合理设置缓存时间
4. **监控**: 监控站点地图生成性能

## 扩展功能

### 可能的增强
1. **分页站点地图**: 当内容过多时自动分页
2. **图片站点地图**: 包含图片信息
3. **视频站点地图**: 包含视频信息
4. **多语言支持**: 支持多语言站点地图
5. **压缩**: 支持gzip压缩

### 自定义配置
可以通过修改 `routes/sitemap.js` 来自定义：
- 静态路由配置
- 优先级设置
- 更新频率
- 缓存时间
