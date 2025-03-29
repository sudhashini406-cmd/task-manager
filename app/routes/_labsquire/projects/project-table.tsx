import { createFileRoute } from '@tanstack/react-router'
import ProjectTable from '../../../Components/Projects/ProjectTable'

export const Route = createFileRoute('/_labsquire/projects/project-table')({
  component: ProjectTable,
})

