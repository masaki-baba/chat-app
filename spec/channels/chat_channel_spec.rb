require 'rails_helper'

RSpec.describe ChatChannel, type: :channel do
  it 'subscribes to chat_channel stream' do
    subscribe
    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from('chat_channel')
  end

  it 'unsubscribes successfully' do
    subscribe
    unsubscribe
    expect(subscription).not_to be_confirmed
  end
end
