class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: [:show]

  def index
    @users = User.all
    if params[:search].present?
      @users = @users.search_by_name(params[:search])
    end
    
    render json: @users.map { |user| user_json(user) }
  end

  def show
    render json: user_json(@user)
  end

  def create
    @user = User.new(user_params)
    
    if @user.save
      render json: user_json(@user), status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def find_or_create
    existing_user = User.find_by(name: params[:name])
    @user = User.find_or_create_by_name(params[:name])
    @user.update_last_seen!
    
    status = existing_user ? :ok : :created
    render json: user_json(@user), status: status
  end

  def login
    if params[:email].present?
      # 名前とメールアドレス両方が提供された場合
      existing_user = User.find_by(name: params[:name]) || User.find_by(email: params[:email])
      @user = User.find_or_create_by_credentials(params[:name], params[:email])
    else
      # 名前のみの場合（後方互換性）
      existing_user = User.find_by(name: params[:name])
      @user = User.find_or_create_by_name(params[:name])
    end
    
    @user.update_last_seen!
    session[:user_id] = @user.id
    
    status = existing_user ? :ok : :created
    render json: user_json(@user), status: status
  end

  def current_user
    if session[:user_id]
      @user = User.find_by(id: session[:user_id])
      if @user
        @user.update_last_seen!
        render json: user_json(@user)
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    else
      render json: { error: 'Not logged in' }, status: :unauthorized
    end
  end

  def logout
    session[:user_id] = nil
    render json: { message: 'Logged out successfully' }
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :avatar_url)
  end

  def user_json(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      online: user.online?,
      last_seen_at: user.last_seen_at,
      created_at: user.created_at
    }
  end
end
