source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.1.4"

gem "rails", "~> 7.1.0"
gem "mysql2", "~> 0.5"
gem "puma", "~> 5.0"
gem "bootsnap", ">= 1.4.4", require: false
gem "jsbundling-rails"
gem "redis", "~> 4.0"
gem "rack-cors"

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
  gem "rspec-rails"
  gem "factory_bot_rails"
end

group :development do
  gem "listen", "~> 3.3"
  gem "spring"
  gem "vite_rails"
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara"
  gem "selenium-webdriver"
end
