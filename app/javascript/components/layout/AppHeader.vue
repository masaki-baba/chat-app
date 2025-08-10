<template lang="pug">
header.bg-white.shadow-sm.border-b
  .container.mx-auto.px-4
    .flex.items-center.justify-between.h-16
      router-link(
        to="/" 
        class="text-xl font-bold text-blue-600"
      )
        | {{ $t('common.app.title') }}
      
      nav.flex.items-center.space-x-6
        router-link(
          to="/" 
          class="text-gray-600 hover:text-blue-600 transition duration-200"
          :class="{ 'text-blue-600': $route.name === 'Home' }"
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
