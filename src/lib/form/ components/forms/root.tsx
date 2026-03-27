import type { PropsWithChildren } from 'react'
import { FieldGroup } from '@/shadcn-ui/components/ui/field'
import { useFormContext } from '../..'

interface Props extends PropsWithChildren {}

export default function Root({ children }: Props) {
  const form = useFormContext()
  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      void form.handleSubmit()
    }}
    >
      <FieldGroup>
        {children}
      </FieldGroup>
    </form>
  )
}
