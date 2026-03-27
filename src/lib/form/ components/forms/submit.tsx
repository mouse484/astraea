import type { PropsWithChildren } from 'react'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Spinner } from '@/shadcn-ui/components/ui/spinner'
import { useFormContext } from '../..'

type Props = PropsWithChildren & Parameters<typeof Button>[0]

export default function Submit({ children, ...properties }: Props) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={state => [state.canSubmit, state.isDirty, state.isSubmitting]}>
      {([canSubmit, isDirty, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit || !isDirty || isSubmitting} {...properties}>
          {isSubmitting ? <Spinner /> : children}
        </Button>
      )}
    </form.Subscribe>
  )
}
