import { createFileRoute } from '@tanstack/react-router'
import SignIn from '../Components/Auth/SignIn'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

