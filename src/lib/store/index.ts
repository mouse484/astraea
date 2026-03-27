import type { StoreKey, StoreValue } from './schema'
import { StoreSchemas } from './schema'

export function readStore<K extends StoreKey>(key: K): StoreValue<K> | undefined {
  const value = localStorage.getItem(key)
  if (value === null) {
    return undefined
  }

  try {
    const schema = StoreSchemas[key]
    const parsedJson: unknown = JSON.parse(value)
    const result = schema.safeParse(parsedJson)

    if (!result.success) {
      console.error(result.error)
      return undefined
    }

    return result.data as StoreValue<K>
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export function writeStore<K extends StoreKey>(key: K, value: StoreValue<K>): void {
  const schema = StoreSchemas[key]

  const result = schema.parse(value)

  localStorage.setItem(key, JSON.stringify(result))
}

// function deleteStore<K extends StoreKey>(key: K): void {
//   localStorage.removeItem(key)
// }
