import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useQuery } from '@tanstack/react-query'
import { CopyIcon, ZapIcon } from 'lucide-react'
import { useState } from 'react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAppForm } from '@/lib/form'
import useNostr from '@/lib/nostr/hooks/use-nostr'
import { useZap } from '@/lib/nostr/hooks/use-zap'
import { metadataQuery } from '@/lib/nostr/kinds/0'
import { createPubkey } from '@/lib/nostr/nip19'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn-ui/components/ui/dialog'
import { Input } from '@/shadcn-ui/components/ui/input'
import { cn } from '@/shadcn-ui/utils'

interface Props {
  event: z.infer<typeof TextNoteEventSchema>
  setTimelinePaused?: (paused: boolean) => void
}

export default function Zap({ event, setTimelinePaused }: Props) {
  const { queryContext, relays } = useNostr()
  const pubkey = createPubkey(event.pubkey)
  const { data: metadata } = useQuery(metadataQuery(
    queryContext,
    pubkey.decoded,
    ({ setKey, id }) => setKey(id),
  ))
  const [invoice, setInvoice] = useState<string>()
  const zap = useZap(metadata?.content ?? {})
  const commentAllowed = zap.data?.lnurlResponse?.commentAllowed ?? 0

  const ZapFormSchema = z.object({
    amount: z.number().int().min(1).max(1_000_000),
    message: z.string().max(commentAllowed),
  })

  const form = useAppForm({
    validators: {
      onSubmit: ZapFormSchema,
    },
    defaultValues: {
      amount: 39,
      message: '',
    },
    onSubmit({ value }) {
      // TODO: mutation剥がしていいかも？
      zap.mutation.mutate({
        amount: value.amount,
        message: value.message,
        pubkey: pubkey.decoded,
        targetEventId: event.id,
        relays: [...new Set([
          ...relays.write,
          ...relays.read,
        ])],
      }, {
        onSuccess: (result) => {
          setInvoice(result.pr)
        },
        onError: (error) => {
          setInvoice(undefined)
          console.error('Invoice generation failed:', error)
          toast.error(`Failed to generate invoice: ${error.message || 'Unknown error'}`)
        },
      })
    },
  })

  const [open, setOpen] = useState(false)
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (setTimelinePaused) setTimelinePaused(nextOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          disabled={zap.isLoading || !zap.data?.isEnabled}
        >
          <ZapIcon
            className={cn(
              zap.isLoading && 'animate-pulse rounded-md bg-accent',
            )}
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Zap</DialogTitle>
          <DialogDescription className="sr-only">
            Custom amount and messages.
          </DialogDescription>
        </DialogHeader>
        {invoice === undefined
          ? (
              <form.AppForm>
                <form.Root>
                  <form.AppField name="amount">
                    {field => (
                      <field.InputField label="Amount (sats)" type="number" />
                    )}
                  </form.AppField>
                  {commentAllowed > 0 && (
                    <form.AppField name="message">
                      {field => (
                        <field.InputField
                          label={`Message (max ${commentAllowed} chars)`}
                          type="text"
                        />
                      )}
                    </form.AppField>
                  )}
                  <form.Submit className="w-full">
                    Generate Invoice
                  </form.Submit>
                </form.Root>
              </form.AppForm>
            )
          : (
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
            )}
      </DialogContent>
    </Dialog>
  )
}
