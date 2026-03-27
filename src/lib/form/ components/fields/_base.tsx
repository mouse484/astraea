import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/shadcn-ui/components/ui/field'
import { cn } from '@/shadcn-ui/utils'
import { useFieldContext } from '../../'

export interface BaseFieldProps {
  label: ReactNode
  icon?: LucideIcon
  iconClassName?: string
  description?: string
  wrap?: (children: ReactNode) => ReactNode
}

// eslint-disable-next-line react-refresh/only-export-components
export function extractBaseFieldProps<T extends BaseFieldProps>(properties: T) {
  const { label, icon, iconClassName, description, wrap, ...rest } = properties
  return {
    baseFieldProps: {
      label,
      icon,
      iconClassName,
      description,
      wrap,
    } satisfies BaseFieldProps,
    restProps: rest as Omit<T, keyof BaseFieldProps>,
  }
}

interface Props<T> extends BaseFieldProps {
  children: (
    field: ReturnType<typeof useFieldContext<T>>,
    state: {
      isInvalid: boolean
    },
  ) => React.ReactNode
  required?: boolean
  group?: boolean
}

export default function BaseField<T = string>({
  icon: Icon,
  children,
  label,
  description,
  iconClassName,
  required,
  group = false,
  wrap,
}: Props<T>) {
  const field = useFieldContext<T>()

  const isInvalid = !field.state.meta.isValid

  const Root = group ? FieldSet : Field
  const Label = group ? FieldLegend : FieldLabel
  const Content = group ? FieldGroup : 'div'

  const rendered = children(field, { isInvalid })

  return (
    <Root>
      <Label htmlFor={field.name}>
        {Icon && <Icon className={cn('mr-1 size-4', iconClassName)} />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {description !== undefined && <FieldDescription>{description}</FieldDescription>}
      <Content>
        {wrap ? wrap(rendered) : rendered}
      </Content>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Root>
  )
}
