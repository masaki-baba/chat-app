<template lang="pug">
.flex.flex-col.h-[90vh].max-w-4xl.mx-auto.bg-white.rounded-lg.shadow-lg.overflow-hidden
  .bg-blue-600.text-white.p-4.flex.items-center.justify-between
    h1.text-xl.font-semibold
      | {{ $t('chat.title') }}
    .flex.items-center.space-x-2
      .w-3.h-3.rounded-full(:class="wsState.connected ? 'bg-green-400' : 'bg-red-400'")
      span.text-sm
        | {{ wsState.connected ? $t('chat.connected') : $t('chat.connection_lost') }}
  
  .flex-1.flex
    .flex-1.flex.flex-col
      MessageList(
        :messages="messagesState.messages"
        :loading="messagesState.loading"
        :current-user="state.currentUser"
        class="flex-1"
      )
      
      MessageForm(
        :current-user="state.currentUser"
        @send="onSendMessage"
        class="border-t"
      )
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MessageList from '@/components/chat/MessageList.vue'
import MessageForm from '@/components/chat/MessageForm.vue'
import { useMessages } from '@/composables/useMessages'
import { useWebSocket } from '@/composables/useWebSocket'

export default {
  name: 'ChatPage',
  components: {
    MessageList,
    MessageForm
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
