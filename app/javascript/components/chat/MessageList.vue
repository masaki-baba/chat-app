<template lang="pug">
.messages-container(ref="state.messagesContainer")
  LoadingSpinner(v-if="loading" class="loading-spinner")
  .no-messages(v-else-if="messages.length === 0")
    | {{ $t('chat.no_messages') }}
  div(v-else)
    .message-row(
      v-for="message in messages"
      :key="message.id"
      :class="message.user_name === currentUser ? 'message-end' : 'message-start'"
    )
      .message-bubble(
        :class="message.user_name === currentUser ? 'message-order-2' : 'message-order-1'"
      )
        .message-meta(
          :class="message.user_name === currentUser ? 'message-meta-right' : 'message-meta-left'"
        )
          | {{ message.user_name }} • {{ message.formatted_time }}
        .message-content(
          :class="message.user_name === currentUser ? 'message-sent' : 'message-received'"
        )
          | {{ message.content }}
</template>

<script>
import { reactive, watch, nextTick } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'MessageList',
  components: {
    LoadingSpinner
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
      type: String,
      default: ''
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

    return {
      state
    }
  }
}
</script>
