class ApplicationController < ActionController::Base
  # Disable CSRF protection for API endpoints
  protect_from_forgery with: :null_session
  
  def fallback_index_html
    render 'layouts/application'
  end
end
