import { r } from '@/Schema/r.js'
import { expect } from 'chai'
import { DateTime } from 'luxon'
import { describe, it } from 'bun:test'

describe('EScoped', () => {
  const obj = r.object({
    readonly: r.string().scope('read'),
    readCreate: r.string().scope('read', 'create'),
    readUpdate: r.string().scope('read', 'update'),
    createonly: r.string().scope('create'),
    updateonly: r.string().scope('update'),
    createUpdate: r.string().scope('create', 'update'),
  })
  const obj1 = obj.extend({
    array: r.array(obj).optional(),
    nested: obj,
  })
  const schema = obj.extend({
    nested: obj1,
  })
  const validObj = {
    readonly: 'read',
    readCreate: 'read',
    readUpdate: 'read',
    createonly: 'create',
    updateonly: 'update',
    createUpdate: 'create',
  }
  const valid = {
    ...validObj,
    nested: {
      ...validObj,
      nested: validObj,
      array: [validObj],
    },
  }

  it('create operation', () => {
    const primitive = {
      readCreate: valid.readCreate,
      createonly: valid.createonly,
      createUpdate: valid.createUpdate,
    }
    const expected = {
      ...primitive,
      nested: {
        ...primitive,
        array: [primitive],
        nested: primitive,
      },
    }
    const actual = schema.deserialize('json', 'create', valid)
    expect(actual).to.deep.equal(expected)
    const actual2 = schema.serialize('json', 'create', actual)
    expect(actual2).to.deep.equal(expected)
  })
  it('update operation', () => {
    const primitive = {
      readUpdate: valid.readUpdate,
      updateonly: valid.updateonly,
      createUpdate: valid.createUpdate,
    }
    const expected = {
      ...primitive,
      nested: {
        ...primitive,
        array: [primitive],
        nested: primitive,
      },
    }
    const actual = schema.deserialize('json', 'update', valid)
    expect(actual).to.deep.equal(expected)
    const actual2 = schema.serialize('json', 'update', actual)
    expect(actual2).to.deep.equal(expected)
  })
  it('read operation', () => {
    const primitive = {
      readUpdate: valid.readUpdate,
      readCreate: valid.readCreate,
      readonly: valid.readonly,
    }
    const expected = {
      ...primitive,
      nested: {
        ...primitive,
        array: [primitive],
        nested: primitive,
      },
    }
    const actual = schema.deserialize('json', 'read', valid)
    expect(actual).to.deep.equal(expected)
    const actual2 = schema.serialize('json', 'read', actual)
    expect(actual2).to.deep.equal(expected)
  })
  it("doesn't deconstruct when removing scope", () => {
    const schema = r.date().scope('read')
    const actual = schema.deserialize('json', 'read', DateTime.now().toISO())
    expect(actual).to.be.instanceOf(DateTime)
  })
  it('returns proper type when exclusion happens on first level', () => {
    const schema = r.string().scope('read')
    const actual = schema.deserialize('json', 'create', 'test')
    expect(actual).to.equal(undefined)
  })
})
