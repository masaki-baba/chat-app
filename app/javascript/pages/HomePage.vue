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
          :disabled="state.loading"
          required
        )
      
      .form-group
        label.form-label(for="email")
          | {{ $t('home.email_label') }}
        input#email.form-input(
          v-model="state.email"
          type="email"
          :placeholder="$t('home.email_placeholder')"
          :disabled="state.loading"
          required
        )
      
      .error-message(v-if="state.error")
        | {{ state.error }}
      
      button.btn-primary.btn-full(
        type="submit"
        :disabled="!state.username.trim() || !state.email.trim() || state.loading"
      )
        span(v-if="state.loading")
          | {{ $t('common.loading') }}...
        span(v-else)
          | {{ $t('home.join_chat') }}
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    const { state: authState, login } = useAuth()
    
    const state = reactive({
      username: '',
      email: '',
      loading: false,
      error: null
    })

    /**
     * チャットルームに参加する
     */
    async function onJoinChat() {
      if (!state.username.trim() || !state.email.trim()) return

      state.loading = true
      state.error = null

      try {
        // サーバー側でユーザーを作成/ログイン
        const user = await login({
          name: state.username.trim(),
          email: state.email.trim()
        })
        
        // ログイン成功後、ユーザーIDを含むチャット画面に遷移
        router.push(`/chat/${user.id}`)
      } catch (error) {
        console.error('Failed to join chat:', error)
        state.error = 'ログインに失敗しました。もう一度お試しください。'
      } finally {
        state.loading = false
      }
    }

    return {
      state,
      authState,
      onJoinChat
    }
  }
}
</script>
