class ChatChannel < ApplicationCable::Channel
  def subscribed
    # チャットルーム固有のチャンネルに接続
    chat_room_id = params[:chat_room_id]
    if chat_room_id.present?
      stream_from "chat_room_#{chat_room_id}"
    else
      reject
    end
  end
  
  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    # クライアントからのメッセージを処理
    # 必要に応じてメッセージの送信処理をここに追加
  end
end
