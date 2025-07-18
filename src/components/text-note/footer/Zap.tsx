import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useQuery } from '@tanstack/react-query'
import { Schema } from 'effect'
import { Zap as ZapIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { metadataQuery } from '@/lib/nostr/kinds/0'
import { createPubkey } from '@/lib/nostr/nip19'
import { getLightningPayEndpoint } from '@/lib/nostr/nips/57'
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

  const { isEnabled, endpoint: _endpoint } = useMemo(() => {
    if (!metadata?.content) {
      return {
        isEnabled: false,
        endpoint: undefined,
      }
    }

    const lightningEndpoint = getLightningPayEndpoint(metadata.content)
    const hasLightningAddress = Boolean(metadata.content.lud16 || metadata.content.lud06)

    if (!hasLightningAddress || !lightningEndpoint) {
      return {
        isEnabled: false,
        endpoint: undefined,
      }
    }

    return {
      isEnabled: true,
      endpoint: lightningEndpoint,
    }
  }, [metadata])

  const onSubmit = (data: ZapFormData) => {
    // TODO: Implement invoice generation
    console.warn('Generating invoice for:', data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          disabled={!isEnabled}
        >
          <ZapIcon />
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
