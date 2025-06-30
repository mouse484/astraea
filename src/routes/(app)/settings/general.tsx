import { useTheme } from 'next-themes'
import { Button } from '@/shadcn-ui/components/ui/button'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { setTheme, theme, themes } = useTheme()
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4">
        {themes.map(t => (
          <Button
            key={t}
            disabled={t === theme}
            onClick={() => setTheme(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      <Button onClick={() => {
        localStorage.clear()
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
