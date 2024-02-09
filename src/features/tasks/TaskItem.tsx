import cx from "clsx"

import { Draggable } from "@hello-pangea/dnd"
import { ActionIcon, Flex, Grid, rem, Text } from "@mantine/core"
import { IconGripVertical, IconTrash } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteTask } from "../../_db/tasks/tasks"
import classes from "./TaskItem.module.css"
import { Task } from "./types"

export const TaskItem = ({ item, index }: { item: Task; index: number }) => {
  const queryClient = useQueryClient()

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  async function handleDeleteTask(e: React.SyntheticEvent) {
    e.preventDefault()
    await deleteTaskMutation.mutateAsync(item.id)
  }

  return (
    <Draggable key={item.id} index={index} draggableId={item.id.toLocaleString()}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Grid p={0}>
            <Grid.Col span={1}>
              <div {...provided.dragHandleProps}>
                <IconGripVertical
                  style={{ width: "100%", height: "auto" }}
                  stroke={1.5}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={1}>{index + 1}.</Grid.Col>
            <Grid.Col span={7}>
              {/* <Text>{item.completed ? <del>{item.title}</del> : item.title}</Text> */}
              <Text>{item.title}</Text>
            </Grid.Col>
            <Grid.Col span={3}>
              <Flex justify="end" p={0}>
                <ActionIcon variant="filled" color="red">
                  <IconTrash
                    style={{ width: rem(18), height: rem(18) }}
                    stroke={1.5}
                    onClick={handleDeleteTask}
                  />
                </ActionIcon>
              </Flex>
            </Grid.Col>
          </Grid>
        </div>
      )}
    </Draggable>
  )
}
