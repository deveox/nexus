import type { z } from 'zod'
import { AnyFix, IsObject } from './index.js'

/**
 * Gets value types of an object as union
 * @reflection false
 */
export type ValueOf<T> = T[keyof T]

// /**
//  * Helper type for Flatten. Represents a key-value pair in the
//  * flattened object
//  *
//  * @reflection false
//  */
// interface Path<P extends string, T> {
//   Path: P
//   Value: T
// }

/**
 * The helper type for Flatten. It recursively iterates over the keys
 * of an object
 *
 * @reflection false
 */
type _Flatten<T, V, Key extends string> = V & {
  [K in keyof T & string as Key extends '' ? never : `${Key}.${K}`]: T[K]
} & ValueOf<{
    [K in keyof T & string as 0 extends 1 & T[K]
      ? never // if value is never, skip it
      : T[K] extends any[]
        ? never // if value is an array, skip it
        : string extends keyof T[K]
          ? never // if value has index signature, skip it
          : T[K] extends Record<string, any>
            ? K
            : never]: _Flatten<T[K], V, Key extends '' ? K : `${Key}.${K}`>
  }>

/**
 * Flattens an object type by concatenating keys with a dot. Format
 * of resulting object is compatible with MongoDB queries.
 *
 * @reflection false
 */
export type Flatten<T> = AnyFix<T> extends unknown
  ? {
      [key: string]: unknown
    }
  : z.objectUtil.flatten<{
      // unwrap union of Path
      [P in Flatten.Keys<T>]: Flatten.Value<T, P>
    }>

export namespace Flatten {
  export type Paths<T, Key extends string[]> = IsObject<T> extends true
    ? string extends keyof NonNullable<T>
      ? Key
      :
          | ValueOf<{
              [K in keyof NonNullable<T> & string]: Paths<NonNullable<T>[K], [...Key, K]>
            }>
          | Key
    : Key

  type _Key<T extends string[], D extends string = ''> = T extends [infer First, ...infer Rest]
    ? First extends string
      ? Rest extends string[]
        ? _Key<Rest, `${D extends '' ? '' : `${D}.`}${First}`>
        : D
      : D
    : D

  type Key<T extends string[]> = T extends [] ? never : _Key<T>

  export type Keys<T> = Key<Paths<T, []>>

  export type Value<T, Path extends string> = Path extends keyof NonNullable<T>
    ? NonNullable<T>[Path]
    : Path extends `${infer First}.${infer Rest}`
      ? First extends keyof NonNullable<T>
        ? Value<NonNullable<T>[First], Rest>
        : never
      : never
}
