<template lang="pug">
.flex.flex-col.items-center.justify-center.min-h-[80vh].p-8
  .max-w-md.w-full.bg-white.rounded-lg.shadow-md.p-8
    h1.text-3xl.font-bold.text-center.text-gray-800.mb-2
      | {{ $t('home.welcome') }}
    p.text-gray-600.text-center.mb-8
      | {{ $t('home.subtitle') }}
    
    form(@submit.prevent="onJoinChat" class="space-y-4")
      div
        label(for="username" class="block text-sm font-medium text-gray-700 mb-2")
          | {{ $t('home.username_label') }}
        input#username(
          v-model="state.username"
          type="text"
          :placeholder="$t('home.username_placeholder')"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        )
      
      button(
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        :disabled="!state.username.trim()"
      )
        | {{ $t('home.join_chat') }}
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    const state = reactive({
      username: ''
    })

    /**
     * チャットルームに参加する
     */
    function onJoinChat() {
      if (state.username.trim()) {
        localStorage.setItem('username', state.username.trim())
        router.push('/chat')
      }
    }

    return {
      state,
      onJoinChat
    }
  }
}
</script>
