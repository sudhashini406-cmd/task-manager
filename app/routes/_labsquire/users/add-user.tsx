import { createFileRoute } from '@tanstack/react-router'
import AddUser from '../../../Components/Users/AddUser'

export const Route = createFileRoute('/_labsquire/users/add-user')({
  component:AddUser,
})
