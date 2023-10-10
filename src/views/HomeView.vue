<script setup lang="ts">
import { useRouter } from 'vue-router'
import Logo from '@/components/Logo.vue'

const router = useRouter()
const navigateToBoard = () => router.push({ name: 'todo' })
</script>

<template>
  <Logo />
  <div class="d-flex justify-end">
    <v-btn color="#448AFF" @click="navigateToBoard">View Tasks</v-btn>
  </div>
</template>
