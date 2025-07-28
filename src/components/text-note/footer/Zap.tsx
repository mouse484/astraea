import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useQuery } from '@tanstack/react-query'
import { Schema } from 'effect'
import { Copy as CopyIcon, Zap as ZapIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useZap } from '@/lib/nostr/hooks/use-zap'
import { metadataQuery } from '@/lib/nostr/kinds/0'
import { createPubkey } from '@/lib/nostr/nip19'
import useNostr from '@/lib/nostr/use-nostr'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn-ui/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn-ui/components/ui/form'
import { Input } from '@/shadcn-ui/components/ui/input'
import { Textarea } from '@/shadcn-ui/components/ui/textarea'
import { cn } from '@/shadcn-ui/utils'

interface Props {
  event: typeof TextNoteEventSchema.Type
}

const ZapFormSchema = Schema.Struct({
  amount: Schema.Number.pipe(
    Schema.int(),
    Schema.greaterThanOrEqualTo(1),
    Schema.lessThanOrEqualTo(1_000_000),
  ),
  message: Schema.optional(Schema.String.pipe(Schema.maxLength(280))),
})

const zapFormStandardSchema = Schema.standardSchemaV1(ZapFormSchema)

type ZapFormData = typeof ZapFormSchema.Type

export default function Zap({ event }: Props) {
  const { getQueryOption } = useNostr()
  const pubkey = createPubkey(event.pubkey)
  const { data: metadata } = useQuery(getQueryOption(metadataQuery, pubkey.decoded))

  const [invoice, setInvoice] = useState<string>()

  const form = useForm<ZapFormData>({
    resolver: standardSchemaResolver(zapFormStandardSchema),
    defaultValues: {
      amount: 39,
      message: '',
    },
  })

  const zap = useZap(metadata?.content ?? {})

  const onSubmit = (data: ZapFormData) => {
    if (!zap.mutation) return
    zap.mutation.mutate({
      amount: data.amount,
      message: data.message,
      pubkey: pubkey.decoded,
    }, {
      onSuccess: (result: { pr: string }) => {
        setInvoice(result.pr)
      },
      onError: (error: any) => {
        setInvoice(undefined)
        console.error('Invoice generation failed:', error)
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          disabled={zap.isLoading || !zap.data?.isEnabled}
        >
          <ZapIcon
            className={cn(
              zap.isLoading && 'bg-accent animate-pulse rounded-md',
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
        {invoice
          ? (
              <div className="relative flex items-center">
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
                  className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                  size="icon"
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(invoice)
                    toast.success('Invoice copied!')
                  }}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
            )
          : (
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={() => (
                      <FormItem>
                        <FormLabel>Amount (sats)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...form.register('amount', { valueAsNumber: true })}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit">
                    Generate Invoice
                  </Button>
                </form>
              </Form>
            )}
      </DialogContent>
    </Dialog>
  )
}
