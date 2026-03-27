import { useForm } from '@tanstack/react-form'
import { Schema } from 'effect'
import { RelayUrlSchema } from '@/lib/nostr/schemas/common'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Input } from '@/shadcn-ui/components/ui/input'
import { Label } from '@/shadcn-ui/components/ui/label'

const relaySchema = Schema.standardSchemaV1(RelayUrlSchema)

interface RelayFormProps {
  onAddRelay: (url: string) => void
}

export function RelayForm({ onAddRelay }: RelayFormProps) {
  const form = useForm({
    defaultValues: {
      relay: '',
    },
    onSubmit: async ({ value, formApi }) => {
      onAddRelay(value.relay)
      formApi.reset()
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(event_) => {
        event_.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="relay"
        validators={{ onChange: relaySchema }}
      >
        {field => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>Relay</Label>
            <Input
              id={field.name}
              placeholder="wss://relay.example.com"
              type="url"
              value={field.state.value}
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
      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            className="ml-2"
            type="submit"
            disabled={!canSubmit || isSubmitting}
          >
            Create
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
