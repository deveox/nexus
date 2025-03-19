import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'
import { ObjectId } from 'bson'

describe('TObjectId', () => {
  const s = r.objectId()
  const value = new ObjectId()
  const invalid = '1s'
  describe('json', () => {
    const json = value.toString()
    it('deserialization', () => {
      const actual = s.deserialize('json', json)
      expect(actual).to.be.instanceOf(ObjectId)
      expect(actual.toString()).to.equal(json)
      expect(() => s.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(s.serialize('json', value)).to.deep.equal(json)
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      const actual = s.deserialize('db', value)
      expect(actual).to.be.instanceOf(ObjectId)
      expect(actual.toString()).to.equal(value.toString())
      expect(() => s.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      const actual = s.serialize('db', value)
      expect(actual).to.be.instanceOf(ObjectId)
      expect(actual.toString()).to.equal(value.toString())
    })
  })
})
