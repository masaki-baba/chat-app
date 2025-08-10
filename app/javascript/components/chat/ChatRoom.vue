<template lang="pug">
.chat-container
  MessageList(
    :messages="messages"
    :loading="loading"
    :current-user="currentUser"
  )
  
  MessageForm(
    :current-user="currentUser"
    @send="onSendMessage"
  )
</template>

<script>
import { onMounted } from 'vue'
import MessageList from './MessageList.vue'
import MessageForm from './MessageForm.vue'
import { useMessages } from '@/composables/useMessages'
import { useWebSocket } from '@/composables/useWebSocket'

export default {
  name: 'ChatRoom',
  components: {
    MessageList,
    MessageForm
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: String,
      required: true
    }
  },
  emits: ['send'],
  setup(props, { emit }) {
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
        await sendMessage(content, props.currentUser)
      } catch (err) {
        console.error('Failed to send message:', err)
      }
    }

    onMounted(async function() {
      await fetchMessages()
    })

    return {
      messagesState,
      wsState,
      onSendMessage
    }
  }
}
</script>
