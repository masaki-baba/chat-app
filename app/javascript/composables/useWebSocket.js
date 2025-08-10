import { reactive, onMounted, onUnmounted } from 'vue'
import consumer from '@/channels/consumer'

export function useWebSocket(onMessageReceived) {
  const state = reactive({
    connected: false,
    subscription: null
  })
  
  /**
   * WebSocket接続を開始する
   */
  function connect() {
    state.subscription = consumer.subscriptions.create('ChatChannel', {
      connected() {
        state.connected = true
        console.log('Connected to ChatChannel')
      },
      
      disconnected() {
        state.connected = false
        console.log('Disconnected from ChatChannel')
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
  }
  
  onMounted(function() {
    connect()
  })
  
  onUnmounted(function() {
    disconnect()
  })
  
  return {
    state,
    disconnect,
    reconnect: connect
  }
}
