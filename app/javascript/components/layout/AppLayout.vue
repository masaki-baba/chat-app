<template lang="pug">
.min-h-screen.bg-gray-50
  AppHeader
  main.container.mx-auto.px-4.py-8
    slot
</template>

<script>
import AppHeader from './AppHeader.vue'

export default {
  name: 'AppLayout',
  components: {
    AppHeader
  }
}
</script>
