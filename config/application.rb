require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module ChatApp
  class Application < Rails::Application
    config.load_defaults 7.1
    
    # API-only configuration
    config.api_only = false # Keep false to serve static files
    
    # CORS configuration
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'localhost:3000', 'localhost:5173'
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head],
          credentials: true
      end
    end
    
    # Action Cable configuration
    config.action_cable.disable_request_forgery_protection = true
  end
end
