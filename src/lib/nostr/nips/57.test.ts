import { describe, expect, it } from 'vitest'
import { getLightningPayEndpoint } from './57'

// eslint-disable-next-line style/max-len
const LUD06 = 'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhk6mm4wdjs769pa9'
const LUD16 = 'mouse@walletofsatoshi.com'
const EXPECTED_URL = 'https://walletofsatoshi.com/.well-known/lnurlp/mouse'

describe('getLightningPayEndpoint', () => {
  describe('valid cases', () => {
    it('converts lud16 to LNURL-pay endpoint', () => {
      const metadata = { lud16: LUD16 }
      const result = getLightningPayEndpoint(metadata)
      expect(result?.href).toBe(EXPECTED_URL)
    })

    it('handles lud16 with subdomain', () => {
      const metadata = { lud16: 'user@pay.example.com' }
      const result = getLightningPayEndpoint(metadata)
      expect(result?.href).toBe('https://pay.example.com/.well-known/lnurlp/user')
    })

    it('handles lud16 with username containing allowed characters', () => {
      const metadata = { lud16: 'user-name_123@example.com' }
      const result = getLightningPayEndpoint(metadata)
      expect(result?.href).toBe('https://example.com/.well-known/lnurlp/user-name_123')
    })

    it('prefers lud16 over lud06 when both are present', () => {
      const metadata = {
        lud06: LUD06,
        lud16: LUD16,
      }
      const result = getLightningPayEndpoint(metadata)
      expect(result?.href).toBe(EXPECTED_URL)
    })

    it('returns decoded URL when only lud06 is present', () => {
      const metadata = { lud06: LUD06 }
      const result = getLightningPayEndpoint(metadata)
      expect(result?.href).toBe(EXPECTED_URL)
    })

    it('falls back to lud06 when lud16 is malformed', () => {
      const metadata = {
        lud06: LUD06,
        lud16: 'invalid-address',
      }
      const result = getLightningPayEndpoint(metadata)
      expect(result?.href).toBe(EXPECTED_URL)
    })
  })

  describe('error cases', () => {
    it('returns undefined when neither lud06 nor lud16 are present', () => {
      const metadata = {}
      expect(getLightningPayEndpoint(metadata)).toBeUndefined()
    })

    it('returns undefined when lud16 is malformed (no @)', () => {
      const metadata = { lud16: 'invalid-address' }
      expect(getLightningPayEndpoint(metadata)).toBeUndefined()
    })

    it('returns undefined when lud16 has empty username', () => {
      const metadata = { lud16: '@example.com' }
      expect(getLightningPayEndpoint(metadata)).toBeUndefined()
    })

    it('returns undefined when lud16 has empty domain', () => {
      const metadata = { lud16: 'user@' }
      expect(getLightningPayEndpoint(metadata)).toBeUndefined()
    })

    it('returns undefined when both are empty strings', () => {
      const metadata = { lud06: '', lud16: '' }
      expect(getLightningPayEndpoint(metadata)).toBeUndefined()
    })
  })
})
