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
   * @returns {Promise<void>} 接続完了のPromise
   */
  function connectToChatRoom(chatRoomId) {
    // 既存の接続があれば切断
    if (state.subscription) {
      disconnect()
    }

    if (!chatRoomId) return Promise.resolve()

    currentChatRoomId.value = chatRoomId

    return new Promise((resolve, reject) => {
      try {
        console.log('Creating subscription for chat room:', chatRoomId)
        state.subscription = consumer.subscriptions.create(
          { channel: 'ChatChannel', chat_room_id: chatRoomId },
          {
            connected() {
              console.log(`WebSocket connected to chat room ${chatRoomId}`)
              state.connected = true
              resolve() // 接続完了を通知
            },
          
          disconnected() {
            console.log(`WebSocket disconnected from chat room ${chatRoomId}`)
            state.connected = false
          },
          
          received(data) {
            console.log('WebSocket message received:', data)
            console.log('Current chat room ID:', currentChatRoomId.value)
            console.log('Message chat room ID:', data.chat_room_id)
            if (onMessageReceived) {
              console.log('Calling onMessageReceived callback')
              onMessageReceived(data)
            } else {
              console.warn('No onMessageReceived callback defined')
            }
          }
        })
        
        // タイムアウト処理（10秒で接続失敗とみなす）
        setTimeout(() => {
          if (!state.connected) {
            console.warn('WebSocket connection timeout - continuing without real-time updates')
            resolve() // タイムアウトでも続行
          }
        }, 10000)
        
      } catch (error) {
        console.error('Failed to create WebSocket subscription:', error)
        reject(error)
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
   * @returns {Promise<void>} 接続完了のPromise
   */
  function switchChatRoom(newChatRoomId) {
    if (currentChatRoomId.value !== newChatRoomId) {
      return connectToChatRoom(newChatRoomId)
    }
    return Promise.resolve()
  }
  
  return {
    state,
    currentChatRoomId,
    connectToChatRoom,
    switchChatRoom,
    disconnect
  }
}
