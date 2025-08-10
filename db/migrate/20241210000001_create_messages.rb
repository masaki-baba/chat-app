class CreateMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :messages do |t|
      t.text :content, null: false
      t.string :user_name, null: false, limit: 255
      
      t.timestamps
    end
    
    add_index :messages, :created_at
  end
end
