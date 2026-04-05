import type { StoreValue } from '@/lib/store/schema'
import { Trash } from 'lucide-react'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Checkbox } from '@/shadcn-ui/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn-ui/components/ui/table'
import { cn } from '@/shadcn-ui/lib/utils'

type Relay = StoreValue<'relays'>[number]

interface RelayTableProps {
  relays: StoreValue<'relays'>
  isLoading?: boolean
  onUpdateRelay: (index: number, updatedRelay: Relay) => void
  onDeleteRelay: (index: number) => void
}

export function RelayTable({
  relays,
  isLoading = false,
  onUpdateRelay,
  onDeleteRelay,
}: RelayTableProps) {
  function updatePermission(
    relay: Relay,
    index: number,
    type: 'read' | 'write',
    checked: boolean | 'indeterminate',
  ) {
    onUpdateRelay(index, { ...relay, [type]: Boolean(checked) })
  }

  return (
    <div className={cn(
      'rounded-md border',
      isLoading && 'pointer-events-none animate-pulse',
    )}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Relay URL</TableHead>
            <TableHead>Read</TableHead>
            <TableHead>Write</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relays.length > 0
            ? relays.map((relay, index) => (
                <TableRow key={relay.url}>
                  <TableCell className="text-sm">{relay.url}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={relay.read}
                      onCheckedChange={(checked) => {
                        updatePermission(relay, index, 'read', checked)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={relay.write}
                      onCheckedChange={(checked) => {
                        updatePermission(relay, index, 'write', checked)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onDeleteRelay(index)}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={4}>
                    <p>Not found relays.</p>
                    <p>Please add or load relays.</p>
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  )
}
