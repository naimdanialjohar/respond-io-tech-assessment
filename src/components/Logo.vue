<script setup lang="ts">
import { PhListChecks } from '@phosphor-icons/vue'
</script>

<template>
  <div class="wrapper">
    <p class="app-name">
      <PhListChecks :size="32" color="#448AFF" weight="bold" />
      <span class="name">task.io</span>
    </p>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;

  .app-name {
    font-family: 'Roboto Bold';
    font-size: 48px;
    font-weight: 100;
    color: #273240;

    .name {
      margin-left: 10px;
    }
  }
}
</style>
