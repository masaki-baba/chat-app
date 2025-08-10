<template lang="pug">
.chat-container
  .header
    h1.header-title
      | {{ $t('chat.title') }}
    LanguageSwitcher
  
  ChatRoom(
    :messages="messagesState.messages"
    :loading="messagesState.loading"
    :current-user="state.currentUser"
    @send="onSendMessage"
  )
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ChatRoom from '@/components/chat/ChatRoom.vue'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.vue'
import { useMessages } from '@/composables/useMessages'
import { useWebSocket } from '@/composables/useWebSocket'

export default {
  name: 'ChatPage',
  components: {
    ChatRoom,
    LanguageSwitcher
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      currentUser: ''
    })

    const { state: messagesState, fetchMessages, sendMessage, addMessage } = useMessages()

    /**
     * 新しいメッセージを受信した時の処理
     * @param {Object} message - 受信したメッセージオブジェクト
     */
    function onNewMessage(message) {
      addMessage(message)
    }

    const { state: wsState } = useWebSocket(onNewMessage)

    /**
     * メッセージを送信する
     * @param {string} content - 送信するメッセージ内容
     */
    async function onSendMessage(content) {
      try {
        await sendMessage(content, state.currentUser)
      } catch (err) {
        console.error('Failed to send message:', err)
      }
    }

    onMounted(async function() {
      const username = localStorage.getItem('username')
      if (!username) {
        router.push('/')
        return
      }
      
      state.currentUser = username
      await fetchMessages()
    })

    return {
      state,
      messagesState,
      wsState,
      onSendMessage
    }
  }
}
</script>
