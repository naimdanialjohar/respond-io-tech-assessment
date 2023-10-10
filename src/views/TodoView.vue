<script setup lang="ts">
import { PhPencil, PhTrash } from '@phosphor-icons/vue'
import NewTaskDialog from '@/components/NewTaskDialog.vue'
import TaskDetailsView from './TaskDetailsView.vue'
import { useBoardStore } from '../stores/boardStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Logo from '@/components/Logo.vue'
import { type Statuses, type TaskDetails } from '../types/index'

const {
  statuses,
  tasksGroupedByStatus: taskDetails,
  deleteTaskFromBoard,
  getDonePercentage,
  updateTask
} = useBoardStore()

const router = useRouter()

const deleteTaskDialog = ref(false)
const selectedDeleteTask = ref({
  status: '' as Statuses,
  id: 0
})

const viewTaskDetails = (taskID: number) =>
  router.push({ name: 'taskDetails', params: { id: taskID } })

const onClickDeleteTask = (status: Statuses, taskID: number) => {
  deleteTaskDialog.value = true
  selectedDeleteTask.value.id = taskID
  selectedDeleteTask.value.status = status
}

const closeDeleteTaskDialog = () => (deleteTaskDialog.value = false)

// data is task data that user drags
const startDrag = (event: DragEvent, data: TaskDetails) => {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    // assigns data to task
    event.dataTransfer.setData('task', JSON.stringify(data))
  }
}

// newStatus is the board that user drops tasks into
const onDrop = (event: DragEvent, newStatus: string) => {
  if (event.dataTransfer) {
    // gets data from task
    const item = JSON.parse(event.dataTransfer.getData('task')) as TaskDetails
    const oldStatus = item.status
    const newData = { ...item, status: newStatus as Statuses }

    updateTask(oldStatus, newData)
  }
}

const donePercentageValue = getDonePercentage()

const getProgressBarColor = () => {
  const isGreen = donePercentageValue.value === 100

  return isGreen ? 'green' : 'amber'
}
</script>

<template>
  <Logo />
  <div>
    <NewTaskDialog />
    <TaskDetailsView />
  </div>

  <div class="my-5">
    <v-progress-linear v-model="donePercentageValue" height="25" :color="getProgressBarColor()">
      <strong>Done Tasks: {{ Math.ceil(donePercentageValue) }}%</strong>
    </v-progress-linear>
  </div>

  <div class="boards">
    <v-card
      v-for="item in statuses"
      @drop="onDrop($event, item)"
      @dragover.prevent
      @dragenter.prevent
    >
      <v-card-title class="text-capitalize">{{ item }}</v-card-title>

      <template v-for="task in taskDetails[item as keyof typeof taskDetails]">
        <v-card class="ma-3 pa-3" :draggable="true" @dragstart="startDrag($event, task)">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>{{ task.title }} </span>
            <span>
              <PhPencil size="16" @click="viewTaskDetails(task.id)" />
              <PhTrash size="16" class="ml-3" @click="onClickDeleteTask(task.status, task.id)"
            /></span>
          </v-card-title>
          <v-card-subtitle class="mb-3">{{ task.description }}</v-card-subtitle>
          <v-card-subtitle class="text-wrap">
            <template class="my-6" v-for="tag in task.tags">
              <v-chip class="mr-1 mb-1">{{ tag }}</v-chip>
            </template>
          </v-card-subtitle>
        </v-card>
      </template>
    </v-card>

    <v-dialog v-model="deleteTaskDialog" width="auto">
      <v-card>
        <v-card-text> Are you sure you want to delete this task? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" @click="closeDeleteTaskDialog">Cancel</v-btn>
          <v-btn
            color="error"
            @click="
              deleteTaskFromBoard(selectedDeleteTask.status, selectedDeleteTask.id),
                closeDeleteTaskDialog()
            "
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.boards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(100vh / 3), 1fr));
  gap: 2rem;
}
</style>
