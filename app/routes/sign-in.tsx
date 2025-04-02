// import { createFileRoute } from '@tanstack/react-router'
// import SignIn from '../Components/Auth/SignIn'

// export const Route = createFileRoute('/sign-in')({
//   component: SignIn,
// })

import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

// Dynamically import SignIn to prevent SSR issues
const SignIn = lazy(() => import('../Components/Auth/SignIn'))

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})
