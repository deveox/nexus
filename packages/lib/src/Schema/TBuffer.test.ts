import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TBuffer', () => {
  const s = r.buffer()
  const buffer = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])
  const invalid = '1s'
  describe('json', () => {
    const json = { data: buffer.toString('base64'), enc: 'base64' }
    it('deserialization', () => {
      const actual = s.deserialize('json', json)
      expect(actual).to.be.instanceOf(Buffer)
      expect(actual.toString()).to.equal(buffer.toString())
      expect(() => s.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(s.serialize('json', buffer)).to.deep.equal(json)
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      const actual = s.deserialize('db', buffer)
      expect(actual).to.be.instanceOf(Buffer)
      expect(actual.toString()).to.equal(buffer.toString())
      expect(() => s.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      const actual = s.serialize('db', buffer)
      expect(actual).to.be.instanceOf(Buffer)
      expect(actual.toString()).to.equal(buffer.toString())
    })
  })
})
