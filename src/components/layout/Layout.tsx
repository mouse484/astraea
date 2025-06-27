import type { PropsWithChildren } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { SidebarTrigger } from '@/components/layout/SidebarTrigger'
import { SidebarProvider } from '@/shadcn-ui/components/ui/sidebar'
import { useIsMobile } from '@/shadcn-ui/hooks/use-mobile'

interface Props extends PropsWithChildren {}
export function Layout({ children }: Props) {
  const isMobile = useIsMobile()

  return (
    <div className="max-w-svw overflow-x-hidden">
      <SidebarProvider>
        <Sidebar />
        <main className="h-svh w-full p-4">
          {isMobile && (
            <SidebarTrigger className="mb-4" />
          )}
          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}
