import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('EDefault', () => {
  const defaults = {
    name: 'John',
    nested: {
      name: 'Aaron',
      lastName: 'Doe',
    },
  }
  const obj = r.object({
    name: r.string(),
    lastName: r.string().default(defaults.nested.lastName),
  })
  const schema = r.object({
    name: r.string(),
    nested: obj.default({ name: defaults.nested.name }),
  })
  const valid = {
    name: 'Aaron',
    nested: {
      name: 'Aaron',
      lastName: 'Smith',
    },
  }
  const validEmpty = {
    name: defaults.name,
  }
  const invalid = {
    nested: {
      lastName: 'Smith',
    },
  }
  describe('json', () => {
    it('deserialization', () => {
      expect(schema.deserialize('json', valid)).to.deep.equal(valid)
      const actual = schema.deserialize('json', validEmpty)
      expect(actual).to.deep.equal(defaults)
      defaults.nested.name = 'John'
      expect(actual.nested.name).to.not.equal('John', 'default value should be copied')
      defaults.nested.name = 'Aaron'
      expect(() => schema.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('json', valid)).to.deep.equal(valid)
      // @ts-expect-error
      expect(schema.serialize('json', validEmpty)).to.deep.equal(defaults)
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      expect(schema.deserialize('db', valid)).to.deep.equal(valid)
      expect(schema.deserialize('db', validEmpty)).to.deep.equal(defaults)
      expect(() => schema.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('db', valid)).to.deep.equal(valid)
      // @ts-expect-error
      expect(schema.serialize('db', validEmpty)).to.deep.equal(defaults)
    })
  })
})
