import { createConsumer } from "@rails/actioncable"

// WebSocket接続URLを明示的に指定
const wsUrl = process.env.NODE_ENV === 'production' 
  ? 'wss://your-domain.com/cable'
  : 'ws://localhost:3001/cable'

console.log('ActionCable consumer connecting to:', wsUrl)
export default createConsumer(wsUrl)
