import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TSet', () => {
  const schema = r.set(r.string())
  const raw = ['value', 'value']
  const expected = new Set(raw)
  const invalid = [1, 1]

  describe('json', () => {
    it('deserialization', () => {
      const actual = schema.deserialize('json', raw)
      expect(actual).to.be.instanceOf(Set)
      expect(actual.size).to.equal(1)
      expect(actual.has('value')).to.equal(true)

      expect(() => schema.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      const actual = schema.serialize('json', expected)
      expect(actual).to.deep.equal(['value'])
      expect(actual).not.to.be.instanceOf(Set)
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      const actual = schema.deserialize('db', raw)
      expect(actual).to.be.instanceOf(Set)
      expect(actual.size).to.equal(1)
      expect(actual.has('value')).to.equal(true)

      expect(() => schema.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      const actual = schema.serialize('db', expected)
      expect(actual).to.deep.equal(['value'])
      expect(actual).not.to.be.instanceOf(Set)
    })
  })
  // describe('validation', () => {
  //   it('does not modify the initial object', () => {
  //     const schema2 = schema.size(3)
  //     expect(schema2).not.equal(schema)
  //     const invalid = new Set(['1'])
  //     const invalidJSON = Array.from(invalid)
  //     expect(() => schema2.deserialize('json', invalidJSON)).to.throw()
  //     expect(() => schema2.serialize('json', invalid)).to.throw()
  //     expect(() => schema2.deserialize('db', invalidJSON)).to.throw()
  //     expect(() => schema2.serialize('db', invalid)).to.throw()
  //     expect(() => schema2.parse(invalid)).to.throw()
  //     expect(() => schema.deserialize('json', invalidJSON)).not.to.throw()
  //     expect(() => schema.serialize('json', invalid)).not.to.throw()
  //     expect(() => schema.deserialize('db', invalidJSON)).not.to.throw()
  //     expect(() => schema.serialize('db', invalid)).not.to.throw()
  //     expect(() => schema.parse(invalid)).not.to.throw()
  //   })
  // })
})
