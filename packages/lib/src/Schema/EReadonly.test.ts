import { EReadonly } from '@/Schema/EReadonly.js'
import { r, string } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('EReadonly', () => {
  const schema = r.object({
    name: string(),
    id: new EReadonly(r.string()),
  })
  const valid = {
    name: 'John',
    id: '123',
  }
  const invalid = {
    name: 'John',
    id: 123,
  }
  describe('json', () => {
    it('deserialization', () => {
      const v = schema.deserialize('json', valid)
      expect(v).to.deep.equal(valid)
      // @ts-expect-error should be readonly value
      v.id = '124'
      expect(() => schema.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('json', valid)).to.deep.equal(valid)
      // @ts-expect-error
      expect(() => schema.serialize('json', invalid)).to.throw()
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      expect(schema.deserialize('db', valid)).to.deep.equal(valid)
      expect(() => schema.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(schema.serialize('db', valid)).to.deep.equal(valid)
      // @ts-expect-error
      expect(() => schema.serialize('db', invalid)).to.throw()
    })
  })
})
