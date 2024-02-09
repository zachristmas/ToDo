import React, { useState } from "react"

import {
  ActionIcon,
  Anchor,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core"
import { useDisclosure, useFocusTrap } from "@mantine/hooks"
import { IconPencil, IconTrashFilled } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  deleteTaskSpace,
  insertTaskSpace,
  updateTaskSpace,
} from "../../_db/task-spaces/task-spaces"
import { useTaskSpaceStore } from "../../store"
import { TaskSpace } from "./types"

interface TaskSpaceActionsProps {
  taskSpace: TaskSpace
}

export const TaskSpaceActions: React.FC<TaskSpaceActionsProps> = ({ taskSpace }) => {
  if (!taskSpace) {
    return null
  }
  const queryClient = useQueryClient()

  const [taskSpaceName, setTaskSpaceName] = useState(taskSpace.name ?? "")
  const [isNewSpaceModalOpen, newSpaceModalHandler] = useDisclosure(false)
  const [isEditSpaceModalOpen, editSpaceModalHandler] = useDisclosure(false)
  const [isSelectTaskSpaceModalOpen, selectTaskSpaceModalHandler] = useDisclosure(false)
  const { setCurrentTaskSpaceId, taskSpaces } = useTaskSpaceStore()
  const focusTrapRef = useFocusTrap(true)

  const addTaskSpaceMutation = useMutation({
    mutationFn: insertTaskSpace,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["taskSpaces"] })
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      setCurrentTaskSpaceId(result?.lastInsertId ?? 0)
    },
  })

  const updateTaskSpaceMutation = useMutation({
    mutationFn: updateTaskSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskSpaces"] })
    },
  })

  const removeTaskSpaceMutation = useMutation({
    mutationFn: deleteTaskSpace,
    onSuccess: () => {
      setCurrentTaskSpaceId(taskSpaces[0]?.id ?? 0)
      queryClient.invalidateQueries({ queryKey: ["taskSpaces"] })
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  const handleAddTaskSpaceClick = () => {
    newSpaceModalHandler.open()
    setTaskSpaceName("")
  }

  const handleUpdateTaskSpace = () => {
    updateTaskSpaceMutation.mutate({
      ...taskSpace,
      name: taskSpaceName,
    })
  }

  const handleAddTaskSpace = () => {
    addTaskSpaceMutation.mutate({
      name: taskSpaceName,
      priority: taskSpace.priority + 1,
    })
  }

  const handleRemoveTaskSpace = () => {
    removeTaskSpaceMutation.mutate(taskSpace.id)
  }

  const handleTaskSpaceSelectorClick = () => {
    selectTaskSpaceModalHandler.open()
  }

  return (
    <>
      <Modal
        title="Select your task space:"
        opened={isSelectTaskSpaceModalOpen}
        onClose={() => selectTaskSpaceModalHandler.close()}
        size="sm"
      >
        <Center>
          <Stack justify="center">
            {taskSpaces.map((space) => (
              <Anchor
                key={space.id}
                onClick={() => {
                  setCurrentTaskSpaceId(space.id)
                  selectTaskSpaceModalHandler.close()
                }}
              >
                {space.name}
              </Anchor>
            ))}
          </Stack>
        </Center>
      </Modal>

      <Modal
        title="Name your new task space:"
        opened={isNewSpaceModalOpen}
        onClose={() => newSpaceModalHandler.close()}
        centered
        size="sm"
        withinPortal={false}
      >
        <TextInput
          type="text"
          value={taskSpaceName}
          autoFocus={true}
          data-autofocus
          ref={focusTrapRef}
          onChange={(e) => setTaskSpaceName(e.target.value)}
        />
        <Group mt="xs" justify="flex-end">
          <Button
            variant="light"
            onClick={() => {
              newSpaceModalHandler.close()
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAddTaskSpace()
              newSpaceModalHandler.close()
            }}
          >
            Create
          </Button>
        </Group>
      </Modal>
      <Modal
        title="Edit your task space:"
        opened={isEditSpaceModalOpen}
        onClose={() => editSpaceModalHandler.close()}
        centered
        size="sm"
        withinPortal={false}
      >
        <TextInput
          type="text"
          value={taskSpaceName}
          autoFocus={true}
          data-autofocus
          ref={focusTrapRef}
          onChange={(e) => setTaskSpaceName(e.target.value)}
        />
        <Group mt="xs" justify="flex-end">
          <Button
            variant="light"
            onClick={() => {
              editSpaceModalHandler.close()
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleUpdateTaskSpace()
              editSpaceModalHandler.close()
            }}
          >
            Update
          </Button>
        </Group>
      </Modal>
      <Grid grow py="0px" my="5px" px="2px">
        <Grid.Col span={12} py="0px" my="0px">
          <Flex justify={"center"} gap="xs">
            <Anchor onClick={handleTaskSpaceSelectorClick}>
              <Text size="xs" bottom={"0.2rem"} pos="relative">
                {taskSpace?.name}
              </Text>
            </Anchor>
            <ActionIcon
              variant="light"
              size="xs"
              bottom={"0.3rem"}
              p=".3rem"
              h="1.2rem"
              title="Edit Task Space Name"
              onClick={() => editSpaceModalHandler.open()}
            >
              <IconPencil style={{ width: "15px" }} stroke={1.5} />
            </ActionIcon>
            <Button
              size="xs"
              p=".3rem"
              h="1.2rem"
              bottom="0.3rem"
              title="Add Task Space"
              onClick={handleAddTaskSpaceClick}
            >
              +
            </Button>
            {taskSpace.priority !== 0 && (
              <ActionIcon
                variant="light"
                color="red"
                size="xs"
                bottom={"0.3rem"}
                p=".3rem"
                h="1.2rem"
                title="Edit Task Space Name"
                onClick={() => handleRemoveTaskSpace()}
              >
                <IconTrashFilled style={{ width: "15px" }} stroke={1.5} />
              </ActionIcon>
            )}
          </Flex>
        </Grid.Col>
      </Grid>
    </>
  )
}
