import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useQuery } from '@tanstack/react-query'
import { ZapIcon } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'
import { useAppForm } from '@/lib/form'
import useNostr from '@/lib/nostr/hooks/use-nostr'
import { useZap } from '@/lib/nostr/hooks/use-zap'
import { MetadataQuery } from '@/lib/nostr/kinds/0'
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
import { cn } from '@/shadcn-ui/lib/utils'

const ZapInvoice = lazy(async () => import('./ZapInvoice.tsx'))

interface Props {
  event: z.infer<typeof TextNoteEventSchema>
  setTimelinePaused?: (paused: boolean) => void
}

export default function Zap({ event, setTimelinePaused }: Props) {
  const { queryContext, relays } = useNostr()
  const [open, setOpen] = useState(false)
  const pubkey = createPubkey(event.pubkey)
  const { data: metadata } = useQuery({
    ...MetadataQuery(
      queryContext,
      pubkey.decoded,
      ({ setKey, id }) => setKey(id),
    ),
    enabled: open,
  })
  const [invoice, setInvoice] = useState<string>()
  const zap = useZap(metadata?.content ?? {})
  const commentAllowed = zap.data?.lnurlResponse?.commentAllowed ?? 0

  const ZapFormSchema = z.object({
    amount: z.int().min(1).max(1_000_000),
    message: z.string().trim().max(commentAllowed),
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
              <Suspense>
                <ZapInvoice invoice={invoice} />
              </Suspense>
            )}
      </DialogContent>
    </Dialog>
  )
}
