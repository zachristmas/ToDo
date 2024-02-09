import { create } from "zustand"

import { TaskSpace } from "../features/task-spaces/types"

interface TaskSpaceState {
  taskSpaces: TaskSpace[]
  setTaskSpaces: (taskSpaces: TaskSpace[]) => void
  currentTaskSpaceId: number | null
  setCurrentTaskSpaceId: (id: number) => void
}

export const useTaskSpaceStore = create<TaskSpaceState>((set) => ({
  taskSpaces: [],
  setTaskSpaces: (taskSpaces: TaskSpace[]) => set({ taskSpaces }),
  currentTaskSpaceId: null,
  setCurrentTaskSpaceId: (id: number) => set({ currentTaskSpaceId: id }),
}))
