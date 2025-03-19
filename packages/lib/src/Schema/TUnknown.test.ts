import { r } from '@/Schema/r.js'
import type { TUnknown } from '@/Schema/TUnknown.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'
import {} from 'zod'

function test(schema: r.Wrap<TUnknown>, env: 'json' | 'db') {
  const valid = {
    key: 'value',
    nested: {
      key: 1,
    },
  }
  describe(env, () => {
    it('deserialization', () => {
      const actual = schema.deserialize(env, valid)
      expect(actual).to.equal(valid)
      expect(actual).to.deep.equal(valid)
    })
    it('serialization', () => {
      const actual = schema.serialize(env, valid)
      expect(actual).to.equal(valid)
      expect(actual).to.deep.equal(valid)
    })
  })
}

describe('TUnknown', () => {
  const schema = r.unknown()

  test(schema, 'json')
  test(schema, 'db')
})
