<template lang="pug">
.relative
  button(
    @click="toggleDropdown"
    class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition duration-200"
  )
    span {{ currentLanguageLabel }}
    svg.w-4.h-4(fill="currentColor" viewBox="0 0 20 20")
      path(fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd")
  
  .absolute.right-0.mt-2.w-48.bg-white.rounded-md.shadow-lg.border(
    v-show="state.isOpen"
    @click="closeDropdown"
  )
    .py-1
      button(
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        :class="{ 'bg-blue-50 text-blue-600': i18nState.currentLocale === lang.code }"
      )
        | {{ lang.label }}
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

    const languages = computed(() => [
      { code: 'ja', label: t('common.language.japanese') },
      { code: 'en', label: t('common.language.english') }
    ])

    const currentLanguageLabel = computed(() => {
      const current = languages.value.find(lang => lang.code === i18nState.currentLocale)
      return current ? current.label : 'Language'
    })

    /**
     * ドロップダウンメニューの表示/非表示を切り替える
     */
    function toggleDropdown() {
      state.isOpen = !state.isOpen
    }

    /**
     * ドロップダウンメニューを閉じる
     */
    function closeDropdown() {
      state.isOpen = false
    }

    /**
     * ドロップダウン外をクリックした時の処理
     * @param {Event} event - クリックイベント
     */
    function onClickOutside(event) {
      if (!event.target.closest('.relative')) {
        closeDropdown()
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
      currentLanguageLabel,
      toggleDropdown,
      closeDropdown,
      changeLanguage
    }
  }
}
</script>
