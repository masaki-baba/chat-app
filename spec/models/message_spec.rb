require 'rails_helper'

RSpec.describe Message, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      message = Message.new(content: 'Hello world', user_name: 'Test User')
      expect(message).to be_valid
    end

    it 'is not valid without content' do
      message = Message.new(user_name: 'Test User')
      expect(message).not_to be_valid
    end

    it 'is not valid without user_name' do
      message = Message.new(content: 'Hello world')
      expect(message).not_to be_valid
    end

    it 'is not valid with content longer than 1000 characters' do
      message = Message.new(content: 'a' * 1001, user_name: 'Test User')
      expect(message).not_to be_valid
    end

    it 'is not valid with user_name longer than 50 characters' do
      message = Message.new(content: 'Hello world', user_name: 'a' * 51)
      expect(message).not_to be_valid
    end
  end

  describe '#formatted_time' do
    it 'returns time in HH:MM format' do
      message = Message.create!(content: 'Hello', user_name: 'Test')
      expect(message.formatted_time).to match(/\A\d{2}:\d{2}\z/)
    end
  end
end
