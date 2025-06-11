<template>
  <div 
    class="display-container display-view"
    :style="containerStyle"
    @mousemove="handleMouseMove"
    @click="handleClick"
    @keydown="handleKeyDown"
    tabindex="0"
  >
    <!-- Main Content -->
    <div class="display-content" :style="contentStyle">
      <!-- Custom Text -->
      <div 
        v-if="timerStore.settings.text"
        class="display-text"
        :style="textStyle"
      >
        {{ timerStore.settings.text }}
      </div>

      <!-- Timer Display -->
      <div class="timer-display" :style="timerStyle">
        <span class="timer-text">{{ timerStore.formattedTime }}</span>
      </div>

      <!-- Progress Bar -->
      <div 
        v-if="timerStore.settings.showProgressBar"
        class="progress-container"
        :style="progressContainerStyle"
      >
        <div 
          class="progress-bar"
          :style="progressBarStyle"
        />
      </div>

      <!-- Finished State -->
      <div 
        v-if="timerStore.isFinished && showFinishedState"
        class="finished-overlay"
        :style="finishedOverlayStyle"
      >
        <div class="finished-text" :style="finishedTextStyle">
          {{ finishedMessage }}
        </div>
        <div class="finished-pulse" />
      </div>
    </div>

    <!-- Debug Info (only in development) -->
    <div v-if="showDebug" class="debug-info">
      <div>Time: {{ timerStore.formattedTime }}</div>
      <div>Running: {{ timerStore.isRunning }}</div>
      <div>Progress: {{ Math.round(timerStore.progressPercentage) }}%</div>
      <div>Duration: {{ timerStore.settings.duration }}m</div>
      <div>Text: {{ timerStore.settings.text }}</div>
    </div>

    <!-- Control Overlay (hidden by default, shown on hover/click) -->
    <div 
      v-if="showControls"
      class="control-overlay"
      :class="{ visible: controlsVisible }"
    >
      <div class="control-panel">
        <button 
          class="control-button"
          :class="{ primary: !timerStore.isRunning }"
          @click="toggleTimer"
        >
          {{ timerStore.isRunning ? 'Pause' : (timerStore.isPaused ? 'Resume' : 'Start') }}
        </button>
        <button 
          class="control-button"
          @click="resetTimer"
        >
          Reset
        </button>
        <button 
          class="control-button settings-btn"
          @click="goToSettings"
        >
          Settings
        </button>
      </div>
    </div>

    <!-- Particles Effect (optional) -->
    <div v-if="showParticles" class="particles-container">
      <div 
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="particle.style"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useTimerStore } from '../stores/timerStore'

const router = useRouter()
const timerStore = useTimerStore()

// Local state
const showDebug = ref(false)
const showControls = ref(true)
const controlsVisible = ref(false)
const showFinishedState = ref(false)
const finishedMessage = ref('TIME\'S UP!')
const showParticles = ref(false)
const particles = ref<Array<{
  id: number
  style: Record<string, string>
}>>([])

let mouseTimeout: number | null = null
let finishedTimeout: number | null = null
let particleInterval: number | null = null

// Cached styles that only update when settings change
const cachedStyles = ref({
  container: {},
  content: {},
  text: {},
  timer: {},
  progressContainer: {},
  finishedOverlay: {},
  finishedText: {}
})

// Function to update cached styles only when settings change
const updateCachedStyles = () => {
  // Container style with background handling
  const containerStyle: Record<string, string> = {}
  
  if (timerStore.settings.transparentBackground) {
    containerStyle.background = 'transparent'
  } else {
    containerStyle.background = timerStore.settings.backgroundColor
  }

  cachedStyles.value = {
    container: containerStyle,
    content: {
      fontFamily: timerStore.settings.fontFamily,
      color: timerStore.settings.textColor
    },
    text: {
      fontSize: `${timerStore.settings.fontSize * 0.4}px`,
      fontWeight: '600',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      marginBottom: `${timerStore.settings.fontSize * 0.2}px`
    },
    timer: {
      fontSize: `${timerStore.settings.fontSize}px`,
      fontWeight: '700',
      fontFamily: 'monospace',
      textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
      letterSpacing: '0.1em'
    },
    progressContainer: {
      width: '60%',
      height: `${Math.max(timerStore.settings.fontSize * 0.1, 8)}px`,
      marginTop: `${timerStore.settings.fontSize * 0.3}px`
    },
    finishedOverlay: {
      background: `rgba(${hexToRgb(timerStore.settings.textColor)}, 0.1)`
    },
    finishedText: {
      fontSize: `${timerStore.settings.fontSize * 1.2}px`,
      color: timerStore.settings.textColor,
      textShadow: '4px 4px 8px rgba(0, 0, 0, 0.7)'
    }
  }
}

