<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useTimerStore } from './stores/timerStore'

const timerStore = useTimerStore()

onMounted(() => {
  // Initialize the timer store
  timerStore.initialize()
})
</script>

<template>
  <RouterView />
</template>

<style>
/* Minimal global styles - no conflicts */
.display-view {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 9999;
}

/* Hide scrollbars only for display view */
.display-view::-webkit-scrollbar {
  display: none;
}

.display-view {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
