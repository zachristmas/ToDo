//styles
import "./App.css"

import { useEffect, useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { updateTitle } from "./_api/title"
import { getTaskSpaces } from "./_db/task-spaces/task-spaces"
import { getTasks } from "./_db/tasks/tasks"
import { TaskSpaces } from "./features/task-spaces/TaskSpaces"
import { useTaskSpaceStore } from "./store"

export default function App() {
  const { currentTaskSpaceId, setTaskSpaces } = useTaskSpaceStore()
  const taskSpacesQuery = useQuery({
    queryKey: ["taskSpaces"],
    queryFn: getTaskSpaces,
  })

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  })

  const taskSpacesByPriority = (taskSpacesQuery.data ?? []).sort(
    (a, b) => a.priority - b.priority,
  )

  const tasksForCurrentSpace = tasksQuery.data?.filter(
    (task) => task.space_id === currentTaskSpaceId,
  )

  const allTasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data])

  useEffect(() => {
    if (taskSpacesQuery.data && !taskSpacesQuery.isLoading) {
      setTaskSpaces(taskSpacesQuery.data)
    }
  }, [taskSpacesQuery.data, taskSpacesQuery.isLoading])

  useEffect(() => {
    updateTitle({
      title: tasksForCurrentSpace?.find((task) => task.id)?.title ?? "TODO",
    })
  }, [tasksForCurrentSpace, taskSpacesByPriority[0]?.id])

  if (taskSpacesQuery.isLoading || tasksQuery.isLoading) {
    return null
  }

  return <TaskSpaces taskSpaces={taskSpacesByPriority} tasks={allTasks} />
}
