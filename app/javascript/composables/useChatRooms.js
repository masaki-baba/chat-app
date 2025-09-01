import { reactive, ref } from 'vue'
import { useAuth } from './useAuth'

const API_BASE_URL = '/api/v1'

export function useChatRooms() {
  const state = reactive({
    chatRooms: [],
    loading: false,
    error: null
  })

  const { authState } = useAuth()

  /**
   * チャットルーム一覧を取得
   */
  async function fetchChatRooms() {
    if (!authState.user) return

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

      const response = await fetch(`${API_BASE_URL}/chat_rooms`, {
        headers: headers,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms')
      }

      const chatRooms = await response.json()
      state.chatRooms = chatRooms
    } catch (error) {
      console.error('Error fetching chat rooms:', error)
      state.error = error.message
    } finally {
      state.loading = false
    }
  }

  /**
   * 新しいダイレクトチャットを作成
   * @param {number} userId - 相手のユーザーID
   */
  async function createDirectChat(userId) {
    if (!authState.user) return null

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }

      const response = await fetch(`${API_BASE_URL}/chat_rooms`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({
          user_id: userId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create chat room')
      }

      const chatRoom = await response.json()
      
      // 既存のリストに追加（重複チェック）
      const existingIndex = state.chatRooms.findIndex(room => room.id === chatRoom.id)
      if (existingIndex === -1) {
        state.chatRooms.unshift(chatRoom)
      }

      return chatRoom
    } catch (error) {
      console.error('Error creating chat room:', error)
      state.error = error.message
      return null
    }
  }

  /**
   * グループチャットを作成
   * @param {string} name - グループ名
   * @param {string} description - グループ説明
   */
  async function createGroupChat(name, description = '') {
    if (!authState.user) return null

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }

      const response = await fetch(`${API_BASE_URL}/chat_rooms`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({
          chat_room: {
            name,
            description
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create group chat')
      }

      const chatRoom = await response.json()
      state.chatRooms.unshift(chatRoom)

      return chatRoom
    } catch (error) {
      console.error('Error creating group chat:', error)
      state.error = error.message
      return null
    }
  }

  /**
   * チャットルームの詳細とメッセージを取得
   * @param {number} chatRoomId - チャットルームID
   */
  async function getChatRoomDetails(chatRoomId) {
    if (!authState.user) return null

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }

      const response = await fetch(`${API_BASE_URL}/chat_rooms/${chatRoomId}`, {
        headers: headers,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch chat room details')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching chat room details:', error)
      state.error = error.message
      return null
    }
  }

  /**
   * 現在のユーザーを設定
   * @param {string} username - ユーザー名
   */
  function setCurrentUser(username) {
    // currentUser is now managed by useAuth - no need to set manually
  }

  return {
    state,
    fetchChatRooms,
    createDirectChat,
    createGroupChat,
    getChatRoomDetails,
    setCurrentUser
  }
}
