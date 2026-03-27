import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { Schema } from 'effect'
import { CopyIcon, ZapIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
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
import { Label } from '@/shadcn-ui/components/ui/label'
import { Textarea } from '@/shadcn-ui/components/ui/textarea'
import { cn } from '@/shadcn-ui/utils'

const amountSchema = Schema.standardSchemaV1(
  Schema.Number.pipe(
    Schema.int(),
    Schema.greaterThanOrEqualTo(1),
    Schema.lessThanOrEqualTo(1_000_000),
  ),
)

interface Props {
  event: typeof TextNoteEventSchema.Type
  setTimelinePaused?: (paused: boolean) => void
}

export default function Zap({ event, setTimelinePaused }: Props) {
  const { getQueryOption, relays } = useNostr()
  const pubkey = createPubkey(event.pubkey)
  const { data: metadata } = useQuery(getQueryOption(metadataQuery, pubkey.decoded))
  const [invoice, setInvoice] = useState<string>()
  const zap = useZap(metadata?.content ?? {})
  const commentAllowed = zap.data?.lnurlResponse?.commentAllowed ?? 0

  const messageSchema = useMemo(
    () => Schema.standardSchemaV1(
      Schema.optional(Schema.String.pipe(Schema.maxLength(commentAllowed))),
    ),
    [commentAllowed],
  )

  const form = useForm({
    defaultValues: {
      amount: 39,
      message: '',
    },
    onSubmit: ({ value }) => {
      if (zap.mutation === undefined) return
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
              <form
                className="space-y-4"
                onSubmit={(event_) => {
                  event_.preventDefault()
                  void form.handleSubmit()
                }}
              >
                <form.Field
                  name="amount"
                  validators={{ onChange: amountSchema }}
                >
                  {field => (
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>Amount (sats)</Label>
                      <Input
                        id={field.name}
                        type="number"
                        value={field.state.value}
                        disabled={zap.mutation.isPending}
                        onBlur={field.handleBlur}
                        onChange={event_ => field.handleChange(Number(event_.target.value))}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
                {commentAllowed > 0 && (
                  <form.Field
                    name="message"
                    validators={{
                      onChange: messageSchema,
                    }}
                  >
                    {field => (
                      <div className="grid gap-2">
                        <Label htmlFor={field.name}>Message (optional)</Label>
                        <Textarea
                          id={field.name}
                          value={field.state.value}
                          disabled={zap.mutation.isPending}
                          onBlur={field.handleBlur}
                          onChange={event_ => field.handleChange(event_.target.value)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors[0]?.message}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                )}
                <Button className="w-full" type="submit" disabled={zap.mutation.isPending}>
                  {zap.mutation.isPending ? 'Generating...' : 'Generate Invoice'}
                </Button>
              </form>
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
                    className={`
                      absolute top-1/2 right-1 size-7 -translate-y-1/2
                    `}
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
