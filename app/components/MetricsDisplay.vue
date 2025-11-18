<template>
  <div class="card bg-base-100 p-6 shadow-xl">
    <h2 class="text-xl font-bold mb-4">Sensor Metrics</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      <!-- Laser Intensity -->
      <div class="stat bg-base-200 rounded-lg p-4">
        <div class="stat-title">Laser Intensity</div>
        <div class="stat-value text-primary">{{ metrics.laserIntensity }}<span class="text-sm">%</span></div>
        <div class="stat-desc">Current power output</div>
      </div>

      <!-- Temperature -->
      <div class="stat bg-base-200 rounded-lg p-4">
        <div class="stat-title">Temperature</div>
        <div class="stat-value text-primary">{{ metrics.temperature.toFixed(2) }}<span class="text-sm">°C</span></div>
        <div class="stat-desc">Sensor temperature</div>
      </div>

      <!-- Measurement Rate -->
      <div class="stat bg-base-200 rounded-lg p-4">
        <div class="stat-title">Measurement Rate</div>
        <div class="stat-value text-primary">{{ metrics.measurementRate.toFixed(3) }}<span class="text-sm">Hz</span>
        </div>
        <div class="stat-desc">Samples per second</div>
      </div>

      <!-- Real-time chart -->
      <div class="mt-6 h-64 bg-base-200 rounded-lg flex items-center justify-center">
        <p class="text-base-content/50">Real-time chart will be displayed here</p>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>

interface SensorMetrics {
  laserIntensity: number
  temperature: number
  measurementRate: number
  timestamp: string
}

const metrics = ref<SensorMetrics>({
  laserIntensity: 0,
  temperature: 25,
  measurementRate: 10,
  timestamp: new Date().toISOString()
})

let updateInterval: number;

onMounted(() => {
  updateInterval = setInterval(updateMetrics, 1000)
})

onUnmounted(() => {
  clearInterval(updateInterval)
})

const updateMetrics = () => {
  metrics.value = {
    laserIntensity: Math.floor(Math.random() * 100),
    temperature: 25 + Math.random() * 10,
    measurementRate: 5 + Math.random() * 15,
    timestamp: new Date().toISOString()
  }
}

</script>

<style></style>