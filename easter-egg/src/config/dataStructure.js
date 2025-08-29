// 前端数据结构配置
// 与后端数据结构完全一致

export const DATA_STRUCTURE = {
  // 基础字段映射
  FIELD_MAPPING: {
    // 数据库字段 -> 前端字段
    id: 'id',
    title: 'title',
    description: 'description',
    publish_date: 'publishDate',
    is_latest: 'isLatest',
    is_home: 'isHome',
    label: 'label',
    classify: 'classify',
    image_url: 'imageUrl',
    image_alt: 'imageAlt',
    address_bar: 'addressBar',
    seo_title: 'seoTitle',
    details_html: 'detailsHtml',
    media_type: 'mediaType'
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

  // 路由名称映射
  ROUTE_NAMES: {
    GAMES: 'games-detail',
    MOVIES: 'movies-detail',
    TV: 'tv-detail',
    NEWS: 'news-detail'
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
  // 后端数据转换为前端格式
  backendToFrontend: (backendData) => {
    if (Array.isArray(backendData)) {
      return backendData.map(item => transformData.backendToFrontend(item))
    }
    
    if (!backendData || typeof backendData !== 'object') {
      return backendData
    }
    
    const transformed = {}
    Object.keys(DATA_STRUCTURE.FIELD_MAPPING).forEach(backendField => {
      const frontendField = DATA_STRUCTURE.FIELD_MAPPING[backendField]
      if (backendData[backendField] !== undefined) {
        transformed[frontendField] = backendData[backendField]
      }
    })
    
    return transformed
  },

  // 前端格式转换为后端格式
  frontendToBackend: (frontendData) => {
    if (Array.isArray(frontendData)) {
      return frontendData.map(item => transformData.frontendToBackend(item))
    }
    
    if (!frontendData || typeof frontendData !== 'object') {
      return frontendData
    }
    
    const transformed = {}
    Object.keys(DATA_STRUCTURE.FIELD_MAPPING).forEach(backendField => {
      const frontendField = DATA_STRUCTURE.FIELD_MAPPING[backendField]
      if (frontendData[frontendField] !== undefined) {
        transformed[backendField] = frontendData[frontendField]
      }
    })
    
    return transformed
  }
}

// 工具函数
export const dataUtils = {
  // 获取媒体类型
  getMediaType: (item) => {
    // 优先使用 media_type 字段
    if (item.mediaType) {
      switch (item.mediaType.toLowerCase()) {
        case 'games':
        case 'game':
          return DATA_STRUCTURE.MEDIA_TYPES.GAMES
        case 'movies':
        case 'movie':
          return DATA_STRUCTURE.MEDIA_TYPES.MOVIES
        case 'tv':
        case 'tvshow':
          return DATA_STRUCTURE.MEDIA_TYPES.TV
        case 'news':
          return DATA_STRUCTURE.MEDIA_TYPES.NEWS
      }
    }

    // 其次使用 label 字段
    if (item.label) {
      switch (item.label.toUpperCase()) {
        case DATA_STRUCTURE.LABELS.GAME:
          return DATA_STRUCTURE.MEDIA_TYPES.GAMES
        case DATA_STRUCTURE.LABELS.MOVIE:
          return DATA_STRUCTURE.MEDIA_TYPES.MOVIES
        case DATA_STRUCTURE.LABELS.TV:
          return DATA_STRUCTURE.MEDIA_TYPES.TV
        case DATA_STRUCTURE.LABELS.NEWS:
          return DATA_STRUCTURE.MEDIA_TYPES.NEWS
      }
    }

    // 最后尝试从 address_bar 或其他字段推断
    const addressBar = item.addressBar || item.address_bar || ''
    if (addressBar.includes('game')) return DATA_STRUCTURE.MEDIA_TYPES.GAMES
    if (addressBar.includes('movie')) return DATA_STRUCTURE.MEDIA_TYPES.MOVIES
    if (addressBar.includes('tv')) return DATA_STRUCTURE.MEDIA_TYPES.TV
    if (addressBar.includes('news')) return DATA_STRUCTURE.MEDIA_TYPES.NEWS

    // 默认返回 games
    return DATA_STRUCTURE.MEDIA_TYPES.GAMES
  },

  // 获取路由名称
  getRouteName: (item) => {
    const mediaType = dataUtils.getMediaType(item)
    switch (mediaType) {
      case DATA_STRUCTURE.MEDIA_TYPES.GAMES:
        return DATA_STRUCTURE.ROUTE_NAMES.GAMES
      case DATA_STRUCTURE.MEDIA_TYPES.MOVIES:
        return DATA_STRUCTURE.ROUTE_NAMES.MOVIES
      case DATA_STRUCTURE.MEDIA_TYPES.TV:
        return DATA_STRUCTURE.ROUTE_NAMES.TV
      case DATA_STRUCTURE.MEDIA_TYPES.NEWS:
        return DATA_STRUCTURE.ROUTE_NAMES.NEWS
      default:
        return DATA_STRUCTURE.ROUTE_NAMES.GAMES
    }
  },

  // 获取地址栏标识
  getAddressBar: (item) => {
    return item.addressBar || item.address_bar || item.id?.toString()
  },

  // 验证数据完整性
  validateItem: (item) => {
    const required = ['title', 'description', 'label']
    const missing = required.filter(field => !item[field])
    
    if (missing.length > 0) {
      return {
        valid: false,
        missing: missing,
        message: `Missing required fields: ${missing.join(', ')}`
      }
    }
    
    return { valid: true }
  }
}

export default DATA_STRUCTURE
