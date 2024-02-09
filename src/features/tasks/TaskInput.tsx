import { useState } from "react"

import { Affix, Button, Grid, Paper, TextInput } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { insertTask } from "../../_db/tasks/tasks"
import { useTaskSpaceStore } from "../../store"
import { TaskSpaceActions } from "../task-spaces/TaskSpaceActions"
import { TaskSpace } from "../task-spaces/types"
import classes from "./TaskInput.module.css"
import { Task } from "./types"

export const TaskInput = ({
  taskSpace,
  tasks,
}: {
  taskSpace: TaskSpace
  tasks: Task[]
}) => {
  const queryClient = useQueryClient()
  const [taskInput, setTaskInput] = useState("")
  const { currentTaskSpaceId } = useTaskSpaceStore()

  const addTaskMutation = useMutation({
    mutationFn: insertTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  async function handleButtonClick(e: React.SyntheticEvent) {
    e.preventDefault()

    if (!taskInput) return

    await addTaskMutation.mutateAsync({
      title: taskInput,
      completed: false,
      priority: tasks.length + 1,
      space_id: currentTaskSpaceId,
    })

    setTaskInput("")
  }

  function handleTaskInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleButtonClick(e)
    }
  }

  return (
    <Affix className={classes["task-input"]}>
      <Paper shadow="sm">
        <Grid grow p={"xs"}>
          <Grid.Col span={12} p="0px" m="0px"></Grid.Col>
          <Grid.Col span={2}>
            <Button size="sm" onClick={handleButtonClick}>
              Add Task
            </Button>
          </Grid.Col>
          <Grid.Col span={9}>
            <TextInput
              id="name"
              name="name"
              value={taskInput}
              size="sm"
              onChange={(event) => setTaskInput(event.currentTarget.value)}
              onKeyDown={handleTaskInputKeyDown}
              width="100%"
              placeholder="Enter a task..."
            />
          </Grid.Col>
        </Grid>
        {taskSpace && <TaskSpaceActions taskSpace={taskSpace} />}
      </Paper>
    </Affix>
  )
}
