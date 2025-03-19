export * from './Class.js'
export * from './Annotation.js'
export * from './Flatten.js'
import type { Flatten } from 'mongodb'
import { Class } from './Class.js'
import type { Builtin, DeepPartial } from 'ts-essentials'
import { Annotation } from './Annotation.js'

export function flattenObject<T extends object>(obj: T, prefix?: string) {
  const res = {} as Record<string, any>
  for (const [key, value] of Object.entries(obj)) {
    const prefixedKey = prefix ? `${prefix}.${key}` : key
    switch (typeof value) {
      case 'object':
        Object.assign(res, flattenObject(value, prefixedKey))
        break
      default:
        res[prefixedKey] = value
        break
    }
  }
  return res
}

export function get<T extends object, K extends keyof Flatten<T> & string>(target: T, path: K): Flatten<T>[K] {
  const parts = path.split('.')
  let current = target
  for (const part of parts) {
    current = current[part as keyof T] as any
  }
  return current as Flatten<T>[K]
}

export function deepSet<T extends object>(target: T, value: Partial<T>) {
  for (const [key, v] of Object.entries(value)) {
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      if (!target[key as keyof T]) {
        target[key as keyof T] = {} as any
      }
      deepSet(target[key as keyof T] as object, v)
      continue
    }
    target[key as keyof T] = v as any
  }
}

export function isObject(value: unknown): value is object {
  return (
    value != null && // equality operator checks `undefined` and `null`
    (value.constructor === Object || (!value.constructor && typeof value === 'object'))
  )
}

export function clone<V>(value: V): V {
  switch (typeof value) {
    case 'bigint':
      return BigInt(value) as V
    case 'object': {
      if (Array.isArray(value)) {
        return value.map(clone) as V
      }
      if (isObject(value)) {
        const res = {} as V
        for (const k in value) {
          res[k] = clone(value[k])
        }
        return res
      }
      return value
    }
    default:
      return value
  }
}

export function defaultsDeep<T>(defaults: T, override?: DeepPartial<T>, willClone?: boolean): T {
  if (override === undefined) {
    return willClone ? clone(defaults) : defaults
  }
  switch (typeof defaults) {
    case 'object': {
      if (Array.isArray(defaults)) {
        if (Array.isArray(override)) {
          const arr = willClone ? [] : defaults
          const length = Math.max(defaults.length, override.length)
          for (let i = 0; i < length; i++) {
            arr[i] = defaultsDeep(defaults[i], override[i], willClone)
          }
          return arr as T
        }
        return (willClone ? clone(override) : override) as T
      }
      if (isObject(defaults)) {
        if (isObject(override)) {
          const res = willClone ? ({} as T) : defaults
          const keys = new Set([...Object.keys(defaults), ...Object.keys(override)]) as Set<keyof T>
          for (const key of keys) {
            res[key] = defaultsDeep(defaults[key], override[key as keyof DeepPartial<T>] as any, willClone)
          }
          return res as T
        }
        return (willClone ? clone(override) : override) as T
      }
      return (willClone ? clone(override) : override) as T
    }
    default:
      return (willClone ? clone(override) : override) as T
  }
}

/** TYPES */

export type Unparsable = Builtin | Class
export type MakeReadonly<T> = T extends Map<infer K, infer V>
  ? ReadonlyMap<K, V>
  : T extends Set<infer V>
    ? ReadonlySet<V>
    : T extends [infer Head, ...infer Tail]
      ? readonly [Head, ...Tail]
      : T extends Array<infer V>
        ? readonly V[]
        : T extends Builtin
          ? T
          : Readonly<T>

/**
 * Transforms `any` to `unknown` and keeps other types as is.
 *
 * This is useful for computed types that may break when encountering `any`.
 */
export type AnyFix<T> = 0 extends 1 & T ? unknown : T

/**
 * Checks if a value is an object.
 */
export type IsObject<T> = _IsObject<AnyFix<T>> extends true ? true : false
type _IsObject<T> = T extends any[]
  ? false // if value is an array, it's not an object
  : T extends Builtin
    ? false // if value is a built-in object, it's not an object
    : Annotation.Remove<NonNullable<T>> extends Record<string, any>
      ? true // if value is an object, it's an object
      : false

export * as utils from './index.js'
