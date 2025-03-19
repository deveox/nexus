import { r } from '@/Schema/r.js'
import {} from '@/Schema/TDate.js'
import { expect } from 'chai'
import { DateTime } from 'luxon'
import { describe, it } from 'bun:test'

describe('TDate', () => {
  const schema = r.date()
  const valid = DateTime.now()
  describe('json', () => {
    const validJson = valid.toISO()
    it('deserialization', () => {
      const actual = schema.deserialize('json', validJson)
      expect(actual).to.be.instanceOf(DateTime)
      expect(actual.toISO()).to.equal(validJson)
      const invalid = 'invalid'

      expect(() => schema.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      const actual = schema.serialize('json', valid)
      expect(actual).to.equal(validJson)
      const invalid = DateTime.fromObject({ month: 6, day: 400 })
      // @ts-expect-error
      expect(() => schema.serialize('json', invalid)).to.throw()
    })
  })
  describe('db', () => {
    const validDb = valid.toJSDate()
    it('deserialization', () => {
      const actual = schema.deserialize('db', validDb)
      expect(actual).to.be.instanceOf(DateTime)
      expect(actual.toISO()).to.equal(valid.toISO())
      const invalid = DateTime.fromObject({ month: 6, day: 400 }).toJSDate()
      expect(() => schema.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      const actual = schema.serialize('db', valid)
      expect(actual).to.be.instanceOf(Date)
      expect(actual.toISOString()).to.equal(validDb.toISOString())
      const invalid = DateTime.fromObject({ month: 6, day: 400 })
      // @ts-expect-error
      expect(() => schema.serialize('db', invalid)).to.throw()
    })
  })
})
