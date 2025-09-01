# Vue.js + Rails LiveChatty Application

A real-time chat application built with Rails 7 (API-only) + Vue.js 3 (SPA)

## Technology Stack

- **Backend**: Ruby 3.2.0, Rails 7.1.0, MySQL 8.x, Action Cable
- **Frontend**: Vue.js 3 (Composition API), Vue Router 4, Vue I18n 9, Vite
- **Real-time Communication**: WebSocket (Action Cable)
- **Testing**: RSpec (Rails), Vitest (Vue.js)
- **Internationalization**: Page-specific YAML translation files (English/Japanese)

## Setup Instructions

### 1. Install Dependencies

```bash
# Ruby dependencies
bundle install

# Node.js dependencies
npm install
```

### 2. Database Setup

```bash
# Create database
rails db:create

# Run migrations
rails db:migrate

# Seed data (optional)
rails db:seed
```

### 3. Start Redis

```bash
# For macOS
brew services start redis

# Or start directly
redis-server
```

### 4. Start Application

```bash
# Start Rails server (Terminal 1)
rails server

# Start Vite development server (Terminal 2)
npm run dev
```

The application will be accessible at http://localhost:3000

## Running Tests

### Backend Tests (RSpec)

```bash
bundle exec rspec
```

### Frontend Tests (Vitest)

```bash
npm run test
```

## Features

- Real-time messaging
- Multi-language support (Japanese/English)
- Responsive design
- WebSocket connection status display
- Message history display

## Usage

1. Enter username on the homepage
2. Join a chat room
3. Send and receive messages in real-time

## Database Management

### Sequel Ace Connection Information

You can use Sequel Ace to manage the MySQL database with a GUI.

**Installation:**
```bash
# Install Sequel Ace
brew install --cask sequel-ace
```

**Connection Settings:**
- **Connection Type**: Standard
- **Host**: localhost (or 127.0.0.1)
- **Username**: root
- **Password**: (blank)
- **Database**: chat_app_development
- **Port**: 3306

**Connection Steps:**
1. Launch Sequel Ace
2. Create a new connection
3. Enter the above settings
4. Click "Connect"

## Development

- Vue.js components are located in `app/javascript/components/`
- Rails API endpoints are located in `app/controllers/api/v1/`
- Translation files are located in `app/javascript/i18n/locales/`
