<template lang="pug">
.chat-room
  .chat-header(v-if="chatRoom")
    .back-button(@click="$emit('back')")
      i.icon-arrow-left
    .chat-info
      .chat-avatar
        .avatar-circle(:class="chatRoom.room_type")
          | {{ getAvatarText(chatRoom) }}
      .chat-details
        .chat-name {{ chatRoom.name }}
        .chat-status(v-if="chatRoom.room_type === 'direct'")
          | {{ getOnlineStatus() }}
        .member-count(v-else)
          | {{ chatRoom.users.length }}人のメンバー
    .chat-actions
      button.menu-btn
        i.icon-menu

  .no-room(v-if="!chatRoom")
    .no-room-content
      .no-room-icon 💬
      h3 {{ $t('chat.selectRoom') }}
      p {{ $t('chat.selectRoomDescription') }}

  .chat-content(v-else)
    message-list(
      :messages="messagesState.messages"
      :loading="messagesState.loading"
      :current-user="currentUser"
    )
    
    message-form(
      :current-user="currentUser"
      :disabled="!chatRoom"
      @send="onSendMessage"
    )
</template>

<script>
import { computed, watch, onMounted, onUnmounted } from 'vue'
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
    chatRoom: {
      type: Object,
      default: null
    },
    currentUser: {
      type: [String, Object],
      required: true
    }
  },
  emits: ['back'],
  setup(props, { emit }) {
    const { 
      state: messagesState, 
      fetchMessages, 
      sendMessage, 
      addMessage, 
      clearMessages,
      setCurrentUser 
    } = useMessages()

    const { 
      connectToChatRoom, 
      switchChatRoom, 
      disconnect 
    } = useWebSocket(onNewMessage)

    /**
     * 新しいメッセージを受信した時の処理
     * @param {Object} message - 受信したメッセージオブジェクト
     */
    function onNewMessage(message) {
      console.log('ChatRoom.vue onNewMessage called with:', message)
      console.log('Current chatRoom prop:', props.chatRoom)
      addMessage(message)
    }

    /**
     * メッセージを送信する
     * @param {string} content - 送信するメッセージ内容
     */
    async function onSendMessage(content) {
      if (!props.chatRoom) return

      try {
        await sendMessage(content, props.chatRoom.id)
      } catch (err) {
        console.error('Failed to send message:', err)
      }
    }

    /**
     * チャットルームのアバターテキストを取得
     */
    function getAvatarText(chatRoom) {
      if (chatRoom.room_type === 'direct') {
        const otherUser = chatRoom.users?.find(user => user.name !== props.currentUser)
        return otherUser?.name?.charAt(0).toUpperCase() || '?'
      } else {
        return chatRoom.name?.charAt(0).toUpperCase() || 'G'
      }
    }

    /**
     * オンライン状態を取得
     */
    function getOnlineStatus() {
      if (props.chatRoom?.room_type !== 'direct') return ''
      
      const otherUser = props.chatRoom.users?.find(user => user.name !== props.currentUser)
      return otherUser?.online ? 'オンライン' : '最終接続: 不明'
    }

    // チャットルームが変更された時の処理
    watch(() => props.chatRoom, async (newChatRoom, oldChatRoom) => {
      if (newChatRoom?.id !== oldChatRoom?.id) {
        console.log('Chat room changed:', { newId: newChatRoom?.id, oldId: oldChatRoom?.id })
        clearMessages()
        
        if (newChatRoom) {
          // まずメッセージを取得（即座に表示）
          try {
            console.log(`Fetching messages for chat room ${newChatRoom.id}`)
            await fetchMessages(newChatRoom.id)
            console.log(`Successfully fetched messages for chat room ${newChatRoom.id}`)
          } catch (error) {
            console.error('Failed to fetch messages:', error)
          }
          
          // その後WebSocket接続を確立（リアルタイム通信用）
          try {
            console.log(`Connecting to chat room ${newChatRoom.id}`)
            await connectToChatRoom(newChatRoom.id)
            console.log(`Successfully connected to chat room ${newChatRoom.id}`)
          } catch (error) {
            console.warn('WebSocket connection failed:', error)
          }
        } else {
          // チャットルームが選択解除された場合
          console.log('Disconnecting from WebSocket')
          disconnect()
        }
      }
    }, { immediate: true })

    onMounted(() => {
      setCurrentUser(props.currentUser)
    })

    onUnmounted(() => {
      disconnect()
    })

    return {
      messagesState,
      onSendMessage,
      getAvatarText,
      getOnlineStatus
    }
  }
}
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e1e8ed;
  background: #ffffff;
  min-height: 64px;
}

.back-button {
  display: none;
  margin-right: 12px;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: #f0f0f0;
}

@media (max-width: 768px) {
  .back-button {
    display: block;
  }
}

.chat-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.chat-avatar {
  margin-right: 12px;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 16px;
}

.avatar-circle.direct {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-circle.group {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.chat-details {
  flex: 1;
}

.chat-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.chat-status, .member-count {
  font-size: 12px;
  color: #666;
}

.chat-actions {
  display: flex;
  align-items: center;
}

.menu-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  color: #666;
}

.menu-btn:hover {
  background: #f0f0f0;
}

.no-room {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f8f9fa;
}

.no-room-content {
  text-align: center;
  color: #666;
}

.no-room-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-room-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.no-room-content p {
  margin: 0;
  font-size: 14px;
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
</style>
