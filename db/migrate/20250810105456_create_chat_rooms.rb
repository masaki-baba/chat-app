class CreateChatRooms < ActiveRecord::Migration[7.1]
  def change
    create_table :chat_rooms do |t|
      t.string :name
      t.string :room_type, default: 'direct' # 'direct' or 'group'
      t.text :description
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.datetime :last_message_at

      t.timestamps
    end
    
    add_index :chat_rooms, :room_type
    add_index :chat_rooms, :last_message_at
  end
end
