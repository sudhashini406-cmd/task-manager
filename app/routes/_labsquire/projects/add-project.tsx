import AddProjectForm from '@/Components/Projects/AddProject'
import { createFileRoute } from '@tanstack/react-router'
//import AddProjectForm from '../../../Components/Projects/AddProject'

export const Route = createFileRoute('/_labsquire/projects/add-project')({
  component:AddProjectForm ,
})
