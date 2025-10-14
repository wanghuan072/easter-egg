import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import ru from './locales/ru.js'
import es from './locales/es.js'
import fr from './locales/fr.js'
import de from './locales/de.js'
import ja from './locales/ja.js'
import ko from './locales/ko.js'

// 支持的语言列表
export const supportedLocales = ['en', 'ru', 'es', 'fr', 'de', 'ja', 'ko']

// 获取默认语言
function getDefaultLocale() {
  // 1. 优先从 localStorage 获取
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale
  }
  
  // 2. 从浏览器语言检测
  const browserLang = navigator.language.split('-')[0]
  if (supportedLocales.includes(browserLang)) {
    return browserLang
  }
  
  // 3. 默认返回英文
  return 'en'
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getDefaultLocale(), // 默认语言
  fallbackLocale: 'en', // 备用语言
  messages: {
    en,
    ru,
    es,
    fr,
    de,
    ja,
    ko
  },
  // 全局注入 $t
  globalInjection: true,
  // 禁止警告（可选）
  silentTranslationWarn: false,
  silentFallbackWarn: false
})

export default i18n
