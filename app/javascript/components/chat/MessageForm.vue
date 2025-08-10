<template lang="pug">
form.message-form(@submit.prevent="onSubmit")
  input.message-input(
    v-model="state.newMessage"
    type="text"
    :placeholder="$t('chat.message_placeholder')"
    :disabled="!currentUser"
  )
  button.btn-primary(
    type="submit"
    :disabled="!state.newMessage.trim() || !currentUser"
  )
    | {{ $t('chat.send') }}
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
      newMessage: ''
    })

    /**
     * メッセージ送信フォームの送信処理
     */
    function onSubmit() {
      if (state.newMessage.trim() && props.currentUser) {
        emit('send', state.newMessage.trim())
        state.newMessage = ''
      }
    }

    return {
      state,
      onSubmit
    }
  }
}
</script>
