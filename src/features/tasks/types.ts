export interface Task {
  id: number
  title: string
  completed: boolean
  description: string
  due_date: string
  priority: number
  created_at: string
  updated_at: string
  category: string
  space_id: number
}

export interface NewTask {
  title: string
  completed?: boolean
  description?: string
  due_date?: string
  priority?: number
  category?: string
  space_id?: number | null
}
