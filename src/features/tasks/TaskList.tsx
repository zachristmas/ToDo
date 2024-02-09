import { useEffect, useState } from "react"

import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useListState } from "@mantine/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateTasks } from "../../_db/tasks/tasks"
import { TaskItem } from "./TaskItem"
import { Task } from "./types"

export function TaskList({ tasks }: { tasks: Task[] }) {
  const queryClient = useQueryClient()
  const [state, handlers] = useListState(tasks)
  const [reorderedCount, setReorderedCount] = useState(0)

  const updateTasksMutation = useMutation({
    mutationFn: updateTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  useEffect(() => {
    handlers.setState(tasks)
  }, [tasks])

  useEffect(() => {
    updateTasksMutation.mutateAsync(
      state.map((item, index) => ({
        ...item,
        priority: index + 1,
      })),
    )
  }, [reorderedCount])

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
        if (destination?.index !== source.index) {
          setReorderedCount((c) => c + 1)
        }
      }}
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {state.map((item, index) => (
              <TaskItem key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
