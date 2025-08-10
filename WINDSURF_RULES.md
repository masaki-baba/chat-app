# Windsurf コーディング規約

このプロジェクトでは以下のコーディング規約を厳守してください。

## Vue.js コンポーネント規約

### 1. 関数定義
- **computed以外はアロー関数を使用禁止**
- 通常の関数宣言を使用する
```javascript
// ❌ NG
const handleClick = () => { ... }

// ✅ OK
function handleClick() { ... }
```

### 2. リアクティブデータ
- **refは原則使用禁止、reactive stateを使用**
- 単一の値でもreactiveオブジェクトに含める
```javascript
// ❌ NG
const count = ref(0)
const name = ref('')

// ✅ OK
const state = reactive({
  count: 0,
  name: ''
})
```

### 3. スタイル定義
- **Vueファイル内でのstyle定義禁止**
- 各ページ・コンポーネントごとにSCSSファイルを作成
- 共通スタイルは`common.scss`に定義
```
app/javascript/styles/
├── common/common.scss
├── components/chat/chat-room-list.scss
├── pages/chat-page.scss
└── main.scss
```

### 4. Vue Composition API
- **setup関数を使用**
- `<script setup>`は使用禁止
```javascript
// ✅ OK
export default {
  name: 'ComponentName',
  props: { ... },
  emits: ['event-name'],
  setup(props, { emit }) {
    // ロジック
    return {
      // テンプレートで使用する変数・関数
    }
  }
}
```

### 5. イベントハンドラ命名規則
- **on + イベント名 + α の命名規則を使用**
```javascript
// ✅ OK
function onSubmit() { ... }
function onRoomSelected() { ... }
function onNewChatCreated() { ... }
```

### 6. コンポーネント参照
- **テンプレート内でのコンポーネント参照はケバブケースを使用**
```pug
// ❌ NG
ChatRoomList(
  :selected-room-id="selectedRoomId"
)

// ✅ OK
chat-room-list(
  :selected-room-id="selectedRoomId"
)
```

## ファイル構造規約

### ディレクトリ構造
```
app/javascript/
├── components/
│   ├── chat/
│   ├── common/
│   └── layout/
├── pages/
├── composables/
├── styles/
│   ├── common/
│   ├── components/
│   └── pages/
└── i18n/
```

### 命名規則
- **コンポーネント**: PascalCase (`ChatRoomList.vue`)
- **ページ**: PascalCase + Page suffix (`ChatPage.vue`)
- **SCSS**: kebab-case (`chat-room-list.scss`)
- **関数**: camelCase (`onClickSubmit`)
- **変数**: camelCase (`chatRooms`)

## 実装例

### Vue コンポーネント例
```javascript
export default {
  name: 'ChatRoomList',
  props: {
    selectedRoomId: Number,
    currentUser: String
  },
  emits: ['room-selected', 'room-created'],
  setup(props, { emit }) {
    const state = reactive({
      searchQuery: '',
      showModal: false,
      loading: false,
      error: null,
      chatRooms: []
    })

    function onSearchInput() {
      // 検索処理
    }

    function onRoomSelect(room) {
      emit('room-selected', room)
    }

    function onModalClose() {
      state.showModal = false
    }

    return {
      state,
      onSearchInput,
      onRoomSelect,
      onModalClose
    }
  }
}
```

## 注意事項

1. **既存コードの修正時は必ずこの規約に従う**
2. **新規コンポーネント作成時は必ずこの規約を適用**
3. **規約違反を発見した場合は即座に修正**
4. **レビュー時はこの規約への準拠を必ず確認**

## 更新履歴

- 2025-08-10: 初版作成
