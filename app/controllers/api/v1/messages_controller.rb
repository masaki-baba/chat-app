class Api::V1::MessagesController < ApplicationController
  before_action :set_current_user
  before_action :set_chat_room

  def index
    @messages = @chat_room.messages
                          .includes(:user)
                          .recent
                          .limit(50)
    
    render json: @messages.map { |message| message_json(message) }
  end

  def create
    @message = @chat_room.messages.build(message_params.merge(user: @current_user))
    
    if @message.save
      # Broadcast to chat room specific channel
      ActionCable.server.broadcast(
        "chat_room_#{@chat_room.id}",
        {
          id: @message.id,
          content: @message.content,
          message_type: @message.message_type,
          user: {
            id: @message.user.id,
            name: @message.user.name
          },
          formatted_time: @message.formatted_time,
          created_at: @message.created_at
        }
      )
      
      render json: message_json(@message), status: :created
    else
      render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_current_user
    # セッションベースの認証
    user_id = session[:user_id]
    @current_user = User.find_by(id: user_id) if user_id
    
    unless @current_user
      render json: { error: 'User not authenticated' }, status: :unauthorized
      return
    end
  end

  def set_chat_room
    @chat_room = ChatRoom.for_user(@current_user).find(params[:chat_room_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Chat room not found' }, status: :not_found
  end

  def message_params
    params.require(:message).permit(:content, :message_type)
  end

  def message_json(message)
    {
      id: message.id,
      content: message.content,
      message_type: message.message_type,
      user: {
        id: message.user.id,
        name: message.user.name
      },
      formatted_time: message.formatted_time,
      created_at: message.created_at
    }
  end
end
