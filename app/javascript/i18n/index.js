import { createI18n } from 'vue-i18n'
import commonEn from './locales/common.yml'
import homeEn from './locales/home.yml'
import chatEn from './locales/chat.yml'
import errorEn from './locales/error.yml'

// Merge all locale files
const messages = {
  en: {
    common: commonEn.en,
    home: homeEn.en,
    chat: chatEn.en,
    error: errorEn.en
  },
  ja: {
    common: commonEn.ja,
    home: homeEn.ja,
    chat: chatEn.ja,
    error: errorEn.ja
  }
}

const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'ja',
  fallbackLocale: 'en',
  messages,
  legacy: false,
  globalInjection: true
})

export default i18n
