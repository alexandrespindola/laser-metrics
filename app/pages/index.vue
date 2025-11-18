<template>
    <div class="container mx-auto p-4 space-y-6">
        <MetricsDisplay 
            :is-monitoring="isMonitoring"
            @update:monitoring="isMonitoring = $event"
        />
        <ControlPanel 
            :is-monitoring="isMonitoring"
            @start="isMonitoring = true"
            @stop="isMonitoring = false"/>
    </div>
</template>

<script setup lang="ts">
const isMonitoring = ref(false)
</script>
