<template>
  <div class="setup-container">
    <header class="setup-header">
      <h1 class="title">Stream Countdown Timer</h1>
      <p class="subtitle">Setup your countdown timer for OBS Browser Source</p>
    </header>

    <div class="setup-content">
      <!-- Timer Configuration Section -->
      <section class="config-section">
        <h2 class="section-title">Timer Configuration</h2>
        
        <!-- Duration Input -->
        <div class="form-group">
          <label for="duration">Duration (minutes)</label>
          <input
            id="duration"
            v-model.number="localSettings.duration"
            type="number"
            min="1"
            max="120"
            class="form-input"
            @input="updateTimerSettings"
          />
        </div>

        <!-- Preset Buttons -->
        <div class="form-group">
          <label>Quick Presets</label>
          <div class="preset-buttons">
            <button
              v-for="preset in timerStore.presets.slice(0, 5)"
              :key="preset.id"
              class="preset-btn"
              :class="{ active: localSettings.duration === preset.settings.duration }"
              @click="loadPreset(preset.id)"
            >
              {{ preset.settings.duration }}m
            </button>
          </div>
        </div>

        <!-- Custom Text -->
        <div class="form-group">
          <label for="text">Display Text</label>
          <input
            id="text"
            v-model="localSettings.text"
            type="text"
            class="form-input"
            placeholder="STREAM STARTING SOON"
            @input="updateTimerSettings"
          />
        </div>
      </section>

      <!-- Appearance Section -->
      <section class="config-section">
        <h2 class="section-title">Appearance</h2>
        
        <!-- Background Options -->
        <div class="form-group">
          <label>Background</label>
          <div class="background-options">
            <div class="background-presets">
              <button
                v-for="bg in backgroundPresets"
                :key="bg.name"
                class="bg-preset-btn"
                :style="{ background: bg.value }"
                :class="{ active: localSettings.backgroundColor === bg.value }"
                @click="selectBackground(bg.value)"
                :title="bg.name"
              />
            </div>
            <div class="custom-bg-section">
              <input
                v-model="customBgColor"
                type="color"
                class="color-input"
                @change="selectBackground(customBgColor)"
              />
              <label class="checkbox-label">
                <input
                  v-model="localSettings.transparentBackground"
                  type="checkbox"
                  @change="updateTimerSettings"
                />
                Transparent Background
              </label>
            </div>
          </div>
        </div>

        <!-- Text Color -->
        <div class="form-group">
          <label for="textColor">Text Color</label>
          <div class="color-section">
            <input
              id="textColor"
              v-model="localSettings.textColor"
              type="color"
              class="color-input"
              @change="updateTimerSettings"
            />
            <span class="color-value">{{ localSettings.textColor }}</span>
          </div>
        </div>

        <!-- Font Size -->
        <div class="form-group">
          <label for="fontSize">Font Size</label>
          <div class="range-section">
            <input
              id="fontSize"
              v-model.number="localSettings.fontSize"
              type="range"
              min="24"
              max="144"
              class="range-input"
              @input="updateFontSize"
              @change="updateTimerSettings"
            />
            <span class="range-value">{{ localSettings.fontSize }}px</span>
          </div>
        </div>

        <!-- Additional Options -->
        <div class="form-group">
          <label>Options</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="localSettings.showProgressBar"
                type="checkbox"
                @change="updateTimerSettings"
              />
              Show Progress Bar
            </label>
            <label class="checkbox-label">
              <input
                v-model="localSettings.playSound"
                type="checkbox"
                @change="updateTimerSettings"
              />
              Play Sound on Finish
            </label>
            <label class="checkbox-label">
              <input
                v-model="localSettings.loopTimer"
                type="checkbox"
                @change="updateTimerSettings"
              />
              Loop Timer
            </label>
          </div>
        </div>
      </section>

      <!-- Preview Section -->
      <section class="config-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-container">
          <div
            class="preview-display"
            :style="previewStyle"
          >
            <div 
              class="preview-text" 
              :style="previewTextStyle"
            >
              {{ localSettings.text }}
            </div>
            <div 
              class="preview-timer" 
              :style="previewTimerStyle"
            >
              {{ timerStore.formattedTime }}
            </div>
            <div
              v-if="localSettings.showProgressBar"
              class="preview-progress"
            >
              <div
                class="preview-progress-bar"
                :style="{ 
                  width: `${timerStore.progressPercentage}%`,
                  backgroundColor: localSettings.textColor 
                }"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Controls Section -->
      <section class="config-section">
        <h2 class="section-title">Controls</h2>
        <div class="control-buttons">
          <button
            class="control-btn primary"
            :disabled="timerStore.isRunning"
            @click="startTimer"
          >
            {{ timerStore.isPaused ? 'Resume' : 'Start' }}
          </button>
          <button
            class="control-btn"
            :disabled="!timerStore.isRunning && !timerStore.isPaused"
            @click="pauseTimer"
          >
            Pause
          </button>
          <button
            class="control-btn"
            @click="resetTimer"
          >
            Reset
          </button>
        </div>
      </section>

      <!-- Browser Source Section -->
      <section class="config-section">
        <h2 class="section-title">OBS Browser Source</h2>
        <div class="browser-source-section">
          


          <p class="info-text">
            Copy this URL and use it as a Browser Source in OBS:
          </p>
          <div class="url-container">
            <input
              ref="urlInput"
              :value="browserSourceUrl"
              readonly
              class="url-input"
            />
            <button
              class="copy-btn"
              @click="copyUrl"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          
          <!-- Settings included notice -->
          <div class="settings-notice">
            <small>
              ✓ All current settings embedded in URL: timer duration, text, colors, background, options<br>
              <strong>This URL contains all your settings and will work in any OBS instance!</strong>
            </small>
          </div>

          <div class="obs-instructions">
            <h3>OBS Setup Instructions:</h3>
            <ol>
              <li>Add a new Browser Source in OBS</li>
              <li>Paste the URL above</li>
              <li>Set Width: 1920, Height: 1080</li>
              <li>Check "Shutdown source when not visible"</li>
              <li>Check "Refresh browser when scene becomes active"</li>
              <li>The timer will use all your current settings automatically</li>
            </ol>
          </div>
          <div class="display-buttons">
            <button
              class="control-btn secondary"
              @click="openDisplayView"
            >
              Open Display View
            </button>
            <button
              class="control-btn"
              @click="testObsUrl"
            >
              Test OBS URL
            </button>
          </div>
        </div>
      </section>

      <!-- Custom Presets Section -->
      <section class="config-section">
        <h2 class="section-title">Custom Presets</h2>
        <div class="preset-management">
          <div class="new-preset-form">
            <input
              v-model="newPresetName"
              type="text"
              placeholder="Preset name..."
              class="form-input"
              @keyup.enter="saveCustomPreset"
            />
            <button
              class="control-btn secondary"
              :disabled="!newPresetName.trim()"
              @click="saveCustomPreset"
            >
              Save Current Settings
            </button>
          </div>
          <div class="custom-presets-list">
            <div
              v-for="preset in customPresets"
              :key="preset.id"
              class="preset-item"
            >
              <span class="preset-name">{{ preset.name }}</span>
              <div class="preset-actions">
                <button
                  class="preset-action-btn load"
                  @click="loadPreset(preset.id)"
                >
                  Load
                </button>
                <button
                  class="preset-action-btn delete"
                  @click="deletePreset(preset.id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTimerStore, type TimerSettings } from '../stores/timerStore'

