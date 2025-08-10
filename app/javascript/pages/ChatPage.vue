<template lang="pug">
.chat-app
  .app-header
    h1.app-title
      | {{ $t('chat.title') }}
    .header-actions
      LanguageSwitcher
      .user-info(v-if="authState && authState.user && authState.user.name")
        .user-avatar
          | {{ authState.user.name.charAt(0).toUpperCase() }}
        .user-name {{ authState.user.name }}

  .app-content
    .sidebar(:class="{ 'mobile-hidden': selectedChatRoom && isMobile }")
      chat-room-list(
        v-if="authState && authState.user && authState.user.name"
        :selected-room-id="selectedChatRoom?.id"
        :current-user="authState.user.name"
        @room-selected="onRoomSelected"
        @room-created="onRoomCreated"
      )
      .loading-state(v-else)
        | {{ $t('common.loading') }}
    
    .main-content(:class="{ 'mobile-hidden': !selectedChatRoom && isMobile }")
      chat-room(
        v-if="authState && authState.user && authState.user.name"
        :chat-room="selectedChatRoom"
        :current-user="authState.user"
        @back="onBackToRoomList"
      )
      .loading-state(v-else)
        | {{ $t('common.loading') }}
</template>

<script>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, authState } from '@/composables/useAuth'
import ChatRoom from '@/components/chat/ChatRoom.vue'
import ChatRoomList from '@/components/chat/ChatRoomList.vue'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.vue'

export default {
  name: 'ChatPage',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  components: {
    ChatRoom,
    ChatRoomList,
    LanguageSwitcher
  },
  setup(props) {
    const { initializeAuth } = useAuth()
    const router = useRouter()
    const state = reactive({})
    
    // authStateが確実に利用可能であることを保証
    if (!authState) {
      console.error('authState is not available')
    }

    const selectedChatRoom = ref(null)
    const isMobile = ref(false)

    /**
     * チャットルームが選択された時の処理
     * @param {Object} room - 選択されたチャットルーム
     */
    function onRoomSelected(room) {
      selectedChatRoom.value = room
    }

    /**
     * 新しいチャットルームが作成された時の処理
     * @param {Object} room - 作成されたチャットルーム
     */
    function onRoomCreated(room) {
      selectedChatRoom.value = room
    }

    /**
     * モバイルでチャットルーム一覧に戻る
     */
    function onBackToRoomList() {
      if (isMobile.value) {
        selectedChatRoom.value = null
      }
    }

    /**
     * 画面サイズの変更を監視
     */
    function handleResize() {
      isMobile.value = window.innerWidth <= 768
    }

    onMounted(async function() {
      // URLパラメータからユーザーIDを取得
      const urlUserId = props.userId
      
      try {
        // 認証状態を初期化
        await initializeAuth()
        
        // 認証状態の確認
        if (!authState.isAuthenticated || !authState.user) {
          router.push('/')
          return
        }
        
        // ユーザーIDの比較（文字列として比較）
        const currentUserId = authState.user.id?.toString()
        
        if (currentUserId !== urlUserId) {
          router.push('/')
          return
        }
        
        // 画面サイズの監視を開始
        handleResize()
        window.addEventListener('resize', handleResize)
        
      } catch (error) {
        router.push('/')
      }
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      state,
      authState,
      selectedChatRoom,
      isMobile,
      onRoomSelected,
      onRoomCreated,
      onBackToRoomList
    }
  }
}
</script>

<style scoped>
.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e1e8ed;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 20px;
  font-weight: 700;
  color: #00b900;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.app-content {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sidebar {
  width: 320px;
  background: #ffffff;
  border-right: 1px solid #e1e8ed;
  transition: transform 0.3s ease;
}

.main-content {
  flex: 1;
  background: #ffffff;
  transition: transform 0.3s ease;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .app-content {
    position: relative;
  }

  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    border-right: none;
  }

  .sidebar.mobile-hidden {
    transform: translateX(-100%);
  }

  .main-content {
    width: 100%;
    height: 100%;
  }

  .main-content.mobile-hidden {
    transform: translateX(100%);
  }

  .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 8px 16px;
  }

  .app-title {
    font-size: 18px;
  }

  .sidebar {
    width: 100%;
  }
}
</style>
