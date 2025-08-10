import { reactive, ref } from 'vue'
import consumer from '@/channels/consumer'

export function useWebSocket(onMessageReceived) {
  const state = reactive({
    connected: false,
    subscription: null
  })

  const currentChatRoomId = ref(null)
  
  /**
   * 特定のチャットルームに接続する
   * @param {number} chatRoomId - チャットルームID
   */
  function connectToChatRoom(chatRoomId) {
    // 既存の接続があれば切断
    if (state.subscription) {
      disconnect()
    }

    if (!chatRoomId) return

    currentChatRoomId.value = chatRoomId

    state.subscription = consumer.subscriptions.create('ChatChannel', {
      chat_room_id: chatRoomId
    }, {
      connected() {
        state.connected = true
        console.log(`Connected to ChatRoom ${chatRoomId}`)
      },
      
      disconnected() {
        state.connected = false
        console.log(`Disconnected from ChatRoom ${chatRoomId}`)
      },
      
      received(data) {
        if (onMessageReceived) {
          onMessageReceived(data)
        }
      }
    })
  }
  
  /**
   * WebSocket接続を切断する
   */
  function disconnect() {
    if (state.subscription) {
      state.subscription.unsubscribe()
      state.subscription = null
    }
    state.connected = false
    currentChatRoomId.value = null
  }

  /**
   * チャットルームを切り替える
   * @param {number} newChatRoomId - 新しいチャットルームID
   */
  function switchChatRoom(newChatRoomId) {
    if (currentChatRoomId.value !== newChatRoomId) {
      connectToChatRoom(newChatRoomId)
    }
  }
  
  return {
    state,
    currentChatRoomId,
    connectToChatRoom,
    switchChatRoom,
    disconnect
  }
}
