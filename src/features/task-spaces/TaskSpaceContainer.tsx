import { TaskInput } from "../tasks/TaskInput"
import { TaskList } from "../tasks/TaskList"
import { Task } from "../tasks/types"
import { TaskSpace } from "./types"

export const TaskSpaceContainer = ({
  taskSpace,
  tasks,
}: {
  taskSpace: TaskSpace
  tasks: Task[]
}) => {
  return (
    <>
      <TaskList tasks={tasks} />
      {taskSpace && <TaskInput taskSpace={taskSpace} tasks={tasks} />}
    </>
  )
}
