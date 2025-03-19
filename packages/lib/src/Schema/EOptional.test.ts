import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { DateTime } from 'luxon'
import { describe, it } from 'bun:test'

describe('EOptional', () => {
  const schema = r.object({
    createdAt: r.date(),
    updatedAt: r.date().optional(),
  })
  const valid = {
    createdAt: DateTime.now(),
  }
  const invalid = {
    updatedAt: DateTime.now(),
  }
  describe('json', () => {
    const validJson = {
      createdAt: valid.createdAt.toISO(),
    }
    it('deserialization', () => {
      expect(schema.deserialize('json', validJson)).to.deep.equal(valid)
      const invalidJson = {
        updatedAt: invalid.updatedAt.toISO(),
      }
      expect(() => schema.deserialize('json', invalidJson)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('json', valid)).to.deep.equal(validJson)
      // @ts-expect-error
      expect(() => schema.serialize('json', invalid)).to.throw()
    })
  })
  describe('db', () => {
    const validDb = {
      createdAt: valid.createdAt.toJSDate(),
    }
    it('deserialization', () => {
      try {
        expect(schema.deserialize('db', validDb)).to.deep.equal(valid)
        const invalidDb = {
          updatedAt: invalid.updatedAt.toJSDate(),
        }
        expect(() => schema.deserialize('db', invalidDb)).to.throw()
      } catch (e) {
        console.log(e)
      }
    })
    it('serialization', () => {
      expect(schema.serialize('db', valid)).to.deep.equal(validDb)
      // @ts-expect-error
      expect(() => schema.serialize('db', invalid)).to.throw()
    })
  })
})
