<template lang="pug">
.modal.new-chat-modal(v-if="show" @click="onModalClose")
  .modal-content(@click.stop)
    .modal-header
      h3 {{ $t('chat.rooms.newChatTitle') }}
      button.close-btn(@click="onModalClose") ×
    
    .modal-body
      .tab-buttons
        button.tab-btn(
          :class="{ active: state.activeTab === 'direct' }"
          @click="state.activeTab = 'direct'"
        ) {{ $t('chat.rooms.directChat') }}
        button.tab-btn(
          :class="{ active: state.activeTab === 'group' }"
          @click="state.activeTab = 'group'"
        ) {{ $t('chat.rooms.groupChat') }}
      
      // ダイレクトチャット作成
      .direct-chat-form(v-if="state.activeTab === 'direct'")
        .user-search
          b-tooltip(
            :target="'search-input'"
            :title="$t('chat.rooms.noUsersFound')"
            :show="state.showNoResultsTooltip"
            placement="top"
            triggers=""
          )
          input.search-input(
            id="search-input"
            v-model="state.userSearchQuery"
            :placeholder="$t('chat.rooms.searchUsers')"
            @input="onSearchUsers"
          )
        
        .search-results
          .loading(v-if="usersState.loading")
            | {{ $t('common.loading') }}
          
          .error(v-if="usersState.error")
            | {{ usersState.error }}
          
          .user-list(v-if="!usersState.loading && state.searchedUsers.length > 0")
            .user-item(
              v-for="user in state.searchedUsers"
              :key="user.id"
              @click="onCreateDirectChat(user)"
            )
              .user-avatar
                .avatar-circle
                  | {{ user.name.charAt(0).toUpperCase() }}
              .user-info
                .user-name {{ user.name }}
                .user-status(:class="{ online: user.online }")
                  | {{ user.online ? $t('user.online') : $t('user.offline') }}
      
      // グループチャット作成
      .group-chat-form(v-if="state.activeTab === 'group'")
        .form-group
          label {{ $t('chat.rooms.groupName') }}
          input.form-input(
            v-model="state.groupChatForm.name"
            :placeholder="$t('chat.rooms.groupNamePlaceholder')"
          )
        
        .form-group
          label {{ $t('chat.rooms.groupDescription') }}
          textarea.form-textarea(
            v-model="state.groupChatForm.description"
            :placeholder="$t('chat.rooms.groupDescriptionPlaceholder')"
          )
        
        button.create-btn(
          @click="onCreateGroupChat"
          :disabled="!state.groupChatForm.name.trim()"
        ) {{ $t('chat.rooms.createGroup') }}
</template>

<script>
import { reactive, watch } from 'vue'
import { useUsers } from '../../composables/useUsers'
import { BTooltip } from 'bootstrap-vue-next'

export default {
  name: 'NewChatModal',
  components: {
    BTooltip
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'chat-created'],
  setup(props, { emit }) {
    const usersComposable = useUsers()
    const usersState = usersComposable.state || reactive({ users: [], loading: false, error: null })
    const searchUsersApi = usersComposable.searchUsers

    const state = reactive({
      activeTab: 'direct',
      userSearchQuery: '',
      searchedUsers: [],
      showNoResultsTooltip: false,
      groupChatForm: {
        name: '',
        description: ''
      }
    })

    // ユーザー検索
    async function onSearchUsers() {
      if (state.userSearchQuery.trim()) {
        await searchUsersApi(state.userSearchQuery)
        state.searchedUsers = usersState.users || []
        
        // 検索結果が0件の場合、ツールチップ表示フラグを設定
        state.showNoResultsTooltip = !usersState.loading && !usersState.error && state.searchedUsers.length === 0
      } else {
        state.searchedUsers = []
        state.showNoResultsTooltip = false
      }
    }

    // ダイレクトチャット作成
    async function onCreateDirectChat(user) {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        const headers = {
          'Content-Type': 'application/json'
        }
        
        if (csrfToken) {
          headers['X-CSRF-Token'] = csrfToken
        }

        const response = await fetch('/api/v1/chat_rooms', {
          method: 'POST',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify({
            user_id: user.id
          })
        })

        if (response.ok) {
          const chatRoom = await response.json()
          emit('chat-created', chatRoom)
          onModalClose()
        }
      } catch (error) {
        console.error('Failed to create direct chat:', error)
      }
    }

    // グループチャット作成
    async function onCreateGroupChat() {
      if (!state.groupChatForm.name.trim()) return

      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        const headers = {
          'Content-Type': 'application/json'
        }
        
        if (csrfToken) {
          headers['X-CSRF-Token'] = csrfToken
        }

        const response = await fetch('/api/v1/chat_rooms', {
          method: 'POST',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify({
            name: state.groupChatForm.name,
            description: state.groupChatForm.description,
            room_type: 'group'
          })
        })

        if (response.ok) {
          const chatRoom = await response.json()
          emit('chat-created', chatRoom)
          onModalClose()
        }
      } catch (error) {
        console.error('Failed to create group chat:', error)
      }
    }

    // モーダルを閉じる
    function onModalClose() {
      emit('close')
      // フォームをリセット
      state.activeTab = 'direct'
      state.userSearchQuery = ''
      state.searchedUsers = []
      state.groupChatForm.name = ''
      state.groupChatForm.description = ''
    }

    // モーダルが表示されたときにフォーカス
    watch(() => props.show, function(newShow) {
      if (newShow) {
        state.activeTab = 'direct'
      }
    })

    return {
      state,
      usersState,
      onSearchUsers,
      onCreateDirectChat,
      onCreateGroupChat,
      onModalClose
    }
  }
}
</script>


