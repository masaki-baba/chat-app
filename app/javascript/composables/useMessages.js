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
    console.log(`Starting to fetch messages for chat room ${chatRoomId}`)
    
    if (!chatRoomId) {
      console.warn('No chat room ID provided for message fetch')
      return []
    }

    // 現在のチャットルームIDを設定
    currentChatRoom.value = chatRoomId
    console.log(`Set current chat room to: ${chatRoomId}`)

    state.loading = true
    state.error = null

    try {
      const response = await fetch(`/api/v1/chat_rooms/${chatRoomId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Successfully fetched ${data.length} messages for chat room ${chatRoomId}`)
      
      state.messages = data
      return data
    } catch (err) {
      console.error('Error fetching messages:', err)
      state.error = err.message
      throw err
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
    console.log('Adding message:', message, 'Current chat room:', currentChatRoom.value)
    
    // 現在のチャットルームのメッセージかチェック
    if (currentChatRoom.value && message.chat_room_id !== currentChatRoom.value) {
      console.log('Message is not for current chat room, ignoring')
      return
    }
    
    // 重複チェック
    const exists = state.messages.some(m => m.id === message.id)
    if (!exists) {
      console.log('Message added to list')
      state.messages.push(message)
    } else {
      console.log('Message already exists, skipping')
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
