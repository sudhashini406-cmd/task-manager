import { createFileRoute } from '@tanstack/react-router'
import TaskStats from '../../../Components/Tasks/GetTaskStats'

export const Route = createFileRoute('/_labsquire/tasks/get-task-stats')({
  component: TaskStats,
})


