import { createFileRoute } from '@tanstack/react-router'
import { GetSingleProject } from '../../../../../Components/Projects/GetSingleProject'

export const Route = createFileRoute(
  '/_labsquire/projects/get-single-project/$projectId/',
)({
  component: GetSingleProject
})


