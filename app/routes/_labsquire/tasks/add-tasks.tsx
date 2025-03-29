import { createFileRoute } from '@tanstack/react-router'
import AddTask from '../../../Components/Tasks/AddTask'

export const Route = createFileRoute('/_labsquire/tasks/add-tasks')({
  component: AddTask,
})

