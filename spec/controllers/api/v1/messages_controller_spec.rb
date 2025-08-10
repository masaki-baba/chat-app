require 'rails_helper'

RSpec.describe Api::V1::MessagesController, type: :controller do
  describe 'GET #index' do
    it 'returns a successful response' do
      get :index
      expect(response).to be_successful
    end

    it 'returns messages in JSON format' do
      message = Message.create!(content: 'Test message', user_name: 'Test User')
      get :index
      expect(response.content_type).to include('application/json')
      json_response = JSON.parse(response.body)
      expect(json_response).to be_an(Array)
      expect(json_response.first['content']).to eq('Test message')
    end
  end

  describe 'POST #create' do
    let(:valid_params) do
      {
        message: {
          content: 'Hello world',
          user_name: 'Test User'
        }
      }
    end

    it 'creates a new message' do
      expect {
        post :create, params: valid_params
      }.to change(Message, :count).by(1)
    end

    it 'returns the created message' do
      post :create, params: valid_params
      expect(response).to have_http_status(:created)
      json_response = JSON.parse(response.body)
      expect(json_response['content']).to eq('Hello world')
    end

    it 'returns errors for invalid params' do
      invalid_params = { message: { content: '', user_name: '' } }
      post :create, params: invalid_params
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
