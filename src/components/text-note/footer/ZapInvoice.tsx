import { CopyIcon } from 'lucide-react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Input } from '@/shadcn-ui/components/ui/input'

interface Props {
  invoice: string
}

export default function ZapInvoice({ invoice }: Props) {
  return (
    <div className="grid w-full place-items-center gap-3">
      <QRCode
        className="rounded-sm bg-white p-2"
        value={invoice}
      />
      <div className="relative grid w-full max-w-full">
        <Input
          aria-label="Lightning invoice"
          className="cursor-pointer truncate pr-10 text-xs select-all"
          readOnly
          title={invoice}
          type="text"
          value={invoice}
        />
        <Button
          aria-label="Copy"
          className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(invoice)
              .then(() => toast.success('Invoice copied!'))
              .catch(() => toast.error('Failed to copy invoice'))
          }}
        >
          <CopyIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
