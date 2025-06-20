import TimeLine from '@/components/timeline/TimeLine'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-full w-full">
      <TimeLine />
    </div>
  )
}
