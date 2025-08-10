class Api::V1::ChatRoomsController < ApplicationController
  before_action :set_current_user
  before_action :set_chat_room, only: [:show]

  def index
    @chat_rooms = ChatRoom.for_user(@current_user)
                          .includes(:users, :messages)
                          .recent
    
    render json: @chat_rooms.map { |room| chat_room_json(room) }
  end

  def show
    @messages = @chat_room.messages
                          .includes(:user)
                          .recent
                          .limit(50)
    
    render json: {
      chat_room: chat_room_json(@chat_room),
      messages: @messages.map { |message| message_json(message) }
    }
  end

  def create
    if params[:user_id].present?
      # ダイレクトチャットの作成
      other_user = User.find(params[:user_id])
      @chat_room = ChatRoom.find_or_create_direct_chat(@current_user, other_user)
    else
      # グループチャットの作成
      @chat_room = ChatRoom.new(chat_room_params.merge(
        created_by: @current_user,
        room_type: 'group'
      ))
      
      if @chat_room.save
        @chat_room.chat_room_users.create!(
          user: @current_user,
          role: 'admin',
          joined_at: Time.current
        )
      end
    end

    if @chat_room.persisted?
      render json: chat_room_json(@chat_room), status: :created
    else
      render json: { errors: @chat_room.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def join
    @chat_room = ChatRoom.find(params[:id])
    
    unless @chat_room.chat_room_users.exists?(user: @current_user)
      @chat_room.chat_room_users.create!(
        user: @current_user,
        role: 'member',
        joined_at: Time.current
      )
    end
    
    render json: chat_room_json(@chat_room)
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
    @chat_room = ChatRoom.for_user(@current_user).find(params[:id])
  end

  def chat_room_params
    params.require(:chat_room).permit(:name, :description)
  end

  def chat_room_json(chat_room)
    {
      id: chat_room.id,
      name: chat_room.display_name(@current_user),
      description: chat_room.description,
      room_type: chat_room.room_type,
      last_message_at: chat_room.last_message_at,
      last_message: chat_room.last_message&.content,
      users: chat_room.users.map { |user| 
        {
          id: user.id,
          name: user.name,
          online: user.online?
        }
      },
      created_at: chat_room.created_at
    }
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
