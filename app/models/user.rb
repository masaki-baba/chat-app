class User < ApplicationRecord
  has_many :chat_room_users, dependent: :destroy
  has_many :chat_rooms, through: :chat_room_users
  has_many :created_chat_rooms, class_name: 'ChatRoom', foreign_key: 'created_by_id', dependent: :destroy
  has_many :messages, dependent: :destroy

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  scope :search_by_name, ->(query) { where('name LIKE ?', "%#{query}%") }

  def display_name
    name
  end

  def online?
    last_seen_at && last_seen_at > 5.minutes.ago
  end

  # ユーザーの最終アクセス時刻を更新
  def update_last_seen!
    update!(last_seen_at: Time.current)
  end

  # 名前からユーザーを検索または作成（後方互換性）
  def self.find_or_create_by_name(name)
    user = find_by(name: name)
    return user if user

    # UUIDベースのユニークなメールアドレスを生成
    # これにより日本語文字の問題を完全に回避
    unique_id = SecureRandom.uuid
    email = "user_#{unique_id}@chatapp.local"

    create!(
      name: name,
      email: email,
      last_seen_at: Time.current
    )
  end

  # 名前とメールアドレスからユーザーを検索または作成
  def self.find_or_create_by_credentials(name, email)
    # 既存ユーザーを名前またはメールアドレスで検索
    user = find_by(name: name) || find_by(email: email)
    return user if user

    # 新規ユーザー作成
    create!(
      name: name,
      email: email,
      last_seen_at: Time.current
    )
  end
end