const router = useRouter()
const timerStore = useTimerStore()

// Local state for form inputs
const localSettings = ref<TimerSettings>({ ...timerStore.settings })
const newPresetName = ref('')
const copied = ref(false)
const customBgColor = ref('#667eea')
const urlInput = ref<HTMLInputElement>()


// Background presets
const backgroundPresets = [
  { name: 'Blue Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Purple Gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Green Gradient', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Orange Gradient', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Dark Gradient', value: 'linear-gradient(135deg, #434343 0%, #000000 100%)' },
  { name: 'Red Gradient', value: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }
]



// Computed properties
const customPresets = computed(() => 
  timerStore.presets.filter(p => parseInt(p.id) > 5)
)

const browserSourceUrl = computed(() => {
  // Force regeneration with current settings
  timerStore.updateSettings(localSettings.value)
  return timerStore.generateBrowserSourceUrl()
})

const previewStyle = computed(() => ({
  background: localSettings.value.transparentBackground 
    ? 'transparent' 
    : localSettings.value.backgroundColor,
  color: localSettings.value.textColor,
  fontSize: `${Math.max(localSettings.value.fontSize * 0.3, 16)}px`,
  fontFamily: localSettings.value.fontFamily
}))

const previewTextStyle = computed(() => ({
  fontSize: `${Math.max(localSettings.value.fontSize * 0.12, 12)}px`,
  color: localSettings.value.textColor
}))

const previewTimerStyle = computed(() => ({
  fontSize: `${Math.max(localSettings.value.fontSize * 0.25, 20)}px`,
  color: localSettings.value.textColor,
  fontFamily: 'monospace'
}))

// Methods
const updateTimerSettings = () => {
  // Force reactivity update
  const updatedSettings = { ...localSettings.value }
  timerStore.updateSettings(updatedSettings)
}

const selectBackground = (background: string) => {
  localSettings.value.backgroundColor = background
  updateTimerSettings()
}

const loadPreset = (presetId: string) => {
  timerStore.loadPreset(presetId)
  localSettings.value = { ...timerStore.settings }
}

const startTimer = () => {
  timerStore.startTimer()
}

const pauseTimer = () => {
  timerStore.pauseTimer()
}

