<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores/boardStore'
import { formRules } from '../../src/utils/index'

const { addTaskToBoard, statuses, resetLocalStorage } = useBoardStore()
import { PhX } from '@phosphor-icons/vue'
import type { Tags, TaskDetails } from '@/types'

const dialog = ref(false)
const form = ref()

const min = new Date().toString()

// initial values for new task
const initialValues = ref({
  title: '',
  description: '',
  file: undefined,
  datetime: '',
  status: '',
  tags: [] as Tags[],
  comments: []
})

const validate = async (details: TaskDetails) => {
  const { valid } = await form.value.validate()

  if (valid) {
    dialog.value = false
    addTaskToBoard(details)
    await form.value.reset()
  }
}

const addTag = (tag: string) => {
  const tagID = ref(initialValues.value.tags.length + 1)
  const newItem = {
    id: tagID.value,
    name: tag
  }
  initialValues.value.tags.push(newItem)
  return newItem
}

const onAddTags = (tag: string) => {
  if (typeof tag === 'string' && tag.trim()) {
    const item = initialValues.value.tags.find((item) => item.name === tag)
    if (item) {
      initialValues.value.tags = item as unknown as Tags[]
      addTag(tag)
    }
  }
}
</script>

<template>
  <v-dialog v-model="dialog" width="800">
    <div class="d-flex justify-end"></div>
    <template v-slot:activator="{ props }">
      <div class="d-flex justify-end">
        <v-btn color="#448AFF" variant="text" class="mr-4" @click="resetLocalStorage"
          >Reset Tasks</v-btn
        >
        <v-btn color="#448AFF" v-bind="props">Add Task</v-btn>
      </div>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-bold">Create New Task</span>
      </v-card-title>
      <v-form ref="form">
        <v-card-text>
          <v-text-field
            v-model="initialValues.title"
            label="Title"
            :rules="formRules.title"
            required
          />
          <v-textarea
            v-model="initialValues.description"
            label="Description"
            :rules="formRules.description"
            required
          />
          <v-file-input
            v-model="initialValues.file"
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
          <v-text-field
            v-model="initialValues.datetime"
            label="Estimated Time"
            type="datetime-local"
            :min="min"
            :rules="formRules.datetime"
            required
          />
          <v-select
            v-model="initialValues.status"
            class="text-capitalize"
            label="Status"
            :items="statuses"
            :rules="formRules.status"
            required
          />
          <v-combobox
            v-model="initialValues.tags"
            :items="initialValues.tags"
            label="Tags"
            chips
            multiple
            @change="onAddTags"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="dialog = false"> Cancel</v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="validate(initialValues as unknown as TaskDetails)"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
