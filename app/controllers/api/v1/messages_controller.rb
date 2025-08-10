class Api::V1::MessagesController < ApplicationController
  def index
    messages = Message.order(created_at: :desc).limit(50).reverse
    render json: messages.as_json(methods: [:formatted_time])
  end

  def create
    message = Message.new(message_params)
    
    if message.save
      # Broadcast to all clients via ActionCable
      ActionCable.server.broadcast(
        'chat_channel',
        {
          id: message.id,
          content: message.content,
          user_name: message.user_name,
          created_at: message.created_at,
          formatted_time: message.formatted_time
        }
      )
      
      render json: message.as_json(methods: [:formatted_time]), status: :created
    else
      render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def message_params
    params.require(:message).permit(:content, :user_name)
  end
end
