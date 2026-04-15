import { createFileRoute } from '@tanstack/react-router'
import Timeline from '@/components/timeline/Timeline'

export const Route = createFileRoute('/(app)/global')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Timeline />
}
