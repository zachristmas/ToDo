import { NewTask, Task } from "../../features/tasks/types"
import { execute, select } from "../db-todo"

/**
 * Inserts a new task into the database.
 * @param {NewTask} task - The task to be inserted.
 * @returns {Promise<void>} - A promise that resolves when the task is inserted.
 */
export async function insertTask(task: NewTask) {
  await execute(
    `
  INSERT into tasks 
  (
    title, 
    description,
    due_date,
    priority,
    completed,
    created_at,
    updated_at,
    category,
    space_id
  ) 
  VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      task.title,
      task.description ?? "",
      task.due_date ?? "",
      task.priority ?? 0,
      task.completed,
      new Date().toISOString(),
      new Date().toISOString(),
      task.category ?? "",
      task.space_id ?? 0,
    ],
  )
}

/**
 * Retrieves all tasks from the database.
 * @returns {Promise<Task[]>} - A promise that resolves with an array of tasks.
 */
export async function getTasks(): Promise<Task[]> {
  return await select("SELECT * FROM tasks ORDER BY priority ASC")
}

/**
 * Deletes a task from the database.
 * @param {number} id - The ID of the task to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the task is deleted.
 */
export async function deleteTask(id: number) {
  await execute("DELETE FROM tasks WHERE id = $1", [id])
}

/**
 * Updates multiple tasks in the database.
 * @param {Task[]} tasks - An array of tasks to be updated.
 * @returns {Promise<void>} - A promise that resolves when the tasks are updated.
 */
export async function updateTasks(tasks: Task[]) {
  for (const task of tasks) {
    await execute(
      `
      UPDATE tasks 
      SET 
        title = $1, 
        description = $2, 
        due_date = $3, 
        priority = $4, 
        completed = $5, 
        updated_at = $6,
        category = $7,
        space_id = $8
      WHERE id = $9`,
      [
        task.title,
        task.description,
        task.due_date,
        task.priority,
        task.completed,
        new Date().toISOString(),
        task.category,
        task.space_id,
        task.id,
      ],
    )
  }
}
