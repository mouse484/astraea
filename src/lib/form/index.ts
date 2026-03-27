import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import InputField from './ components/fields/input'
import Root from './ components/forms/root'
import Submit from './ components/forms/submit'

const {
  fieldContext,
  formContext,
  useFormContext,
  useFieldContext,
} = createFormHookContexts()

const { useAppForm } = createFormHook({
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

export {
  useAppForm,
  useFieldContext,
  useFormContext,
}
