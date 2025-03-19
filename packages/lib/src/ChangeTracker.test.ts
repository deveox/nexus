import { ChangeTracker } from '@/ChangeTracker.js'
import { expect } from 'chai'
import { beforeEach, describe, it } from 'bun:test'

describe('ChangeTracker', () => {
  const tracker = new ChangeTracker()
  beforeEach(() => {
    tracker.clear()
  })
  it('should track changes', () => {
    const obj = tracker.track({ a: 1, b: 2 })
    obj.a = 3
    expect(tracker.changes).to.deep.equal({
      a: {
        oldValue: 1,
        newValue: 3,
      },
    })
  })
  it('should track changes in nested objects', () => {
    const obj = tracker.track({ a: { b: 1, c: 2 } })
    obj.a.b = 3
    expect(tracker.changes).to.deep.equal({
      'a.b': {
        oldValue: 1,
        newValue: 3,
      },
    })
  })

  it('should track changes in nested arrays', () => {
    const obj = tracker.track({ a: [1, 2, 3] })
    obj.a[1] = 4
    expect(tracker.changes).to.deep.equal({
      'a.1': {
        oldValue: 2,
        newValue: 4,
      },
    })
  })
  it('should track changes in nested objects and arrays', () => {
    const obj = tracker.track({ a: { b: [{ name: 'John' }, { name: 'Jane' }] } })
    obj.a.b[0].name = 'Aaron'
    expect(tracker.changes).to.deep.equal({
      'a.b.0.name': {
        oldValue: 'John',
        newValue: 'Aaron',
      },
    })
  })
  it('should not track changes if the value is the same', () => {
    const obj = tracker.track({ a: 1 })
    obj.a = 1
    expect(tracker.changes).to.deep.equal({})
  })
  describe('should work with Array methods', () => {
    let obj = tracker.track({ arr: [1, 2, 3] })
    beforeEach(() => {
      tracker.clear()
      obj = tracker.track({ arr: [1, 2, 3] })
    })
    it('push', () => {
      obj.arr.push(4)
      expect(tracker.changes).to.deep.equal({
        'arr.3': {
          oldValue: undefined,
          newValue: 4,
        },
      })
    })
    it('pop', () => {
      obj.arr.pop()
      expect(tracker.changes).to.deep.equal({
        arr: {
          oldValue: [1, 2, 3],
          newValue: [1, 2],
        },
      })
    })
    it('shift', () => {
      obj.arr.shift()
      expect(tracker.changes).to.deep.equal({
        arr: {
          oldValue: [1, 2, 3],
          newValue: [2, 3],
        },
      })
    })
    it('unshift', () => {
      obj.arr.unshift(0)
      expect(tracker.changes).to.deep.equal({
        arr: {
          oldValue: [1, 2, 3],
          newValue: [0, 1, 2, 3],
        },
      })
    })
    it('splice', () => {
      obj.arr.splice(1, 1)
      expect(tracker.changes).to.deep.equal({
        arr: {
          oldValue: [1, 2, 3],
          newValue: [1, 3],
        },
      })
    })
    it('sort', () => {
      obj.arr.sort((a, b) => b - a)
      expect(tracker.changes).to.deep.equal({
        arr: {
          oldValue: [1, 2, 3],
          newValue: [3, 2, 1],
        },
      })
    })
    it('reverse', () => {
      obj.arr.reverse()
      expect(tracker.changes).to.deep.equal({
        arr: {
          oldValue: [1, 2, 3],
          newValue: [3, 2, 1],
        },
      })
    })
    it('fill', () => {
      obj.arr.fill(0)
      expect(tracker.changes).to.deep.equal({
        arr: {
          oldValue: [1, 2, 3],
          newValue: [0, 0, 0],
        },
      })
    })
  })
})
