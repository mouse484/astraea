import { deleteStore } from '@/lib/store'
import { Button } from '@/shadcn-ui/components/ui/button'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  return (
    <div>
      <Button onClick={() => {
        deleteStore('pubkey')
        navigate({
          to: '/',
        })
      }}
      >
        Log Out
      </Button>
    </div>
  )
}