// Computed styles that combine cached styles with dynamic values
const containerStyle = computed(() => ({
  ...cachedStyles.value.container,
  cursor: controlsVisible.value ? 'default' : 'none'
}))

const contentStyle = computed(() => cachedStyles.value.content)
const textStyle = computed(() => cachedStyles.value.text)
const timerStyle = computed(() => cachedStyles.value.timer)
const progressContainerStyle = computed(() => cachedStyles.value.progressContainer)
const finishedOverlayStyle = computed(() => cachedStyles.value.finishedOverlay)
const finishedTextStyle = computed(() => cachedStyles.value.finishedText)

// Progress bar style - only updates when progress changes
const progressBarStyle = computed(() => ({
  width: `${timerStore.progressPercentage}%`,
  background: timerStore.settings.textColor,
  boxShadow: `0 0 ${timerStore.settings.fontSize * 0.2}px ${timerStore.settings.textColor}`
}))

// Methods
const handleMouseMove = () => {
  if (!showControls.value) return
  
  controlsVisible.value = true
  if (mouseTimeout) {
    clearTimeout(mouseTimeout)
  }
  mouseTimeout = window.setTimeout(() => {
    controlsVisible.value = false
  }, 3000)
}

const handleClick = () => {
  if (showControls.value) {
    controlsVisible.value = !controlsVisible.value
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  // Don't interfere with browser shortcuts (Ctrl+combinations, F-keys, etc.)
  if (event.ctrlKey || event.altKey || event.metaKey || event.key.startsWith('F')) {
    return // Let browser handle these
  }
  
  // Only handle specific keys for timer control
  switch (event.code) {
    case 'Space':
      event.preventDefault()
      toggleTimer()
      break
    case 'KeyR':
      if (!event.ctrlKey) { // Don't interfere with Ctrl+R (refresh)
        event.preventDefault()
        resetTimer()
      }
      break
    case 'KeyS':
      if (!event.ctrlKey) { // Don't interfere with Ctrl+S (save)
        event.preventDefault()
        goToSettings()
      }
      break
    case 'KeyD':
      if (!event.ctrlKey) { // Don't interfere with Ctrl+D (bookmark)
        event.preventDefault()
        showDebug.value = !showDebug.value
      }
      break
    case 'KeyF':
      if (!event.ctrlKey) { // Don't interfere with Ctrl+F (find)
        event.preventDefault()
        toggleFullscreen()
      }
      break
    case 'KeyC':
      if (!event.ctrlKey) { // Don't interfere with Ctrl+C (copy)
        event.preventDefault()
        showControls.value = !showControls.value
      }
      break
  }
}

const toggleTimer = () => {
  if (timerStore.isRunning) {
    timerStore.pauseTimer()
  } else {
    timerStore.startTimer()
  }
}

const resetTimer = () => {
  timerStore.resetTimer()
  showFinishedState.value = false
}

const goToSettings = () => {
  router.push({ name: 'setup' })
}

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
  } else {
    await document.exitFullscreen()
  }
}

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
  }
  return '255, 255, 255'
}

