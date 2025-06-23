import type { CellContext, ColumnDef } from '@tanstack/react-table'
import type { DataTableProps } from '@/components/DataTable'
import type { StoreValue } from '@/lib/store/schema'

import { Trash } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Checkbox } from '@/shadcn-ui/components/ui/checkbox'

type Relay = StoreValue<'relays'>[number]

interface RelayTableProps extends Omit<DataTableProps<Relay, unknown>, 'columns' | 'data'> {
  relays: StoreValue<'relays'>
  onUpdateRelay: (index: number, updatedRelay: StoreValue<'relays'>[number]) => void
  onDeleteRelay: (index: number) => void
}

export function RelayTable({
  relays,
  onUpdateRelay,
  onDeleteRelay,
  ...dataTableProps
}: RelayTableProps) {
  function createCell(type: 'read' | 'write') {
    return ({ row: { index, original } }: CellContext<Relay, unknown>) => {
      return (
        <Checkbox
          checked={original[type]}
          onCheckedChange={(checked) => {
            onUpdateRelay(index, { ...original, [type]: !!checked })
          }}
        />
      )
    }
  }

  const columns = [
    {
      accessorKey: 'url',
      header: 'Relay URL',
    },
    {
      accessorKey: 'read',
      header: 'Read',
      cell: createCell('read'),
    },
    {
      accessorKey: 'write',
      header: 'Write',
      cell: createCell('write'),
    },
    {
      header: 'Delete',
      cell: ({ row: { index } }: CellContext<Relay, unknown>) => {
        return (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDeleteRelay(index)}
          >
            <Trash className="size-4" />
          </Button>
        )
      },
    },
  ] satisfies ColumnDef<Relay>[]

  return <DataTable columns={columns} data={relays} {...dataTableProps} />
}