const resetTimer = () => {
  timerStore.resetTimer()
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(browserSourceUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    // Fallback for older browsers
    if (urlInput.value) {
      urlInput.value.select()
      document.execCommand('copy')
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  }
}

const openDisplayView = () => {
  window.open(router.resolve({ name: 'display' }).href, '_blank')
}

const testObsUrl = () => {
  // Open the exact URL that would be used in OBS
  window.open(browserSourceUrl.value, '_blank')
}

const saveCustomPreset = () => {
  if (newPresetName.value.trim()) {
    timerStore.addCustomPreset(newPresetName.value.trim(), localSettings.value)
    newPresetName.value = ''
  }
}

const deletePreset = (presetId: string) => {
  if (confirm('Are you sure you want to delete this preset?')) {
    timerStore.deletePreset(presetId)
  }
}

const updateFontSize = (event: Event) => {
  const target = event.target as HTMLInputElement
  localSettings.value.fontSize = parseInt(target.value)
  updateTimerSettings()
}

// Watch for store changes to sync local settings
watch(() => timerStore.settings, (newSettings) => {
  localSettings.value = { ...newSettings }
}, { deep: true })

// Initialize on mount
onMounted(() => {
  timerStore.initialize()
  localSettings.value = { ...timerStore.settings }
})
</script>

<style scoped>
.setup-container {
  width: 100%;
  /* REMOVED min-height: 100vh - this was causing issues */
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
  /* Explicitly allow scrolling */
  overflow-y: auto;
  overflow-x: hidden;
}

.setup-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

.setup-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  padding-bottom: 4rem;
  /* Ensure content flows naturally */
  width: 100%;
  overflow: visible;
}

.config-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.preset-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.preset-btn:hover {
  background: #3498db;
  color: white;
}

.preset-btn.active {
  background: #3498db;
  color: white;
}

.background-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.background-presets {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.bg-preset-btn {
  width: 50px;
  height: 50px;
  border: 3px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bg-preset-btn:hover {
  transform: scale(1.1);
}

.bg-preset-btn.active {
  border-color: #3498db;
  transform: scale(1.1);
}

.custom-bg-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-input {
  width: 60px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.color-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-value {
  font-family: monospace;
  font-weight: 600;
  color: #666;
}

.range-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-input {
  flex: 1;
}

.range-value {
  font-weight: 600;
  color: #666;
  min-width: 60px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}



.preview-container {
  display: flex;
  justify-content: center;
}

.preview-display {
  width: 300px;
  height: 200px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px solid #e0e0e0;
}

.preview-text {
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.preview-timer {
  font-weight: 700;
  transition: all 0.3s ease;
}

.preview-progress {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.preview-progress-bar {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  transition: width 1s ease;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn.primary {
  background: #27ae60;
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  background: #219a52;
}

.control-btn.secondary {
  background: #3498db;
  color: white;
}

.control-btn.secondary:hover:not(:disabled) {
  background: #2980b9;
}

.control-btn:not(.primary):not(.secondary) {
  background: #95a5a6;
  color: white;
}

.control-btn:not(.primary):not(.secondary):hover:not(:disabled) {
  background: #7f8c8d;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.browser-source-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-text {
  margin: 0;
  color: #666;
}

.url-container {
  display: flex;
  gap: 0.5rem;
}

.url-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  background: #f8f9fa;
  box-sizing: border-box;
}

.copy-btn {
  padding: 0.75rem 1rem;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.copy-btn:hover {
  background: #138496;
}

.obs-instructions {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #3498db;
}

.obs-instructions h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.obs-instructions ol {
  margin: 0;
  padding-left: 1.5rem;
}

.obs-instructions li {
  margin-bottom: 0.25rem;
  color: #666;
}

.obs-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.obs-warning h4 {
  color: #856404;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.obs-warning p {
  color: #856404;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.warning-btn {
  background: #ffc107;
  color: #212529;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.warning-btn:hover {
  background: #e0a800;
}

.url-help-section {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
}

.url-help-section h5 {
  color: #856404;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.url-help-section ol {
  margin: 0;
  padding-left: 1.5rem;
}

.url-help-section li {
  color: #856404;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.url-help-section a {
  color: #0066cc;
  text-decoration: none;
  font-weight: 600;
}

.url-help-section a:hover {
  text-decoration: underline;
}

.settings-notice {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  padding: 0.75rem;
  margin: 1rem 0;
}

.settings-notice small {
  color: #155724;
  font-weight: 500;
  line-height: 1.4;
}

.display-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.preset-management {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.new-preset-form {
  display: flex;
  gap: 0.5rem;
}

.new-preset-form input {
  flex: 1;
}

.custom-presets-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.preset-name {
  font-weight: 600;
  color: #2c3e50;
}

.preset-actions {
  display: flex;
  gap: 0.5rem;
}

.preset-action-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preset-action-btn.load {
  background: #27ae60;
  color: white;
}

.preset-action-btn.load:hover {
  background: #219a52;
}

.preset-action-btn.delete {
  background: #e74c3c;
  color: white;
}

.preset-action-btn.delete:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .setup-container {
    padding: 1rem;
    /* Force scrolling on mobile */
    overflow-y: scroll !important;
  }
  
  .setup-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    /* Ensure content can scroll on mobile */
    overflow: visible;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .config-section {
    padding: 1.5rem;
  }
  
  .background-presets {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .url-container {
    flex-direction: column;
  }
  
  .new-preset-form {
    flex-direction: column;
  }
}
</style> 