<template lang="pug">
.messages-container(ref="state.messagesContainer")
  loading-spinner(v-if="loading" class="loading-spinner")
  .no-messages(v-else-if="messages.length === 0")
    | {{ $t('chat.no_messages') }}
  .messages-list(v-else)
    .message-item(
      v-for="message in messages"
      :key="message.id"
      :class="isCurrentUserMessage(message) ? 'message-right' : 'message-left'"
    )
      .message-wrapper(
        :class="isCurrentUserMessage(message) ? 'message-wrapper-right' : 'message-wrapper-left'"
      )
        user-avatar(
          v-if="!isCurrentUserMessage(message)"
          :user="message.user" 
          size="medium"
        )
        .message-bubble(
          :class="isCurrentUserMessage(message) ? 'message-sent' : 'message-received'"
        )
          .message-meta(
            :class="isCurrentUserMessage(message) ? 'message-meta-right' : 'message-meta-left'"
          )
            | {{ message.user.name }} • {{ message.formatted_time }}
          .message-content(
            :class="isCurrentUserMessage(message) ? 'message-sent' : 'message-received'"
          )
            | {{ message.content }}
        user-avatar(
          v-if="isCurrentUserMessage(message)"
          :user="message.user" 
          size="medium"
        )
</template>

<script>
import { reactive, watch, nextTick, computed } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

export default {
  name: 'MessageList',
  components: {
    LoadingSpinner,
    UserAvatar
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: [String, Object],
      default: null
    }
  },
  setup(props) {
    const state = reactive({
      messagesContainer: null
    })

    /**
     * メッセージリストを最下部までスクロールする
     */
    async function scrollToBottom() {
      await nextTick()
      if (state.messagesContainer) {
        state.messagesContainer.scrollTop = state.messagesContainer.scrollHeight
      }
    }

    watch(() => props.messages, function() {
      scrollToBottom()
    }, { deep: true })

    /**
     * メッセージが現在のユーザーのものかどうかを判定（user_idベース）
     * @param {Object} message - メッセージオブジェクト
     * @returns {boolean} 現在のユーザーのメッセージかどうか
     */
    function isCurrentUserMessage(message) {
      if (!props.currentUser || !message || !message.user || !message.user.id) {
        console.log('isCurrentUserMessage: missing data', {
          hasCurrentUser: !!props.currentUser,
          hasMessage: !!message,
          hasMessageUser: !!(message && message.user),
          hasMessageUserId: !!(message && message.user && message.user.id)
        })
        return false
      }
      
      // currentUserがオブジェクトの場合はidを、文字列の場合は直接比較
      const currentUserId = typeof props.currentUser === 'object' 
        ? props.currentUser.id 
        : props.currentUser
      
      const result = message.user.id === currentUserId
      
      // 詳細デバッグログ
      console.log('isCurrentUserMessage detailed (user_id based):', {
        messageUserId: message.user.id,
        messageUserName: message.user.name,
        currentUserId: currentUserId,
        currentUser: props.currentUser,
        isCurrentUser: result,
        messageId: message.id
      })
      
      return result
    }

    // 時系列順のメッセージリスト（フィルタリング不要、テンプレートで条件分岐）
    // props.messagesを直接使用

    // デバッグ用: currentUserとメッセージの比較を確認
    watch(() => [props.currentUser, props.messages], function() {
      console.log('MessageList Debug:', {
        currentUser: props.currentUser,
        messagesCount: props.messages.length,
        firstMessage: props.messages[0] ? {
          user_name: props.messages[0].user_name,
          isCurrentUser: isCurrentUserMessage(props.messages[0])
        } : null
      })
    }, { deep: true, immediate: true })

    return {
      state,
      isCurrentUserMessage
    }
  }
}
</script>
