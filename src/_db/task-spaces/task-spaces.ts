import { NewTaskSpace, TaskSpace } from "../../features/task-spaces/types"
import { execute, select } from "../db-todo"

/**
 * Inserts a new task space into the database.
 * @param {NewTaskSpace} taskSpace - The task space to be inserted.
 * @returns {Promise<void>} - A promise that resolves when the task space is inserted.
 */
export async function insertTaskSpace(taskSpace: NewTaskSpace) {
  try {
    const response = await execute(
      `
        INSERT into taskspaces
        (
          name,
          priority,
          created_at,
          updated_at
        )
        VALUES
        ($1, $2, $3, $4)`,
      [
        taskSpace.name,
        taskSpace.priority,
        new Date().toISOString(),
        new Date().toISOString(),
      ],
    )

    return response
  } catch (error) {
    console.log(error)
  }
}

/**
 * Retrieves all task spaces from the database.
 * @returns {Promise<TaskSpace[]>} - A promise that resolves with an array of task spaces.
 */
export async function getTaskSpaces(): Promise<TaskSpace[]> {
  return await select("SELECT * FROM taskspaces")
}

/**
 * Deletes a task space from the database.
 * @param {number} id - The ID of the task space to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the task is deleted.
 */
export async function deleteTaskSpace(id: number) {
  await execute("DELETE FROM taskspaces WHERE id = $1", [id])
}

/**
 * Updates a task space in the database.
 * @param {TaskSpace} task space - The task space to be updated.
 * @returns {Promise<void>} - A promise that resolves when the task space is updated.
 */
export async function updateTaskSpace(taskSpace: TaskSpace) {
  await execute(
    `
      UPDATE taskspaces
      SET
      name = $1,
      priority = $2,
      updated_at = $3
      WHERE id = $4
      `,
    [taskSpace.name, taskSpace.priority, new Date().toISOString(), taskSpace.id],
  )
}
/**
 * Updates multiple task spaces in the database.
 * @param {Task[]} task spaces - An array of task spaces to be updated.
 * @returns {Promise<void>} - A promise that resolves when the task spaces are updated.
 */
export async function updateTaskSpaces(taskSpaces: TaskSpace[]) {
  for (const taskSpace of taskSpaces) {
    await execute(
      `
        UPDATE taskspaces
        SET
        name = $1,
        priority = $2,
        updated_at = $3
        WHERE id = $4
        `,
      [taskSpace.name, taskSpace.priority, new Date().toISOString(), taskSpace.id],
    )
  }
}
