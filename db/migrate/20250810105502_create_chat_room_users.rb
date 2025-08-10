class CreateChatRoomUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :chat_room_users do |t|
      t.references :chat_room, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role, default: 'member' # 'admin', 'member'
      t.datetime :joined_at
      t.datetime :last_read_at

      t.timestamps
    end
    
    add_index :chat_room_users, [:chat_room_id, :user_id], unique: true
  end
end
