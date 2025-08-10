class ChatRoom < ApplicationRecord
  belongs_to :created_by, class_name: 'User'
  has_many :chat_room_users, dependent: :destroy
  has_many :users, through: :chat_room_users
  has_many :messages, dependent: :destroy

  validates :room_type, inclusion: { in: %w[direct group] }
  validates :created_by, presence: true

  scope :for_user, ->(user) { joins(:chat_room_users).where(chat_room_users: { user: user }) }
  scope :recent, -> { order(last_message_at: :desc) }

  def display_name(current_user = nil)
    return name if name.present?
    
    if direct?
      other_user = users.where.not(id: current_user&.id).first
      other_user&.display_name || 'Unknown User'
    else
      "Group Chat"
    end
  end

  def direct?
    room_type == 'direct'
  end

  def group?
    room_type == 'group'
  end

  def last_message
    messages.order(:created_at).last
  end

  def update_last_message_time!
    update!(last_message_at: Time.current)
  end

  # ダイレクトチャット用のファクトリメソッド
  def self.find_or_create_direct_chat(user1, user2)
    # 既存のダイレクトチャットを検索
    existing_room = ChatRoom.joins(:chat_room_users)
                           .where(room_type: 'direct')
                           .group('chat_rooms.id')
                           .having('COUNT(chat_room_users.id) = 2')
                           .where(chat_room_users: { user_id: [user1.id, user2.id] })
                           .first

    return existing_room if existing_room

    # 新しいダイレクトチャットを作成
    ChatRoom.transaction do
      room = ChatRoom.create!(
        room_type: 'direct',
        created_by: user1
      )
      
      room.chat_room_users.create!([
        { user: user1, role: 'member', joined_at: Time.current },
        { user: user2, role: 'member', joined_at: Time.current }
      ])
      
      room
    end
  end
end
