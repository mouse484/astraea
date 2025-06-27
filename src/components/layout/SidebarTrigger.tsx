import { Menu } from 'lucide-react'
import { Button } from '@/shadcn-ui/components/ui/button'
import { useSidebar } from '@/shadcn-ui/components/ui/sidebar'
import { cn } from '@/shadcn-ui/utils'

interface Props {
  className?: string
}

export function SidebarTrigger({ className }: Props) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      className={cn(className)}
      size="icon"
      variant="ghost"
      onClick={toggleSidebar}
      aria-labelledby="sidebar toggle-button"
    >
      <Menu />
    </Button>
  )
}
