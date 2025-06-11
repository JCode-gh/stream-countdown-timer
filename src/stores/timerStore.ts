import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface TimerSettings {
  duration: number // in minutes
  text: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  fontSize: number
  showProgressBar: boolean
  autoStart: boolean
  loopTimer: boolean
  playSound: boolean
  transparentBackground: boolean
}

export interface TimerPreset {
  id: string
  name: string
  settings: TimerSettings
}

export const useTimerStore = defineStore('timer', () => {
  // Timer state
  const isRunning = ref(false)
  const isPaused = ref(false)
  const timeRemaining = ref(0) // in seconds
  const intervalId = ref<number | null>(null)
  
  // Settings
  const settings = ref<TimerSettings>({
    duration: 10, // default 10 minutes
    text: 'STREAM STARTING SOON',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    fontSize: 72,
    showProgressBar: true,
    autoStart: false,
    loopTimer: false,
    playSound: true,
    transparentBackground: false
  })

  // Presets
  const presets = ref<TimerPreset[]>([
    {
      id: '1',
      name: 'Quick Start (1 min)',
      settings: { ...settings.value, duration: 1, text: 'STARTING SOON' }
    },
    {
      id: '5',
      name: 'Short Break (5 min)',
      settings: { ...settings.value, duration: 5, text: 'BE RIGHT BACK' }
    },
    {
      id: '10',
      name: 'Standard (10 min)',
      settings: { ...settings.value, duration: 10, text: 'STREAM STARTING SOON' }
    },
    {
      id: '15',
      name: 'Extended (15 min)',
      settings: { ...settings.value, duration: 15, text: 'STREAM STARTING SOON' }
    },
    {
      id: '30',
      name: 'Long Break (30 min)',
      settings: { ...settings.value, duration: 30, text: 'BACK SOON' }
    }
  ])

  // Computed properties
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const progressPercentage = computed(() => {
    const totalSeconds = settings.value.duration * 60
    return ((totalSeconds - timeRemaining.value) / totalSeconds) * 100
  })

  const isFinished = computed(() => timeRemaining.value <= 0)

  // Actions
  const startTimer = () => {
    if (timeRemaining.value <= 0) {
      resetTimer()
    }
    
    isRunning.value = true
    isPaused.value = false
    
    intervalId.value = window.setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        stopTimer()
        if (settings.value.playSound) {
          playNotificationSound()
        }
        if (settings.value.loopTimer) {
          resetTimer()
          startTimer()
        }
      }
    }, 1000)
  }

  const pauseTimer = () => {
    isPaused.value = true
    isRunning.value = false
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  const stopTimer = () => {
    isRunning.value = false
    isPaused.value = false
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    timeRemaining.value = settings.value.duration * 60
  }

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    saveSettingsToStorage()
    
    // If duration changed and timer is not running, reset
    if (newSettings.duration && !isRunning.value) {
      timeRemaining.value = settings.value.duration * 60
    }
  }

  const loadPreset = (presetId: string) => {
    const preset = presets.value.find(p => p.id === presetId)
    if (preset) {
      settings.value = { ...preset.settings }
      resetTimer()
      saveSettingsToStorage()
    }
  }

  const addCustomPreset = (name: string, presetSettings: TimerSettings) => {
    const newPreset: TimerPreset = {
      id: Date.now().toString(),
      name,
      settings: { ...presetSettings }
    }
    presets.value.push(newPreset)
    savePresetsToStorage()
  }

  const deletePreset = (presetId: string) => {
    const index = presets.value.findIndex(p => p.id === presetId)
    if (index > -1 && parseInt(presetId) > 5) { // Don't delete default presets
      presets.value.splice(index, 1)
      savePresetsToStorage()
    }
  }

  const generateBrowserSourceUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname
    
    // Put ALL settings directly in URL parameters BEFORE the hash for OBS
    const params = new URLSearchParams({
      minutes: settings.value.duration.toString(),
      text: settings.value.text,
      backgroundColor: settings.value.backgroundColor,
      textColor: settings.value.textColor,
      fontSize: settings.value.fontSize.toString(),
      fontFamily: settings.value.fontFamily,
      showProgressBar: settings.value.showProgressBar.toString(),
      playSound: settings.value.playSound.toString(),
      loopTimer: settings.value.loopTimer.toString(),
      autoStart: settings.value.autoStart.toString(),
      transparent: settings.value.transparentBackground.toString()
    })
    

    
    return `${baseUrl}?${params.toString()}#/display`
  }

  const parseUrlParams = () => {
    // Parse parameters from hash since Vue router puts them after #
    const hash = window.location.hash
    const queryStart = hash.indexOf('?')
    let urlParams: URLSearchParams
    
    if (queryStart !== -1) {
      const queryString = hash.substring(queryStart + 1)
      urlParams = new URLSearchParams(queryString)
    } else {
      // Fallback to regular search params
      urlParams = new URLSearchParams(window.location.search)
    }
    
    const params: Partial<TimerSettings> = {}
    
    console.log('=== URL PARAMS DEBUG ===')
    console.log('Current URL:', window.location.href)
    console.log('Hash:', window.location.hash)
    console.log('Search string:', window.location.search)
    console.log('Query string from hash:', queryStart !== -1 ? hash.substring(queryStart + 1) : 'none')
    console.log('All URL params:', Object.fromEntries(urlParams))
    
    // Parse all possible parameters
    if (urlParams.get('minutes')) {
      params.duration = parseInt(urlParams.get('minutes')!)
      console.log('Found minutes:', params.duration)
    }
    if (urlParams.get('text')) {
      params.text = urlParams.get('text')!
      console.log('Found text:', params.text)
    }
    if (urlParams.get('backgroundColor')) {
      params.backgroundColor = urlParams.get('backgroundColor')!
      console.log('Found backgroundColor:', params.backgroundColor)
    }
    if (urlParams.get('textColor')) {
      params.textColor = urlParams.get('textColor')!
      console.log('Found textColor:', params.textColor)
    }
    if (urlParams.get('fontSize')) {
      params.fontSize = parseInt(urlParams.get('fontSize')!)
      console.log('Found fontSize:', params.fontSize)
    }
    if (urlParams.get('fontFamily')) {
      params.fontFamily = urlParams.get('fontFamily')!
      console.log('Found fontFamily:', params.fontFamily)
    }
    if (urlParams.get('showProgressBar')) {
      params.showProgressBar = urlParams.get('showProgressBar') === 'true'
      console.log('Found showProgressBar:', params.showProgressBar)
    }
    if (urlParams.get('playSound')) {
      params.playSound = urlParams.get('playSound') === 'true'
      console.log('Found playSound:', params.playSound)
    }
    if (urlParams.get('loopTimer')) {
      params.loopTimer = urlParams.get('loopTimer') === 'true'
      console.log('Found loopTimer:', params.loopTimer)
    }
    if (urlParams.get('autoStart')) {
      params.autoStart = urlParams.get('autoStart') === 'true'
      console.log('Found autoStart:', params.autoStart)
    }
    if (urlParams.get('transparent')) {
      params.transparentBackground = urlParams.get('transparent') === 'true'
      console.log('Found transparent:', params.transparentBackground)
    }

    
    console.log('Parsed params:', params)
    console.log('Params count:', Object.keys(params).length)
    
    // Apply settings if we have URL parameters
    if (Object.keys(params).length > 0) {
      console.log('Applying URL params to settings')
      updateSettings(params)
      if (params.autoStart) {
        console.log('Auto-starting timer')
        // Small delay to ensure settings are applied
        setTimeout(() => {
          startTimer()
        }, 100)
      }
    } else {
      console.log('No URL params found, loading from localStorage')
      // If no URL params, load from localStorage (for normal usage)
      loadSettingsFromStorage()
    }
    console.log('=== END URL PARAMS DEBUG ===')
  }

  const playNotificationSound = () => {
    // Create audio context for notification
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  // Storage functions
  const saveSettingsToStorage = () => {
    localStorage.setItem('timerSettings', JSON.stringify(settings.value))
  }

  const loadSettingsFromStorage = () => {
    const stored = localStorage.getItem('timerSettings')
    if (stored) {
      const storedSettings = JSON.parse(stored)
      settings.value = { ...settings.value, ...storedSettings }
    }
  }

  const savePresetsToStorage = () => {
    localStorage.setItem('timerPresets', JSON.stringify(presets.value))
  }

  const loadPresetsFromStorage = () => {
    const stored = localStorage.getItem('timerPresets')
    if (stored) {
      const storedPresets = JSON.parse(stored)
      // Merge with default presets, keeping defaults
      const defaultPresets = presets.value.filter(p => parseInt(p.id) <= 5)
      const customPresets = storedPresets.filter((p: TimerPreset) => parseInt(p.id) > 5)
      presets.value = [...defaultPresets, ...customPresets]
    }
  }

  // Initialize
  const initialize = () => {
    loadSettingsFromStorage()
    loadPresetsFromStorage()
    resetTimer()
  }

  // Cleanup
  const cleanup = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
  }

  // Watch for settings changes
  watch(settings, saveSettingsToStorage, { deep: true })

  return {
    // State
    isRunning,
    isPaused,
    timeRemaining,
    settings,
    presets,
    
    // Computed
    formattedTime,
    progressPercentage,
    isFinished,
    
    // Actions
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    updateSettings,
    loadPreset,
    addCustomPreset,
    deletePreset,
    generateBrowserSourceUrl,
    parseUrlParams,
    initialize,
    cleanup
  }
}) 