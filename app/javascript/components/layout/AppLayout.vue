<template lang="pug">
.app-layout
  AppHeader
  main.main-content
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
