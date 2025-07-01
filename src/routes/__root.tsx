import type { RouterContext } from '@/main'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
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
      <TanStackRouterDevtools initialIsOpen={false} />
      <ReactQueryDevtools initialIsOpen={false} />
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
