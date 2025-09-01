import { reactive } from 'vue'

const API_BASE_URL = '/api/v1'

export function useUsers() {
  const state = reactive({
    users: [],
    loading: false,
    error: null
  })

  /**
   * ユーザー一覧を取得
   * @param {string} searchQuery - 検索クエリ
   */
  async function fetchUsers(searchQuery = '') {
    state.loading = true
    state.error = null

    try {
      const url = new URL(`${API_BASE_URL}/users`, window.location.origin)
      if (searchQuery) {
        url.searchParams.append('search', searchQuery)
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const users = await response.json()
      state.users = users
    } catch (error) {
      console.error('Error fetching users:', error)
      state.error = error.message
    } finally {
      state.loading = false
    }
  }

  /**
   * ユーザーを検索
   * @param {string} query - 検索クエリ
   */
  async function searchUsers(query) {
    if (!query.trim()) {
      state.users = []
      return
    }

    await fetchUsers(query)
  }

  /**
   * ユーザーを作成または取得
   * @param {string} name - ユーザー名
   */
  async function findOrCreateUser(name) {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }

      const response = await fetch(`${API_BASE_URL}/users/find_or_create`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({
          name: name
        })
      })

      if (!response.ok) {
        throw new Error('Failed to find or create user')
      }

      return await response.json()
    } catch (error) {
      console.error('Error finding or creating user:', error)
      state.error = error.message
      return null
    }
  }

  /**
   * 新しいユーザーを作成
   * @param {Object} userData - ユーザーデータ
   */
  async function createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: userData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      const user = await response.json()
      state.users.push(user)
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      state.error = error.message
      return null
    }
  }

  return {
    state,
    fetchUsers,
    searchUsers,
    findOrCreateUser,
    createUser
  }
}
