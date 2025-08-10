class ChatRoomUser < ApplicationRecord
  belongs_to :chat_room
  belongs_to :user

  validates :role, inclusion: { in: %w[admin member] }
  validates :user_id, uniqueness: { scope: :chat_room_id }

  before_create :set_joined_at

  scope :admins, -> { where(role: 'admin') }
  scope :members, -> { where(role: 'member') }

  def admin?
    role == 'admin'
  end

  def member?
    role == 'member'
  end

  def mark_as_read!
    update!(last_read_at: Time.current)
  end

  private

  def set_joined_at
    self.joined_at ||= Time.current
  end
end
