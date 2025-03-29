import { createFileRoute } from '@tanstack/react-router'
import { GetProfile } from '../../Components/Auth/GetProfile'


export const Route = createFileRoute('/_labsquire/get-profile')({
  component: GetProfile,
})