const createParticle = () => {
  if (!showParticles.value) return
  
  const particle = {
    id: Date.now() + Math.random(),
    style: {
      left: `${Math.random() * 100}%`,
      animationDuration: `${3 + Math.random() * 4}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: `${0.3 + Math.random() * 0.4}`
    }
  }
  
  particles.value.push(particle)
  
  // Remove particle after animation
  setTimeout(() => {
    const index = particles.value.findIndex(p => p.id === particle.id)
    if (index > -1) {
      particles.value.splice(index, 1)
    }
  }, 7000)
}

const startParticleEffect = () => {
  showParticles.value = true
  particleInterval = window.setInterval(createParticle, 500)
  
  // Stop after 10 seconds
  setTimeout(() => {
    if (particleInterval) {
      clearInterval(particleInterval)
      particleInterval = null
    }
    setTimeout(() => {
      showParticles.value = false
      particles.value = []
    }, 7000) // Wait for existing particles to finish
  }, 10000)
}

// Initialize from URL parameters
const initializeFromUrl = () => {
  timerStore.parseUrlParams()
}

// Watch for timer completion
watch(() => timerStore.isFinished, (isFinished) => {
  if (isFinished && !showFinishedState.value) {
    showFinishedState.value = true
    startParticleEffect()
    
    // Auto-hide finished state after 10 seconds
    finishedTimeout = window.setTimeout(() => {
      if (timerStore.settings.loopTimer) {
        showFinishedState.value = false
      }
    }, 10000)
  }
})

// Auto-scale font based on viewport
const autoScaleFont = () => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const minDimension = Math.min(vw, vh)
  
  // Scale font size based on viewport
  const scaleFactor = minDimension / 1080 // Assuming 1080p as base
  const baseFontSize = timerStore.settings.fontSize
  const scaledFontSize = Math.max(baseFontSize * scaleFactor, 24)
  
  // Update CSS custom property for dynamic scaling
  document.documentElement.style.setProperty('--dynamic-font-size', `${scaledFontSize}px`)
}

// Watch for settings changes to update cached styles
watch(() => timerStore.settings, () => {
  updateCachedStyles()
}, { deep: true })

// Lifecycle
onMounted(async () => {
  // Initialize timer store
  timerStore.initialize()
  
  // Initialize cached styles
  updateCachedStyles()
  
  // Parse URL parameters for browser source
  initializeFromUrl()
  
  // Auto-scale font
  autoScaleFont()
  window.addEventListener('resize', autoScaleFont)
  
  // Focus for keyboard events
  await nextTick()
  const container = document.querySelector('.display-container') as HTMLElement
  if (container) {
    container.focus()
  }
  
  // Hide controls initially after 3 seconds
  if (showControls.value) {
    setTimeout(() => {
      controlsVisible.value = false
    }, 3000)
  }
})

onUnmounted(() => {
  // Cleanup timers
  if (mouseTimeout) clearTimeout(mouseTimeout)
  if (finishedTimeout) clearTimeout(finishedTimeout)
  if (particleInterval) clearInterval(particleInterval)
  
  // Cleanup timer store
  timerStore.cleanup()
  
  // Remove event listeners
  window.removeEventListener('resize', autoScaleFont)
})
</script>

<style scoped>
.display-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  outline: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  z-index: 1000;
}

.display-content {
  text-align: center;
  z-index: 2;
  position: relative;
  user-select: none;
}

.display-text {
  animation: fadeInUp 1s ease-out;
  margin-bottom: 1rem;
}

.timer-display {
  animation: fadeInUp 1s ease-out 0.3s both;
}

.timer-text {
  display: inline-block;
  /* Optimize rendering */
  will-change: contents;
  /* Prevent text selection */
  user-select: none;
  /* Optimize font rendering */
  text-rendering: optimizeSpeed;
}

.progress-container {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.progress-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease-out;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.3) 50%, 
    transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.finished-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  animation: finishedAppear 0.5s ease-out;
}

.finished-text {
  font-weight: 900;
  animation: finishedPulse 2s infinite ease-in-out;
}

.finished-pulse {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid currentColor;
  border-radius: 50%;
  animation: pulse 2s infinite ease-out;
  opacity: 0.5;
}

@keyframes finishedAppear {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes finishedPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.control-overlay {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.control-overlay.visible {
  opacity: 1;
  pointer-events: auto;
}

.control-panel {
  display: flex;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.control-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.control-button.primary {
  background: #27ae60;
}

.control-button.primary:hover {
  background: #219a52;
}

.control-button.settings-btn {
  background: #3498db;
}

.control-button.settings-btn:hover {
  background: #2980b9;
}

.debug-info {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.8rem;
  z-index: 5;
  white-space: pre-wrap;
  max-width: 300px;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
  animation: particleFall linear forwards;
  opacity: 0.6;
}

@keyframes particleFall {
  0% {
    top: -10px;
    transform: rotate(0deg);
  }
  100% {
    top: 100vh;
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .control-panel {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .debug-info {
    font-size: 0.7rem;
    max-width: 250px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .control-button {
    border: 2px solid white;
  }
  
  .progress-bar {
    border: 1px solid currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .timer-change-enter-active,
  .timer-change-leave-active,
  .control-button,
  .progress-bar {
    transition: none;
  }
  
  .display-text,
  .timer-display,
  .progress-container {
    animation: none;
  }
  
  .finished-text,
  .finished-pulse,
  .particle {
    animation: none;
  }
}

/* Print styles */
@media print {
  .control-overlay,
  .debug-info,
  .particles-container {
    display: none;
  }
}
</style> 