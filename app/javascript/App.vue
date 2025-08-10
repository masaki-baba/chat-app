<template lang="pug">
#app.min-h-screen.bg-gray-50
  AppLayout
    router-view
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'

export default {
  name: 'App',
  components: {
    AppLayout
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

* {
  box-sizing: border-box;
}
</style>
