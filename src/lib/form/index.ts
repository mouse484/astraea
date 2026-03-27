import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import InputField from './ components/fields/input'
import Root from './ components/forms/root'
import Submit from './ components/forms/submit'

export const {
  fieldContext,
  formContext,
  useFormContext,
  useFieldContext,
} = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  formComponents: {
    Root,
    Submit,
  },
  fieldComponents: {
    InputField,
  },
})
