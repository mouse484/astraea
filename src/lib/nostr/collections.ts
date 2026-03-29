import type { QueryClient } from '@tanstack/query-core'
import type z from 'zod'
import { BasicIndex, createCollection } from '@tanstack/db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { TextNoteEventSchema } from './kinds/1'

function createNostrCollection<
  Schema extends z.ZodObject<{ id: z.ZodString }>,
>({
  queryClient,
  queryKey,
  schema,
}: {
  queryClient: QueryClient
  queryKey: string[]
  schema: Schema
}) {
  const collection = createCollection(
    queryCollectionOptions({
      queryClient,
      queryKey: ['nostr', ...queryKey],
      schema,
      queryFn: () => {
        return []
      },
      getKey: item => item.id,
      defaultIndexType: BasicIndex,
      autoIndex: 'eager',
    }),
  )
  collection.startSyncImmediate()
  return collection
}

export function createNostrCollections(queryClient: QueryClient) {
  return {
    textNote: createNostrCollection({
      queryClient,
      queryKey: ['textNote'],
      schema: TextNoteEventSchema,
    }),
  } as const
}

export function getCollectionByKind(collections: ReturnType<typeof createNostrCollections>, kind: number) {
  switch (kind) {
    case 1: {
      return collections.textNote
    }
  }
}
