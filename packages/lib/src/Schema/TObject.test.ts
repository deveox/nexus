import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TObject', () => {
  const schema = r.object({
    name: r.string(),
    lastName: r.string(),
    nested: r.object({
      name: r.string(),
      lastName: r.string().optional(),
    }),
  })
  const valid = {
    name: 'John',
    lastName: 'Doe',
    nested: {
      name: 'John',
    },
  }
  const invalid = {
    name: 'John',
    lastName: 'Doe',
    nested: {},
  }
  describe('json', () => {
    it('deserialization', () => {
      expect(schema.deserialize('json', valid)).to.deep.equal(valid)
      expect(() => schema.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('json', valid)).to.deep.equal(valid)
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      expect(schema.deserialize('db', valid)).to.deep.equal(valid)
      expect(() => schema.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('db', valid)).to.deep.equal(valid)
    })
  })
  describe('unknown keys', () => {
    it('strip', () => {
      const schema = r.object({ name: r.string() })
      const valid = { name: 'John', lastName: 'Doe' }
      const expected = { name: valid.name }
      expect(schema.deserialize('json', valid)).to.deep.equal(expected)
      expect(schema.serialize('json', valid)).to.deep.equal(expected)
      expect(schema.deserialize('db', valid)).to.deep.equal(expected)
      expect(schema.serialize('db', valid)).to.deep.equal(expected)
      expect(schema.parse(valid)).to.deep.equal(expected)
    })
  })
})
