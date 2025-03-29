import { createFileRoute } from '@tanstack/react-router'
import ProjectMembers from '../../../../../Components/Projects/GetMembers'

export const Route = createFileRoute(
  '/_labsquire/projects/get-members/$projectId/index1',
)({
  component: ProjectMembers,
})


