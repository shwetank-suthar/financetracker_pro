// Simple Web Speech API wrapper (MVP) for voice commands

const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

export const voiceService = {
  isSupported() {
    return Boolean(SpeechRecognition)
  },

  createRecognition({ lang = 'en-IN', continuous = false, interimResults = true } = {}) {
    if (!this.isSupported()) return null
    const rec = new SpeechRecognition()
    rec.lang = lang
    rec.continuous = continuous
    rec.interimResults = interimResults
    rec.maxAlternatives = 1
    return rec
  }
}

export default voiceService


