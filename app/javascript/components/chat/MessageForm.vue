<template lang="pug">
.p-4.bg-gray-50
  form.flex.space-x-4(@submit.prevent="onSubmit")
    input(
      v-model="state.messageContent"
      type="text"
      :placeholder="$t('chat.message_placeholder')"
      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      :disabled="!currentUser"
      maxlength="1000"
    )
    button(
      type="submit"
      class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:bg-gray-400"
      :disabled="!state.messageContent.trim() || !currentUser"
    )
      | {{ $t('chat.send_button') }}
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'MessageForm',
  props: {
    currentUser: {
      type: String,
      default: ''
    }
  },
  emits: ['send'],
  setup(props, { emit }) {
    const state = reactive({
      messageContent: ''
    })

    /**
     * メッセージ送信フォームの送信処理
     */
    function onSubmit() {
      if (state.messageContent.trim() && props.currentUser) {
        emit('send', state.messageContent.trim())
        state.messageContent = ''
      }
    }

    return {
      state,
      onSubmit
    }
  }
}
</script>
