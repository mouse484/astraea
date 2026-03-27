import type { ComponentProps } from 'react'
import type { BaseFieldProps } from './_base'
import { Input } from '@/shadcn-ui/components/ui/input'
import BaseField, { extractBaseFieldProps } from './_base'

interface Props extends BaseFieldProps, ComponentProps<'input'> {
  valueAsNumber?: boolean
}

type InferValueType<T> = T extends true ? number : string

export default function InputField({ valueAsNumber, ...properties }: Props) {
  const { baseFieldProps, restProps } = extractBaseFieldProps(properties)

  const isNumber = restProps.type === 'number' || valueAsNumber

  const handleChange = (value: string) => {
    if (isNumber) {
      return Number(value)
    }
    return value
  }

  return (
    <BaseField<InferValueType<typeof isNumber>> {...baseFieldProps}>
      {(field, state) => (
        <Input
          id={field.name}
          aria-invalid={state.isInvalid}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={event => field.handleChange(handleChange(event.target.value))}
          {...restProps}
        />
      )}
    </BaseField>
  )
}
