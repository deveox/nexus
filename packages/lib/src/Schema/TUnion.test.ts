import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TUnion', () => {
  const schema = r.union([r.string(), r.number()])
  const valid = 'hello'
  const valid2 = 111
  const invalid = true
  describe('json', () => {
    it('deserialization', () => {
      expect(schema.deserialize('json', valid)).to.equal(valid)
      expect(schema.deserialize('json', valid2)).to.equal(valid2)
      expect(() => schema.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('json', valid)).to.equal(valid)
      expect(schema.serialize('json', valid2)).to.equal(valid2)
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      expect(schema.deserialize('db', valid)).to.equal(valid)
      expect(schema.deserialize('db', valid2)).to.equal(valid2)
      expect(() => schema.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('db', valid)).to.equal(valid)
      expect(schema.serialize('db', valid2)).to.equal(valid2)
    })
  })
})
