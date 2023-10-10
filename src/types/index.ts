export type Statuses = 'pending' | 'processing' | 'done'

export type Tags = {
  id: number
  name: string
}

export type Status = {
  [key in Statuses]: TaskDetails[]
}

export type TaskDetails = {
  id: number
  title: string
  description: string
  file?: File[]
  datetime: string
  status: Statuses
  tags?: Tags[]
  comments: string[]
}
