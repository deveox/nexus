import { r } from '@/Schema/r.js'
import type { TUndefined } from '@/Schema/TUndefined.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'
import {} from 'zod'

function test(schema: r.Wrap<TUndefined, 'optional'>, env: 'json' | 'db') {
  const valid = undefined
  const invalid: null = null
  describe(env, () => {
    it('deserialization', () => {
      const actual = schema.deserialize(env, valid)
      expect(actual).to.be.undefined

      expect(() => schema.deserialize(env, invalid)).to.throw()
    })
    it('serialization', () => {
      const actual = schema.serialize(env, valid)
      expect(actual).to.be.undefined
      // @ts-expect-error
      expect(() => schema.serialize(env, invalid)).to.throw()
    })
  })
}

describe('TUndefined', () => {
  const schema = r.optional()

  test(schema, 'json')
  test(schema, 'db')
})
