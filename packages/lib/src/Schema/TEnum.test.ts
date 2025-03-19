import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TEnum', () => {
  enum Test {
    A = 'a',
    B = 'b',
  }
  const schema = r.enm(Test)
  const valid = Test.A
  const invalid = 'c'
  describe('json', () => {
    it('deserialization', () => {
      expect(schema.deserialize('json', valid)).to.equal(valid)
      expect(() => schema.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('json', valid)).to.equal(valid)
      // @ts-expect-error
      expect(() => schema.serialize('json', invalid)).to.throw()
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      expect(schema.deserialize('db', valid)).to.equal(valid)
      expect(() => schema.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('db', valid)).to.equal(valid)
      // @ts-expect-error
      expect(() => schema.serialize('db', invalid)).to.throw()
    })
  })
})
