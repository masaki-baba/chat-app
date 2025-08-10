<template lang="pug">
.page-container
  .card
    h1.title-large
      | {{ $t('home.welcome') }}
    p.subtitle
      | {{ $t('home.subtitle') }}
    
    form.form-container(@submit.prevent="onJoinChat")
      .form-group
        label.form-label(for="username")
          | {{ $t('home.username_label') }}
        input#username.form-input(
          v-model="state.username"
          type="text"
          :placeholder="$t('home.username_placeholder')"
          required
        )
      
      button.btn-primary.btn-full(
        type="submit"
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
