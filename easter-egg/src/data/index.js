// 多语言数据加载器
// 根据当前语言动态加载对应的数据文件

/**
 * 加载指定语言的数据
 * @param {string} locale - 语言代码 (en, ru, ja, ko, es, fr, de)
 * @param {string} type - 数据类型 (games, movies, tv, news)
 * @returns {Promise<Object>} 包含 data 和 classifications 的对象
 */
export const loadData = async (locale = 'en', type = 'games') => {
  try {
    // 动态导入对应语言的数据文件
    const module = await import(`./${locale}/${type}.js`)
    
    return {
      data: module[`${type}Data`] || [],
      classifications: module.classifications || []
    }
  } catch (error) {
    console.warn(`Failed to load ${type} data for locale ${locale}, falling back to English`, error)
    
    // 如果加载失败，回退到英文
    try {
      const fallbackModule = await import(`./en/${type}.js`)
      return {
        data: fallbackModule[`${type}Data`] || [],
        classifications: fallbackModule.classifications || []
      }
    } catch (fallbackError) {
      console.error(`Failed to load fallback English data for ${type}`, fallbackError)
      return {
        data: [],
        classifications: []
      }
    }
  }
}

/**
 * 批量加载所有数据类型
 * @param {string} locale - 语言代码
 * @returns {Promise<Object>} 包含所有数据类型的对象
 */
export const loadAllData = async (locale = 'en') => {
  const [games, movies, tv, news] = await Promise.all([
    loadData(locale, 'games'),
    loadData(locale, 'movies'),
    loadData(locale, 'tv'),
    loadData(locale, 'news')
  ])
  
  return {
    games: games.data,
    movies: movies.data,
    tv: tv.data,
    news: news.data,
    classifications: {
      games: games.classifications,
      movies: movies.classifications,
      tv: tv.classifications,
      news: news.classifications
    }
  }
}

/**
 * 获取支持的语言列表
 */
export const supportedLocales = ['en', 'ru', 'ja', 'ko', 'es', 'fr', 'de']

/**
 * 检查语言是否支持
 */
export const isSupportedLocale = (locale) => {
  return supportedLocales.includes(locale)
}

