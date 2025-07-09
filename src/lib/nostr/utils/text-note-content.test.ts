import { describe, expect, it } from 'vitest'
import { createEvent } from '../nip19'
import { parseTextNoteContent } from './text-note-content'

// eslint-disable-next-line style/max-len
const SAMPLE_NEVENT = 'nevent1qqst8cujky046negxgwwm5ynqwn53t8aqjr6afd8g59nfqwxpdhylpcpzamhxue69uhhyetvv9ujuetcv9khqmr99e3k7mg8arnc9'
const SAMPLE_NEVENT_RESULT = createEvent(SAMPLE_NEVENT)

describe('simple-content', () => {
  it('1-line', () => {
    const text = 'Hello, world!'
    const nodes = parseTextNoteContent(text)
    expect(nodes).toEqual([
      {
        type: 'text',
        value: text,
      },
    ])
  })
  it('2-lines', () => {
    const text = 'Hello, world!\nThis is a test.'
    const nodes = parseTextNoteContent(text)
    expect(nodes).toEqual([
      {
        type: 'text',
        value: 'Hello, world!',
      },
      {
        type: 'text',
        value: 'This is a test.',
      },
    ])
  })
})

describe('nostr-event', () => {
  it('1-line', () => {
    const text = `nostr:${SAMPLE_NEVENT}`
    const nodes = parseTextNoteContent(text)
    expect(nodes).toEqual([
      {
        type: 'nevent',
        value: SAMPLE_NEVENT_RESULT,
      },
    ])
  })
})

describe('mixed-content', () => {
  it('text event', () => {
    const text = `Hello, world! nostr:${SAMPLE_NEVENT}`
    const nodes = parseTextNoteContent(text)
    expect(nodes).toEqual([
      {
        type: 'text',
        value: 'Hello, world!',
      },
      {
        type: 'nevent',
        value: SAMPLE_NEVENT_RESULT,
      },
    ])
  })

  it('text event text', () => {
    const text = `Hello, nostr:${SAMPLE_NEVENT} world!`
    const nodes = parseTextNoteContent(text)
    expect(nodes).toEqual([
      {
        type: 'text',
        value: 'Hello,',
      },
      {
        type: 'nevent',
        value: SAMPLE_NEVENT_RESULT,
      },
      {
        type: 'text',
        value: 'world!',
      },
    ])
  })
})
