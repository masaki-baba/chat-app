<template lang="pug">
.page-container
  .text-center
    h1.title-404 404
    h2.title-large
      | {{ $t('error.not_found.title') }}
    p.subtitle
      | {{ $t('error.not_found.message') }}
    router-link.btn-primary(to="/")
      | {{ $t('error.not_found.go_home') }}
</template>

<script>
export default {
  name: 'NotFoundPage'
}
</script>
