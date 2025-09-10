// Simple browser notification helper (MVP). Works while tab is open.

export const notificationService = {
  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window
  },

  getPermission() {
    if (!this.isSupported()) return 'denied'
    return Notification.permission
  },

  async requestPermission() {
    if (!this.isSupported()) return 'denied'
    try {
      const perm = await Notification.requestPermission()
      return perm
    } catch {
      return 'denied'
    }
  },

  canNotify() {
    return this.isSupported() && this.getPermission() === 'granted'
  },

  show(title, options = {}) {
    if (!this.canNotify()) return null
    try {
      const n = new Notification(title, {
        icon: '/favicon.ico',
        ...options
      })
      return n
    } catch (e) {
      console.error('Notification error:', e)
      return null
    }
  }
}

export default notificationService


