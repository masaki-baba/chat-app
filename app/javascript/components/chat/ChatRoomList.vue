<template lang="pug">
.chat-room-list
  .header
    h2.title {{ $t('chat.rooms.title') }}
    button.new-chat-btn(@click="onNewChatClick")
      i.icon-plus
      | {{ $t('chat.rooms.newChat') }}
  
  .search-bar
    input.search-input(
      v-model="state.searchQuery"
      :placeholder="$t('chat.rooms.search')"
      @input="onSearchInput"
    )
  
  .room-list(v-if="!loading")
    .room-item(
      v-for="room in filteredRooms"
      :key="room.id"
      :class="{ active: selectedRoomId === room.id }"
      @click="onRoomSelect(room)"
    )
      .room-avatar
        .avatar-circle(:class="room.room_type")
          | {{ getAvatarText(room) }}
      
      .room-info
        .room-name {{ room.name }}
        .last-message(v-if="room.last_message")
          | {{ room.last_message }}
        .no-message(v-else)
          | {{ $t('chat.rooms.noMessages') }}
      
      .room-meta
        .time(v-if="room.last_message_at")
          | {{ formatTime(room.last_message_at) }}
        .online-indicator(v-if="isDirectChatOnline(room)")
  
  .loading(v-else)
    | {{ $t('common.loading') }}
  
  .error(v-if="error")
    | {{ error }}

  // 新規チャット作成モーダル
  new-chat-modal(
    :show="state.showNewChatModal"
    @close="onModalClose"
    @chat-created="onChatCreated"
  )
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
import { useChatRooms } from '@/composables/useChatRooms'
import NewChatModal from './NewChatModal.vue'

export default {
  name: 'ChatRoomList',
  components: {
    NewChatModal
  },
  props: {
    selectedRoomId: {
      type: Number,
      default: null
    },
    currentUser: {
      type: String,
      required: true
    }
  },
  emits: ['room-selected', 'room-created'],
  setup(props, { emit }) {
    const state = reactive({
      searchQuery: '',
      showNewChatModal: false
    })

    const { state: chatRoomsState, setCurrentUser, fetchChatRooms } = useChatRooms()

    const filteredRooms = computed(() => {
      if (!state.searchQuery.trim()) {
        return chatRoomsState.chatRooms
      }
      
      return chatRoomsState.chatRooms.filter(function(room) {
        return room.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      })
    })

    const loading = computed(() => chatRoomsState.loading)
    const error = computed(() => chatRoomsState.error)

    function onSearchInput() {
      // リアルタイム検索の実装
    }

    function onRoomSelect(room) {
      emit('room-selected', room)
    }

    function onNewChatClick() {
      state.showNewChatModal = true
    }

    function getAvatarText(room) {
      if (room.room_type === 'direct') {
        // ダイレクトチャットの場合、相手のユーザー名の最初の文字
        const otherUser = room.users?.find(function(user) {
          return user.name !== props.currentUser
        })
        return otherUser?.name?.charAt(0).toUpperCase() || '?'
      } else {
        // グループチャットの場合、グループ名の最初の文字
        return room.name?.charAt(0).toUpperCase() || 'G'
      }
    }

    function formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      if (diff < 24 * 60 * 60 * 1000) {
        // 24時間以内は時刻表示
        return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
      } else if (diff < 7 * 24 * 60 * 60 * 1000) {
        // 1週間以内は曜日表示
        return date.toLocaleDateString('ja-JP', { weekday: 'short' })
      } else {
        // それ以上は日付表示
        return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
      }
    }

    function isDirectChatOnline(room) {
      if (room.room_type !== 'direct') return false
      const otherUser = room.users?.find(function(user) {
        return user.name !== props.currentUser
      })
      return otherUser?.online || false
    }

    function onModalClose() {
      state.showNewChatModal = false
    }

    function onChatCreated(chatRoom) {
      emit('room-created', chatRoom)
      onModalClose()
    }

    onMounted(async function() {
      if (!props.currentUser) {
        return
      }
      
      try {
        setCurrentUser(props.currentUser)
        await fetchChatRooms()
      } catch (error) {
        // エラーハンドリング
      }
    })

    return {
      state,
      filteredRooms,
      loading,
      error,
      onSearchInput,
      onRoomSelect,
      onNewChatClick,
      getAvatarText,
      formatTime,
      isDirectChatOnline,
      onModalClose,
      onChatCreated
    }
  }
}
</script>


