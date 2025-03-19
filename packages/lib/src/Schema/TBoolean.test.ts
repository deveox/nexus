import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('Bool', () => {
  const s = r.boolean()
  const valid = true
  const invalid = 1
  describe('json', () => {
    it('deserialization', () => {
      expect(s.deserialize('json', valid)).to.equal(valid)
      expect(() => s.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(s.serialize('json', valid)).to.equal(valid)
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      expect(s.deserialize('db', valid)).to.equal(valid)
      expect(() => s.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(s.serialize('db', valid)).to.equal(valid)
    })
  })
})
