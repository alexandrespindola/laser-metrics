<template>
    <div class="container mx-auto p-4 space-y-6">
        <MetricsDisplay />
        <ControlPanel />
    </div>
</template>

<script setup lang="ts">
const isMonitoring = ref(false)
</script>
