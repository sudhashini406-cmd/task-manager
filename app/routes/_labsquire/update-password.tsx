import { createFileRoute } from '@tanstack/react-router'
import { UpdatePassword } from '../../Components/Auth/UpdatePassword'
//import { UpdatePassword } from '../Components/Auth/UpdatePassword'

export const Route = createFileRoute('/_labsquire/update-password')({
  component: UpdatePassword
})


