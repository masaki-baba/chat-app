import { computed, reactive } from 'vue'
import { useI18n as useVueI18n } from 'vue-i18n'

export function useI18n() {
  const { t, locale } = useVueI18n()
  
  const state = reactive({
    currentLocale: computed(() => locale.value),
    isJapanese: computed(() => locale.value === 'ja'),
    isEnglish: computed(() => locale.value === 'en')
  })
  
  /**
   * 言語を変更する
   * @param {string} newLocale - 新しい言語コード（'ja' または 'en'）
   */
  function changeLanguage(newLocale) {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }
  
  return {
    t,
    state,
    changeLanguage
  }
}
