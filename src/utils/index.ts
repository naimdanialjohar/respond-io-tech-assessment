import { ref } from 'vue'

// form validation to be used with adding new task
export const formRules = ref({
  title: [
    (text: string) => !!text || 'Title is required',
    (text: string) => (text && text.length > 5) || 'Title must be more than 5 characters'
  ],
  description: [
    (text: string) => !!text || 'Description is required',
    (text: string) => (text && text.length > 10) || 'Description must be more than 10 characters'
  ],
  datetime: [(text: string) => !!text || 'Estimated Time is required'],
  status: [(text: string) => !!text || 'Status is required']
})
