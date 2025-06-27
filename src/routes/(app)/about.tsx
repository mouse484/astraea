import { Link } from '@tanstack/react-router'
import { CircleDot, Code } from 'lucide-react'
import { Badge } from '@/shadcn-ui/components/ui/badge'
import { Button } from '@/shadcn-ui/components/ui/button'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mt-10 grid place-items-center gap-8">
      <div className="relative">
        <h1 className="text-3xl">Astraea</h1>
        {import.meta.env.VITE_APP_VERSION && (
          <Badge className="absolute -top-4 -right-8">
            {import.meta.env.VITE_APP_VERSION}
          </Badge>
        )}
      </div>

      <div>
        made by
        <Button asChild variant="link" className="p-0 pl-1">
          <Link
            to="/npub1{$id}"
            params={{
              id: 'ecxns5jjwvaasnq7nnna0nd4wvacqgdmpvm5pjzdrpzcp06q863s0w23y6',
            }}
          >
            mouse484
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button asChild variant="outline">
          <a href="https://github.com/mouse484/astraea" target="_blank" rel="noopener noreferrer">
            <Code />
            {' '}
            Source Code
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="https://github.com/mouse484/astraea/issues/new/choose" target="_blank" rel="noopener noreferrer">
            <CircleDot />
            {' '}
            Report an Issue
          </a>
        </Button>
      </div>
    </div>
  )
}
