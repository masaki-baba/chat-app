import { reactive, ref } from 'vue'

const API_BASE_URL = '/api/v1'

// グローバルな認証状態
export const authState = reactive({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
})

export function useAuth() {
  /**
   * ユーザーログイン
   * @param {string|Object} userData - ユーザー名（文字列）またはユーザーデータ（オブジェクト）
   */
  async function login(userData) {
    authState.loading = true
    authState.error = null

    try {
      // 後方互換性のため、文字列とオブジェクトの両方をサポート
      const requestData = typeof userData === 'string' 
        ? { name: userData }
        : userData

      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const user = await response.json()
      authState.user = user
      authState.isAuthenticated = true
      
      // localStorageにも保存（後方互換性のため）
      localStorage.setItem('username', user.name)
      localStorage.setItem('user_id', user.id.toString())

      return user
    } catch (error) {
      console.error('Login error:', error)
      authState.error = error.message
      throw error
    } finally {
      authState.loading = false
    }
  }

  /**
   * 現在のユーザー情報を取得
   */
  async function getCurrentUser() {
    authState.loading = true
    authState.error = null

    try {
      const response = await fetch(`${API_BASE_URL}/users/current_user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (response.ok) {
        const user = await response.json()
        authState.user = user
        authState.isAuthenticated = true
        
        // localStorageも更新
        localStorage.setItem('username', user.name)
        localStorage.setItem('user_id', user.id.toString())
        
        return user
      } else if (response.status === 401) {
        // 認証されていない場合
        authState.user = null
        authState.isAuthenticated = false
        localStorage.removeItem('username')
        localStorage.removeItem('user_id')
        return null
      } else {
        throw new Error('Failed to get current user')
      }
    } catch (error) {
      console.error('Get current user error:', error)
      authState.error = error.message
      authState.user = null
      authState.isAuthenticated = false
      return null
    } finally {
      authState.loading = false
    }
  }

  /**
   * ログアウト
   */
  async function logout() {
    authState.loading = true
    authState.error = null

    try {
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      authState.user = null
      authState.isAuthenticated = false
      
      // localStorageもクリア
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
    } catch (error) {
      console.error('Logout error:', error)
      authState.error = error.message
    } finally {
      authState.loading = false
    }
  }

  /**
   * アプリケーション初期化時の認証状態チェック
   */
  async function initializeAuth() {
    // セッションから現在のユーザーを取得を試行
    await getCurrentUser()
    
    // セッションにユーザーがいない場合、localStorageから復元を試行
    if (!authState.isAuthenticated) {
      const storedUsername = localStorage.getItem('username')
      if (storedUsername) {
        try {
          await login(storedUsername)
        } catch (error) {
          // ログインに失敗した場合はlocalStorageをクリア
          localStorage.removeItem('username')
          localStorage.removeItem('user_id')
        }
      }
    }
  }

  return {
    authState,
    login,
    logout,
    getCurrentUser,
    initializeAuth
  }
}
