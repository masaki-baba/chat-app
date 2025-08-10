class Message < ApplicationRecord
  validates :content, presence: true, length: { maximum: 1000 }
  validates :user_name, presence: true, length: { maximum: 50 }
  
  def formatted_time
    created_at.strftime('%H:%M')
  end
end
