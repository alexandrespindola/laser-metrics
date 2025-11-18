<template>
  <div class="card bg-base-200 p-4 shadow-lg">
    <div class="flex flex-wrap gap-4 justify-center">
      <button @click="startMonitoring" class="btn btn-primary" :disabled="isMonitoring">
        Start Monitoring
      </button>
      <button @click="stopMonitoring" class="btn btn-error" :disabled="!props.isMonitoring">
        Stop Monitoring
      </button>
      <button @click="showStatistics" class="btn btn-secondary" :disabled="!hasData">
        Show Statistics
      </button>
    </div>

  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  isMonitoring: {
    type: Boolean,
    required: false
  }
});

const emit = defineEmits(['start', 'stop', 'show-stats'])

const hasData = ref(false)

const startMonitoring = () => {
  hasData.value = true
    console.log("start")
  emit('start')
}

const stopMonitoring = () => {
  console.log("stop")
  emit('stop')
}

const showStatistics = () => {
  console.log("show stats")
  emit('show-stats');
};

</script>

<style></style>