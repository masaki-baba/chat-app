class Message < ApplicationRecord
  belongs_to :chat_room
  belongs_to :user

  validates :content, presence: true, length: { maximum: 1000 }
  validates :message_type, inclusion: { in: %w[text image file system] }

  after_create :update_chat_room_last_message_time

  scope :for_chat_room, ->(chat_room) { where(chat_room: chat_room) }
  scope :recent, -> { order(:created_at) }

  def formatted_time
    created_at.strftime('%H:%M')
  end

  def formatted_date
    created_at.strftime('%Y-%m-%d')
  end

  def text?
    message_type == 'text'
  end

  def image?
    message_type == 'image'
  end

  def file?
    message_type == 'file'
  end

  def system?
    message_type == 'system'
  end

  def sender_name
    user&.display_name || 'Unknown User'
  end

  private

  def update_chat_room_last_message_time
    chat_room.update_last_message_time!
  end
end
