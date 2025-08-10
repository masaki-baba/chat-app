import consumer from './consumer'

export default {
  connect(callbacks = {}) {
    return consumer.subscriptions.create('ChatChannel', {
      connected() {
        console.log('Connected to ChatChannel')
        if (callbacks.connected) callbacks.connected()
      },
      
      disconnected() {
        console.log('Disconnected from ChatChannel')
        if (callbacks.disconnected) callbacks.disconnected()
      },
      
      received(data) {
        console.log('Received:', data)
        if (callbacks.received) callbacks.received(data)
      }
    })
  }
}
