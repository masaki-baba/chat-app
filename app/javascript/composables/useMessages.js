import { reactive } from 'vue'
import axios from 'axios'

export function useMessages() {
  const state = reactive({
    messages: [],
    loading: false,
    error: null
  })
  
  /**
   * メッセージ一覧を取得する
   * @returns {Promise<void>}
   */
  async function fetchMessages() {
    state.loading = true
    state.error = null
    
    try {
      const response = await axios.get('/api/v1/messages')
      state.messages = response.data
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
   * @param {string} userName - ユーザー名
   * @returns {Promise<Object>} 送信されたメッセージオブジェクト
   */
  async function sendMessage(content, userName) {
    try {
      const response = await axios.post('/api/v1/messages', {
        message: {
          content,
          user_name: userName
        }
      })
      return response.data
    } catch (err) {
      state.error = err.message
      throw err
    }
  }
  
  /**
   * メッセージを追加する
   * @param {Object} message
   */
  function addMessage(message) {
    state.messages.push(message)
  }
  
  return {
    state,
    fetchMessages,
    sendMessage,
    addMessage
  }
}
