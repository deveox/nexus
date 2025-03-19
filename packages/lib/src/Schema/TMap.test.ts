import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TMap', () => {
  const _invalidTs = r.map(
    // @ts-expect-error
    r.object({
      name: r.string(),
    }),
    r.string()
  )
  const schema = r.map(r.string(), r.string())
  const validSerialized = { key: 'value' }
  const invalidSerialized = { key: 1 }
  const valid = new Map(Object.entries(validSerialized))
  const invalid = new Map(Object.entries(invalidSerialized))

  describe('json', () => {
    it('deserialization', () => {
      const actual = schema.deserialize('json', validSerialized)
      expect(actual).to.be.instanceOf(Map)
      expect(actual.size).to.equal(1)
      expect(actual.get('key')).to.equal('value')

      expect(() => schema.deserialize('json', invalidSerialized)).to.throw()
    })
    it('serialization', () => {
      const actual = schema.serialize('json', valid)
      expect(actual).not.to.be.instanceOf(Map)
      expect(actual).to.deep.equal(validSerialized)
      // @ts-expect-error
      expect(() => schema.serialize('json', invalid)).to.throw()
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      const actual = schema.deserialize('db', validSerialized)
      expect(actual).to.be.instanceOf(Map)
      expect(actual.size).to.equal(1)
      expect(actual.get('key')).to.equal('value')

      expect(() => schema.deserialize('db', invalidSerialized)).to.throw()
    })
    it('serialization', () => {
      const actual = schema.serialize('db', valid)
      expect(actual).not.to.be.instanceOf(Map)
      expect(actual).to.deep.equal(validSerialized)
      // @ts-expect-error
      expect(() => schema.serialize('db', invalid)).to.throw()
    })
  })
})
