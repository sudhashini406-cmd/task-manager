import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../Components/Auth/Layout'

export const Route = createFileRoute('/_labsquire')({
  component: Layout,
})
