// app/routes/index.tsx
import * as fs from 'node:fs'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import SignIn from '../Components/Auth/SignIn'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {


  return (
  <SignIn/>
  )
}