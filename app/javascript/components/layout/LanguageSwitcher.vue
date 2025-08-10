<template lang="pug">
.language-switcher
  button.language-button(
    @click="state.isOpen = !state.isOpen"
    ref="state.buttonRef"
  )
    span {{ currentLanguage.name }}
    svg(
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style="width: 1rem; height: 1rem;"
    )
      path(
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      )
  
  .language-dropdown(
    v-show="state.isOpen"
    ref="state.dropdownRef"
  )
    button.language-option(
      v-for="language in languages"
      :key="language.code"
      @click="onChangeLanguage(language.code)"
    )
      | {{ language.name }}
</template>

<script>
import { reactive, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/composables/useI18n'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { state: i18nState, changeLanguage, t } = useI18n()
    const state = reactive({
      isOpen: false
    })

    const languages = computed(function() {
      return [
        { code: 'ja', name: t('common.language.japanese') },
        { code: 'en', name: t('common.language.english') }
      ]
    })

    const currentLanguage = computed(function() {
      const current = languages.value.find(function(lang) {
        return lang.code === i18nState.currentLocale
      })
      return current ? current : { name: 'Language', code: 'en' }
    })

    /**
     * 言語を変更する
     * @param {string} languageCode - 言語コード
     */
    function onChangeLanguage(languageCode) {
      changeLanguage(languageCode)
      state.isOpen = false
    }

    /**
     * ドロップダウン外をクリックした時の処理
     * @param {Event} event - クリックイベント
     */
    function onClickOutside(event) {
      if (!event.target.closest('.language-switcher')) {
        state.isOpen = false
      }
    }

    onMounted(function() {
      document.addEventListener('click', onClickOutside)
    })

    onUnmounted(function() {
      document.removeEventListener('click', onClickOutside)
    })

    return {
      state,
      i18nState,
      languages,
      currentLanguage,
      onChangeLanguage
    }
  }
}
</script>
