<template lang="pug">
.user-avatar(:class="sizeClass")
  .avatar-circle(:style="avatarStyle")
    | {{ initials }}
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'medium',
      validator: function(value) {
        return ['small', 'medium', 'large'].includes(value)
      }
    }
  },
  setup(props) {
    /**
     * ユーザー名から頭文字を取得
     */
    function getInitials(name) {
      if (!name) return '?'
      
      const words = name.trim().split(/\s+/)
      if (words.length === 1) {
        return words[0].charAt(0).toUpperCase()
      }
      
      return words.slice(0, 2)
        .map(function(word) { return word.charAt(0).toUpperCase() })
        .join('')
    }

    /**
     * ユーザーIDベースの色を生成
     */
    function getUserColor(userId) {
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
      ]
      
      const index = userId % colors.length
      return colors[index]
    }

    const initials = getInitials(props.user.name)
    const backgroundColor = getUserColor(props.user.id)
    
    const sizeClass = `avatar-${props.size}`
    const avatarStyle = {
      backgroundColor: backgroundColor,
      color: '#FFFFFF'
    }

    return {
      initials,
      sizeClass,
      avatarStyle
    }
  }
}
</script>
