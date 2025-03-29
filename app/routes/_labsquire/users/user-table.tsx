import { createFileRoute } from '@tanstack/react-router'
import UserTable from '../../../Components/Users/UserTable'

export const Route = createFileRoute('/_labsquire/users/user-table')({
  component: UserTable,
})
