import { reactive, ref } from 'vue'
import { useAuth } from './useAuth'

export function useMessages() {
  const state = reactive({
    messages: [],
    loading: false,
    error: null
  })

  const { authState } = useAuth()
  const currentChatRoom = ref(null)
  
  /**
   * チャットルーム用のメッセージ一覧を取得する
   * @param {number} chatRoomId - チャットルームID
   * @returns {Promise<void>}
   */
  async function fetchMessages(chatRoomId) {
    if (!chatRoomId || !authState.user) return

    state.loading = true
    state.error = null
    
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }

      const response = await fetch(`/api/v1/chat_rooms/${chatRoomId}/messages`, {
        headers: headers,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const messages = await response.json()
      state.messages = messages
      currentChatRoom.value = chatRoomId
    } catch (err) {
      state.error = err.message
      console.error('Failed to fetch messages:', err)
    } finally {
      state.loading = false
    }
  }
  
  /**
   * メッセージを送信する
   * @param {string} content - メッセージ内容
   * @param {number} chatRoomId - チャットルームID
   * @returns {Promise<Object>} 送信されたメッセージオブジェクト
   */
  async function sendMessage(content, chatRoomId) {
    if (!authState.user || !chatRoomId) {
      throw new Error('User or chat room not specified')
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }

      const response = await fetch(`/api/v1/chat_rooms/${chatRoomId}/messages`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({
          message: {
            content,
            message_type: 'text'
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const sentMessage = await response.json()
      
      // 送信されたメッセージをローカル状態に追加
      addMessage(sentMessage)
      
      return sentMessage
    } catch (err) {
      state.error = err.message
      throw err
    }
  }
  
  /**
   * メッセージを追加する（WebSocketからの受信用）
   * @param {Object} message
   */
  function addMessage(message) {
    // 重複チェック
    const exists = state.messages.some(m => m.id === message.id)
    if (!exists) {
      state.messages.push(message)
    }
  }

  /**
   * メッセージリストをクリア
   */
  function clearMessages() {
    state.messages = []
    currentChatRoom.value = null
  }

  /**
   * 現在のユーザーを設定（useAuthで管理されるため不要）
   * @param {string} username - ユーザー名
   */
  function setCurrentUser(username) {
    // currentUser is now managed by useAuth - no need to set manually
  }
  
  return {
    state,
    currentChatRoom,
    fetchMessages,
    sendMessage,
    addMessage,
    clearMessages,
    setCurrentUser
  }
}
