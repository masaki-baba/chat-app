import { createI18n } from 'vue-i18n'
import commonLocales from './locales/common.yml'
import homeLocales from './locales/home.yml'
import chatLocales from './locales/chat.yml'
import errorLocales from './locales/error.yml'

// Simple merge that preserves nested structure
const messages = {
  en: {
    ...commonLocales.en,
    ...homeLocales.en,
    ...chatLocales.en,
    ...errorLocales.en
  },
  ja: {
    ...commonLocales.ja,
    ...homeLocales.ja,
    ...chatLocales.ja,
    ...errorLocales.ja
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
