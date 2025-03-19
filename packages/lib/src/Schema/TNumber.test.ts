import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TNumber', () => {
  const schema = r.number()
  const valid = 111
  const invalid = '1'
  describe('json', () => {
    it('deserialization', () => {
      expect(schema.deserialize('json', valid)).to.equal(valid)
      expect(() => schema.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('json', valid)).to.equal(valid)
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      expect(schema.deserialize('db', valid)).to.equal(valid)
      expect(() => schema.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('db', valid)).to.equal(valid)
    })
  })
  describe('validation', () => {
    it('does not modify the initial object', () => {
      const schema2 = schema.max(3).optional()
      expect(schema2).not.equal(schema)
      expect(() => schema2.deserialize('db', 4)).to.throw()
      expect(() => schema2.parse(4)).to.throw()
      expect(() => schema.deserialize('db', 4)).not.to.throw()
      schema.parse(4)
      expect(() => schema.parse(4)).not.to.throw()
    })
  })
})
