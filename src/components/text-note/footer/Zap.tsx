import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useQuery } from '@tanstack/react-query'
import { Schema } from 'effect'
import { Zap as ZapIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
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
        console.warn('Invoice generated:', result)
        // 必要ならここでUI更新や通知
      },
      onError: (error: any) => {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Zap</DialogTitle>
          <DialogDescription className="sr-only">
            Custom amount and messages.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (sats)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
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
      </DialogContent>
    </Dialog>
  )
}
