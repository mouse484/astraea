import * as z from 'zod'
import { useAppForm } from '@/lib/form'
import { RelayUrlSchema } from '@/lib/nostr/schemas/common'

const FormSchema = z.object({
  relay: RelayUrlSchema,
})

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
        <div className="flex items-end gap-2">
          <form.AppField name="relay">
            {field => (
              <field.InputField
                label="Relay"
                placeholder="wss://relay.example.com"
                type="url"
              />
            )}
          </form.AppField>
          <form.Submit className="w-25" checkDirty>
            Add
          </form.Submit>
        </div>
      </form.Root>
    </form.AppForm>
  )
}
