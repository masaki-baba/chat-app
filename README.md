# Vue.js + Rails LiveChattyアプリ

Rails 7 (API専用) + Vue.js 3 (SPA) によるLiveChattyアプリケーション

## 技術スタック

- **バックエンド**: Ruby 3.2.0, Rails 7.1.0, MySQL 8.x, Action Cable
- **フロントエンド**: Vue.js 3 (Composition API), Vue Router 4, Vue I18n 9, Vite
- **リアルタイム通信**: WebSocket (Action Cable)
- **テスト**: RSpec (Rails), Vitest (Vue.js)
- **国際化**: ページ別YAML翻訳ファイル (英語・日本語)

## セットアップ手順

### 1. 依存関係のインストール

```bash
# Ruby依存関係
bundle install

# Node.js依存関係
npm install
```

### 2. データベースセットアップ

```bash
# データベース作成
rails db:create

# マイグレーション実行
rails db:migrate

# シードデータ投入（オプション）
rails db:seed
```

### 3. Redis起動

```bash
# macOSの場合
brew services start redis

# または直接起動
redis-server
```

### 4. アプリケーション起動

```bash
# Rails サーバー起動（ターミナル1）
rails server

# Vite 開発サーバー起動（ターミナル2）
npm run dev
```

アプリケーションは http://localhost:3000 でアクセス可能です。

## テスト実行

### バックエンドテスト（RSpec）

```bash
bundle exec rspec
```

### フロントエンドテスト（Vitest）

```bash
npm run test
```

## 機能

- リアルタイムメッセージング
- 多言語対応（日本語・英語）
- レスポンシブデザイン
- WebSocket接続状態表示
- メッセージ履歴表示

## 使用方法

1. ホームページでユーザー名を入力
2. チャットルームに参加
3. リアルタイムでメッセージを送受信

## データベース管理

### Sequel Ace接続情報

MySQLデータベースをGUIで管理するために、Sequel Aceを使用できます。

**インストール:**
```bash
# Sequel Aceをインストール
brew install --cask sequel-ace
```

**接続設定:**
- **接続タイプ**: Standard
- **ホスト**: localhost (または 127.0.0.1)
- **ユーザー名**: root
- **パスワード**: (空白)
- **データベース**: chat_app_development
- **ポート**: 3306

**接続手順:**
1. Sequel Aceを起動
2. 新しい接続を作成
3. 上記の設定を入力
4. 「接続」をクリック

## 開発

- Vue.js コンポーネントは `app/javascript/components/` に配置
- Rails API は `app/controllers/api/v1/` に配置
- 翻訳ファイルは `app/javascript/i18n/locales/` に配置
