<script setup lang="ts">
const props = defineProps({ children: Element })
</script>

<template>
  <div class="app-layout">{{ children }}</div>
</template>

<style scoped>
.app-layout {
  height: 100vh;
}
</style>
