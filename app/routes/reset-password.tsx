import { createFileRoute } from '@tanstack/react-router'
import ResetPassword from '../Components/Auth/ResetPassword'

export const Route = createFileRoute('/reset-password')({
  component:ResetPassword
})

