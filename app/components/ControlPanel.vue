<template>
  <div class="card bg-base-200 p-4 shadow-lg">
    <div class="flex flex-wrap gap-4 justify-center">
      <button @click="startMonitoring" class="btn btn-primary" :disable="isMonitoring">
        Start Monitoring
      </button>
      <button @click="stopMonitoring" class="btn btn-error" :disable="!isMonitoring">
        Stop Monitoring
      </button>
      <button @click="showStatistics" class="btn btn-secondary" :disable="!hasData">
        Show Statistics
      </button>
    </div>

  </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue'

const isMonitoring = ref(false)
const hasData = ref(false)

const emit = defineEmits(['start', 'stop', 'show-stats'])

const startMonitoring = () => {
  isMonitoring.value = true
  hasData.value = true
  emit('start')
}

const stopMonitoring = () => {
  isMonitoring.value = false
  emit('stop')
}

const showStatistics = () => {
  emit('show-stats')
}

</script>

<style></style>