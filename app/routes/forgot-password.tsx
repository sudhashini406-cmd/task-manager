import { createFileRoute } from '@tanstack/react-router'
import ForgotPasswordPage from '../Components/Auth/ForgotPassword'
//import ForgotPasswordPage from './Components/Auth/ForgotPassword'
export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

