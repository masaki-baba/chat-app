<template lang="pug">
header.app-header
  .header-container
    .header-nav
      router-link.app-title(to="/")
        | {{ $t('common.app.title') }}
      
      nav.nav-links
        router-link.nav-link(
          to="/" 
          :class="{ 'nav-link-active': $route.name === 'Home' }"
        )
          | {{ $t('common.nav.home') }}
        router-link(
          to="/chat" 
          class="text-gray-600 hover:text-blue-600 transition duration-200"
          :class="{ 'text-blue-600': $route.name === 'Chat' }"
        )
          | {{ $t('common.nav.chat') }}
        LanguageSwitcher
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher.vue'

export default {
  name: 'AppHeader',
  components: {
    LanguageSwitcher
  }
}
</script>
<style scoped>
@import "app/assets/stylesheets/components/language-switcher.scss";
</style>

