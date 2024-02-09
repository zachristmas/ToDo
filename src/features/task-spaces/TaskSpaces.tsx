import React, { useCallback, useEffect, useMemo, useRef } from "react"

import { animated, useSpringRef, useTransition } from "@react-spring/web"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { insertTaskSpace } from "../../_db/task-spaces/task-spaces"
import { useTaskSpaceStore } from "../../store"
import { Task } from "../tasks/types"
import { TaskSpaceContainer } from "./TaskSpaceContainer"
import { TaskSpace } from "./types"

interface TaskSpacesProps {
  taskSpaces: TaskSpace[]
  tasks: Task[]
}

export const TaskSpaces: React.FC<TaskSpacesProps> = ({ taskSpaces, tasks }) => {
  const queryClient = useQueryClient()
  const { currentTaskSpaceId, setCurrentTaskSpaceId } = useTaskSpaceStore()

  const taskSpacesMutation = useMutation({
    mutationFn: insertTaskSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskSpaces"] })
    },
  })

  useEffect(() => {
    // create a default task space if none exists
    if (taskSpaces?.length === 0) {
      taskSpacesMutation.mutate({
        name: "Default",
        priority: 0,
      })
    } else {
      setCurrentTaskSpaceId(taskSpaces[0].id)
    }
  }, [taskSpaces?.length])

  const swipeRef = useRef("")
  const isScrolling = useRef(false)
  const transRef = useSpringRef()

  const transitions = useTransition(currentTaskSpaceId, {
    ref: transRef,
    keys: null,
    onStart: () => {
      isScrolling.current = true
    },
    onRest: () => {
      setTimeout(() => {
        isScrolling.current = false
      }, 200)
    },
    config: {
      mass: 0.1,
      friction: 30,
      tension: 500,
    },
    from: {
      opacity: 0,
      transform:
        swipeRef.current === "right"
          ? "translate3d(100%,0,0)"
          : "translate3d(-100%,0,0)",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0)",
    },
    leave: {
      opacity: 1,
      transform:
        swipeRef.current === "right" ? "translate3d(-50%,0,0)" : "translate3d(50%,0,0)",
    },
  })
  const scrollToNextTaskSpace = useCallback(() => {
    const currentIndex = taskSpaces.findIndex(
      (taskSpace) => taskSpace.id === currentTaskSpaceId,
    )
    if (currentIndex < taskSpaces.length - 1) {
      swipeRef.current = "right"
      setCurrentTaskSpaceId(taskSpaces[currentIndex + 1].id)
    }
  }, [currentTaskSpaceId])

  const scrollToPrevTaskSpace = useCallback(() => {
    const currentIndex = taskSpaces.findIndex(
      (taskSpace) => taskSpace.id === currentTaskSpaceId,
    )
    if (currentIndex > 0) {
      swipeRef.current = "left"
      setCurrentTaskSpaceId(taskSpaces[currentIndex - 1].id)
    }
  }, [currentTaskSpaceId])

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollThreshold = 15
  const handleScroll = (e: WheelEvent) => {
    if (isScrolling.current === true) return
    // prevent default if scroll direction is horizontal
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault()
      if (e.deltaX > scrollThreshold) {
        scrollToNextTaskSpace()
      }

      if (e.deltaX < -scrollThreshold) {
        scrollToPrevTaskSpace()
      }
    }
  }
  useEffect(() => {
    transRef.start()
    const element = scrollContainerRef.current
    element?.addEventListener("wheel", handleScroll)

    return () => {
      element?.removeEventListener("wheel", handleScroll)
    }
  }, [currentTaskSpaceId])

  const currentTaskSpace = useMemo(
    () => taskSpaces.find((taskSpace) => taskSpace.id === currentTaskSpaceId),
    [currentTaskSpaceId, taskSpaces],
  )

  // const tasksForSpace = useMemo(
  //   () => tasks.filter((task) => task.space_id === currentTaskSpaceId),
  //   [currentTaskSpaceId, tasks],
  // )

  const tasksForSpace = tasks.filter((task) => task.space_id === currentTaskSpaceId)

  return (
    <div
      ref={scrollContainerRef}
      style={{
        width: "100%",
        height: "100%",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {transitions((style, i) => {
        if (i === null || !currentTaskSpace) return null
        return (
          <animated.div style={{ ...style }} className={"position-absolute"}>
            <TaskSpaceContainer taskSpace={currentTaskSpace} tasks={tasksForSpace} />
          </animated.div>
        )
      })}
    </div>
  )
}
