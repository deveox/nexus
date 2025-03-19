import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { describe, it } from 'bun:test'

describe('TString', () => {
  const schema = r.string()
  const valid = 'hello'
  const invalid = 1
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
  // describe('validation', () => {
  //   it('does not modify the initial object', () => {
  //     const schema2 = schema.length(3)
  //     expect(schema2).not.equal(schema)
  //     expect(schema2).to.be.instanceOf(TString)
  //     const invalid = '1234'

  //     expect(() => schema2.deserialize('db', invalid)).to.throw()
  //     expect(() => schema2.serialize('db', invalid)).to.throw()
  //     expect(() => schema2.deserialize('json', invalid)).to.throw()
  //     expect(() => schema2.serialize('json', invalid)).to.throw()
  //     expect(() => schema2.parse(invalid)).to.throw()

  //     expect(() => schema.deserialize('db', invalid)).not.to.throw()
  //     expect(() => schema.serialize('db', invalid)).not.to.throw()
  //     expect(() => schema.deserialize('json', invalid)).not.to.throw()
  //     expect(() => schema.serialize('json', invalid)).not.to.throw()
  //     expect(() => schema.parse(invalid)).not.to.throw()
  //   })
  // })
})
