import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TRecord', () => {
  const schema = r.record(r.string(), r.string())
  const valid = { key: 'value' }
  const invalid = { [Symbol('key')]: 'value' }

  describe('json', () => {
    it('deserialization', () => {
      expect(schema.deserialize('json', valid)).to.deep.equal(valid)
      expect(schema.deserialize('json', invalid)).to.deep.equal({})
    })
    it('serialization', () => {
      expect(schema.serialize('json', valid)).to.deep.equal(valid)
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      expect(schema.deserialize('db', valid)).to.deep.equal(valid)
      expect(schema.deserialize('db', invalid)).to.deep.equal({})
    })
    it('serialization', () => {
      expect(schema.serialize('db', valid)).to.deep.equal(valid)
    })
  })
})
