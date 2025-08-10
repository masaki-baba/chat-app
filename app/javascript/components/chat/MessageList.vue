<template lang="pug">
.flex.flex-col.h-full.overflow-hidden
  .flex-1.overflow-y-auto.p-4.space-y-4(ref="state.messagesContainer")
    LoadingSpinner(v-if="loading" class="mx-auto")
    .text-center.text-gray-500(v-else-if="messages.length === 0")
      | {{ $t('chat.no_messages') }}
    .space-y-4(v-else)
      .flex(
        v-for="message in messages"
        :key="message.id"
        :class="message.user_name === currentUser ? 'justify-end' : 'justify-start'"
      )
        .max-w-xs.lg:max-w-md(
          :class="message.user_name === currentUser ? 'order-2' : 'order-1'"
        )
          .text-xs.text-gray-500.mb-1(
            :class="message.user_name === currentUser ? 'text-right' : 'text-left'"
          )
            | {{ message.user_name }} • {{ message.formatted_time }}
          .px-4.py-2.rounded-lg(
            :class="message.user_name === currentUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'"
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
