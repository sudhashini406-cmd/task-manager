import { createFileRoute } from '@tanstack/react-router'
import { EditUserForm } from '../../../Components/Users/EditUserForm'

export const Route = createFileRoute('/_labsquire/users/edit-user-form')({
  component: EditUserForm,
})

