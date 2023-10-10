<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'
import type { Statuses, Tags, TaskDetails } from '@/types'
import { PhX, PhUserCircle } from '@phosphor-icons/vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const min = new Date().toString()
const showDialog = ref(false)
const { params } = useRoute()
const router = useRouter()
const { getTaskDetails, updateTask, deleteTaskFromBoard, addCommentToTask, statuses } =
  useBoardStore()
const id = parseInt(params.id as string)
const details = getTaskDetails(id)
const originalStatus = ref(details?.status)
const commentRef = ref('')

watch(
  () => params.id,
  async (newId) => (showDialog.value = !!newId),
  { immediate: true }
)

const hideDialog = () => (showDialog.value = false)
const backToBoard = () => router.push({ name: 'todo' })
const onDeleteTask = (details: TaskDetails) => {
  hideDialog()
  deleteTaskFromBoard(details.status, details.id)
}

const onAddTags = (tag: string) => {
  if (details?.tags)
    if (typeof tag === 'string' && tag.trim()) {
      const item = details.tags.find((item) => item.name === tag)
      if (item) {
        details.tags = item as unknown as Tags[]
      } else {
      }
    }
}
</script>

<template>
  <v-dialog v-model="showDialog" width="800" @after-leave="backToBoard">
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-bold">Task Details</span>
      </v-card-title>
      <template v-if="!!details">
        <v-card-text>
          <v-text-field v-model="details.title" label="Title" />
          <v-textarea v-model="details.description" label="Description" />
          <v-file-input
            v-model="details.file"
            label="File"
            prepend-icon=""
            multiple
            :clear-icon="PhX"
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="fileName in fileNames" :key="fileName">
                <v-chip size="small" label color="primary" class="me-2">
                  {{ fileName }}
                </v-chip>
              </template>
            </template>
          </v-file-input>
          <div class="mb-4">
            Comments

            <template v-if="details.comments?.length > 0" v-for="comment in details.comments">
              <div class="pa-2">
                <v-card-subtitle class="mb-1">
                  <div class="d-flex">
                    <PhUserCircle class="mr-4" size="20" /> <span>Naim Danial</span>
                  </div>
                  <span class="ml-9">{{ comment }}</span></v-card-subtitle
                >
              </div>
            </template>

            <template v-else>
              <v-card-subtitle class="mb-4">No comments</v-card-subtitle>
            </template>
          </div>
          <v-text-field
            v-model="details.datetime"
            label="Estimated Time"
            type="datetime-local"
            :min="min"
          />
          <v-select
            v-model="details.status"
            class="text-capitalize"
            label="Status"
            :items="statuses"
          />
          <v-combobox v-model="details.tags" label="Tags" chips multiple @change="onAddTags" />
          <v-textarea v-model="commentRef" />
          <div class="d-flex justify-end mb-4">
            <v-btn
              color="#448AFF"
              @click="addCommentToTask(commentRef, details), (commentRef = '')"
            >
              Add Comment
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="hideDialog"> Cancel</v-btn>
          <v-btn color="green-darken-1" variant="text" @click="onDeleteTask(details)">
            Delete</v-btn
          >
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="(showDialog = false), updateTask(originalStatus as Statuses, details)"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>
