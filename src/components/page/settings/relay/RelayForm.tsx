import { Schema } from 'effect'
import { useAppForm } from '@/lib/form'
import { RelayUrlSchema } from '@/lib/nostr/schemas/common'

const FormSchema = Schema.standardSchemaV1(
  Schema.Struct({
    relay: RelayUrlSchema,
  }),
)

interface RelayFormProps {
  onAddRelay: (url: string) => void
}

export function RelayForm({ onAddRelay }: RelayFormProps) {
  const form = useAppForm({
    validators: {
      onChange: FormSchema,
    },
    defaultValues: {
      relay: '',
    },
    onSubmit: ({ value, formApi }) => {
      onAddRelay(value.relay)
      formApi.reset()
    },
  })

  return (
    <form.AppForm>
      <form.Root>
        <form.AppField name="relay">
          {field => (
            <field.InputField
              label="Relay"
              placeholder="wss://relay.example.com"
              type="url"
            />
          )}
        </form.AppField>
        <form.Submit>
          Add
        </form.Submit>
      </form.Root>
    </form.AppForm>
  )
}
