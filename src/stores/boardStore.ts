import type { Status, Statuses, TaskDetails } from '@/types'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// available statuses for board stores
const initialStatuses = {
  pending: [],
  processing: [],
  done: []
}

// handles status updates for each task
export const useBoardStore = defineStore('boardStore', () => {
  const localCookie = 'statusValues'

  const tasksGroupedByStatus = ref<Status>(
    JSON.parse(localStorage.getItem(localCookie) as string) || initialStatuses
  )

  const statuses = Object.keys(initialStatuses)

  // combines all tasks
  const tasksData = ref(
    tasksGroupedByStatus.value.pending
      .concat(tasksGroupedByStatus.value.processing)
      .concat(tasksGroupedByStatus.value.done)
  )
  const taskId = ref(tasksData.value.length + 1)
  const doneTasksPercentage = ref(0)

  // updates tasksData everytime new task is added
  watch(
    () => tasksGroupedByStatus.value,
    () => {
      tasksData.value = tasksGroupedByStatus.value.pending
        .concat(tasksGroupedByStatus.value.processing)
        .concat(tasksGroupedByStatus.value.done)
    },
    { deep: true, immediate: true }
  )

  // updates progress everytime new task is changed to done
  watch(
    () => tasksGroupedByStatus.value.done,
    () => {
      doneTasksPercentage.value =
        (tasksGroupedByStatus.value.done.length / tasksData.value.length) * 100 || 0
    },
    { deep: true, immediate: true }
  )

  const updateLocalCookie = () =>
    localStorage.setItem(localCookie, JSON.stringify(tasksGroupedByStatus.value))

  const addTaskToBoard = (details: TaskDetails) => {
    const { status } = details
    const id = { id: taskId.value++ }
    const exampleDetails: TaskDetails = details
      ? { ...id, ...details, status }
      : {
          ...id,
          title: 'test title',
          description: 'test description',
          datetime: 'test date time',
          status: 'pending',
          comments: []
        }

    tasksGroupedByStatus.value[status].push(exampleDetails)
    updateLocalCookie()
  }

  const updateTask = (oldStatus: Statuses, details: TaskDetails) => {
    const taskIndex = tasksGroupedByStatus.value[oldStatus].findIndex(
      (task) => task.id === details.id
    )

    if (taskIndex > -1) tasksGroupedByStatus.value[oldStatus].splice(taskIndex, 1)

    tasksGroupedByStatus.value[details.status].push(details)
    updateLocalCookie()
  }

  const addCommentToTask = (comment: string, details: TaskDetails) => {
    const taskIndex = tasksGroupedByStatus.value[details.status].findIndex(
      (task) => task.id === details.id
    )

    if (taskIndex > -1) {
      tasksGroupedByStatus.value[details.status][taskIndex].comments.push(comment)
      updateLocalCookie()
    }
  }

  const deleteTaskFromBoard = (status: Statuses, id: number) => {
    const taskIndex = tasksGroupedByStatus.value[status].findIndex((task) => task.id === id)

    if (taskIndex > -1) tasksGroupedByStatus.value[status].splice(taskIndex, 1)

    updateLocalCookie()
  }

  const getTaskDetails = (id: number) => {
    const taskData = tasksData.value.find((task) => task.id === id)

    return taskData
  }

  const getDonePercentage = () => doneTasksPercentage

  const resetLocalStorage = () => {
    localStorage.removeItem(localCookie)
    window.location.reload()
  }

  return {
    tasksGroupedByStatus,
    statuses,
    addTaskToBoard,
    getTaskDetails,
    deleteTaskFromBoard,
    getDonePercentage,
    doneTasksPercentage,
    updateTask,
    addCommentToTask,
    resetLocalStorage
  }
})
