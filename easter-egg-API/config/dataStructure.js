// 统一的数据结构配置
// 确保前后端数据字段完全一致

export const DATA_STRUCTURE = {
  // 基础字段
  BASE_FIELDS: {
    id: 'id',                    // 唯一标识符
    title: 'title',              // 标题
    description: 'description',  // 描述
    publishDate: 'publish_date', // 发布日期
    isLatest: 'is_latest',       // 是否最新
    isHome: 'is_home',           // 是否首页显示
    label: 'label',              // 媒体类型标签 (GAME, MOVIE, TV, NEWS)
    classify: 'classify',        // 分类数组
    imageUrl: 'image_url',       // 图片URL
    imageAlt: 'image_alt',       // 图片alt文本
    addressBar: 'address_bar',   // 地址栏标识
    seoTitle: 'seo_title',       // SEO标题
    detailsHtml: 'details_html', // 详情HTML内容
    mediaType: 'media_type'      // 媒体类型 (games, movies, tv, news)
  },

  // 媒体类型常量
  MEDIA_TYPES: {
    GAMES: 'games',
    MOVIES: 'movies',
    TV: 'tv',
    NEWS: 'news'
  },

  // 标签常量
  LABELS: {
    GAME: 'GAME',
    MOVIE: 'MOVIE',
    TV: 'TV',
    NEWS: 'NEWS'
  },

  // 数据库表名
  TABLES: {
    GAMES: 'egg_games',
    MOVIES: 'egg_movies',
    TV: 'egg_tv',
    NEWS: 'egg_news'
  },

  // API响应格式
  API_RESPONSE: {
    SUCCESS: {
      success: true,
      data: null,
      pagination: null,
      message: ''
    },
    ERROR: {
      success: false,
      error: '',
      message: ''
    }
  },

  // 分页默认值
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // 排序选项
  SORT_OPTIONS: {
    RELEVANCE: 'relevance',
    DATE: 'date',
    TITLE: 'title',
    POPULARITY: 'popularity'
  }
}

// 数据转换函数
export const transformData = {
  // 数据库行转换为前端格式
  dbToFrontend: (dbRow) => {
    console.log('🔍 dbToFrontend 输入:', {
      id: dbRow.id,
      title: dbRow.title,
      publish_date: dbRow.publish_date,
      iframe_url: dbRow.iframe_url,
      seo_description: dbRow.seo_description,
      seo_keywords: dbRow.seo_keywords
    });
    
    const result = {
      id: dbRow.id,
      title: dbRow.title,
      description: dbRow.description,
      publishDate: dbRow.publish_date,
      isLatest: dbRow.is_latest,
      isHome: dbRow.is_home,
      label: dbRow.label,
      classify: dbRow.classify || [],
      imageUrl: dbRow.image_url,
      imageAlt: dbRow.image_alt,
      addressBar: dbRow.address_bar,
      iframeUrl: dbRow.iframe_url,
      seoTitle: dbRow.seo_title,
      seoDescription: dbRow.seo_description,
      seoKeywords: dbRow.seo_keywords,
      detailsHtml: dbRow.details_html,
      mediaType: dbRow.media_type
    };
    
    console.log('🔍 dbToFrontend 输出:', {
      id: result.id,
      title: result.title,
      publishDate: result.publishDate,
      iframeUrl: result.iframeUrl,
      seoDescription: result.seoDescription,
      seoKeywords: result.seoKeywords
    });
    
    return result;
  },

  // 前端格式转换为数据库格式
  frontendToDb: (frontendData) => {
    return {
      title: frontendData.title,
      description: frontendData.description,
      publish_date: frontendData.publishDate,
      is_latest: frontendData.isLatest,
      is_home: frontendData.isHome,
      label: frontendData.label,
      classify: frontendData.classify,
      image_url: frontendData.imageUrl,
      image_alt: frontendData.imageAlt,
      address_bar: frontendData.addressBar,
      iframe_url: frontendData.iframeUrl,
      seo_title: frontendData.seoTitle,
      seo_description: frontendData.seoDescription,
      seo_keywords: frontendData.seoKeywords,
      details_html: frontendData.detailsHtml,
      media_type: frontendData.mediaType
    }
  }
}

// 验证函数
export const validateData = {
  // 验证必需字段
  requiredFields: (data) => {
    const required = ['title', 'description', 'label', 'address_bar']
    const missing = required.filter(field => {
      // 检查下划线格式和驼峰格式
      const snakeCase = field
      const camelCase = field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      return !data[snakeCase] && !data[camelCase]
    })
    
    if (missing.length > 0) {
      return {
        valid: false,
        missing: missing,
        message: `Missing required fields: ${missing.join(', ')}`
      }
    }
    
    return { valid: true }
  },

  // 验证标签值
  validateLabel: (label) => {
    const validLabels = Object.values(DATA_STRUCTURE.LABELS)
    return validLabels.includes(label)
  },

  // 验证媒体类型
  validateMediaType: (mediaType) => {
    const validTypes = Object.values(DATA_STRUCTURE.MEDIA_TYPES)
    return validTypes.includes(mediaType)
  }
}

export default DATA_STRUCTURE
