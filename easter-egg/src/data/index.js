// 导入数据
import { gamesData } from './gamesVideo.js'
import { moviesData } from './moviesVideo.js'
import { tvData } from './tvVideo.js'

// 统一导出所有数据
export { gamesData, moviesData, tvData }

// 获取所有最新发现的数据
export const getAllLatestData = () => {
  const allData = [
    ...gamesData.filter(item => item.isLatest),
    ...moviesData.filter(item => item.isLatest),
    ...tvData.filter(item => item.isLatest)
  ]
  
  // 按发布时间排序，最新的在前面
  return allData.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
}

// 获取首页各板块数据
export const getHomeData = () => {
  return {
    games: gamesData.filter(item => item.isHome),
    movies: moviesData.filter(item => item.isHome),
    tv: tvData.filter(item => item.isHome)
  }
}
