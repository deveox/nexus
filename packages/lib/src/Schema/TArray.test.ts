import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TArray', () => {
  const s = r.array(
    r.object({
      name: r.string(),
      age: r.string(),
      strings: r.array(r.string()),
    })
  )
  const valid = [
    {
      name: 'hello',
      age: 'world',
      strings: ['hello', 'world'],
    },
    {
      name: 'hello1',
      age: 'world2',
      strings: ['hello1', 'world2'],
    },
  ]
  const invalid = [
    {
      name: 'hello',
      age: 'world',
      strings: ['hello', 'world'],
    },
    {
      name: 'hello',
    },
  ]
  describe('json', () => {
    it('deserialization', () => {
      expect(s.deserialize('json', valid)).to.deep.equal(valid)
      expect(() => s.deserialize('json', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(s.serialize('json', valid)).to.deep.equal(valid)
      // @ts-expect-error
      expect(() => s.serialize('json', invalid)).to.throw()
    })
  })
  describe('db', () => {
    it('deserialization', () => {
      expect(s.deserialize('db', valid)).to.deep.equal(valid)
      expect(() => s.deserialize('db', invalid)).to.throw()
    })
    it('serialization', () => {
      expect(s.serialize('db', valid)).to.deep.equal(valid)
      // @ts-expect-error
      expect(() => s.serialize('db', invalid)).to.throw()
    })
  })
})
