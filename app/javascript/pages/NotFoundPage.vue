<template lang="pug">
.flex.flex-col.items-center.justify-center.min-h-[80vh].p-8
  .text-center
    h1.text-6xl.font-bold.text-gray-400.mb-4 404
    h2.text-2xl.font-semibold.text-gray-700.mb-4
      | {{ $t('error.not_found.title') }}
    p.text-gray-600.mb-8
      | {{ $t('error.not_found.message') }}
    router-link(
      to="/"
      class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
    )
      | {{ $t('error.not_found.go_home') }}
</template>

<script>
export default {
  name: 'NotFoundPage'
}
</script>
