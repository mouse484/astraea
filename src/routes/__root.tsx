import type { RouterContext } from '@/main'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ThemeProvider } from 'next-themes'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Toaster } from '@/shadcn-ui/components/ui/sonner'
import '../globals.css'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <HeadContent />
      <ThemeProvider attribute="class">
        <Outlet />
        <Toaster />
      </ThemeProvider>
      <TanStackDevtools
        plugins={[
          { name: 'Tanstack Query', render: <ReactQueryDevtoolsPanel /> },
          { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
        ]}
      />
    </>
  ),
  notFoundComponent: () => (
    <div className={`
      grid h-svh w-svw place-content-center place-items-center gap-8
    `}
    >
      <h1 className="text-4xl">404</h1>
      <Button asChild variant="outline">
        <Link to="/">Back to Top</Link>
      </Button>
    </div>
  ),
})
