import type { Annotation } from '@/utils/Annotation.js'
import { Wrap } from '@/Schema/r.js'
import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export type extendShape<A extends object, B extends object> = {
  [K in keyof A as K extends keyof B ? never : K]: A[K]
} & {
  [K in keyof B]: B[K]
}

export class TObject<P extends TObject.Properties = TObject.Properties> extends Type<
  z.ZodObject<TObject.Properties.Zod<P>, 'strip', z.ZodType>
> {
  properties: P
  declare _output: TObject.Properties.Unwrap<P, '_output'>
  declare _input: TObject.Properties.Unwrap<P, '_input'>
  declare _read: TObject.Properties.Unwrap<P, '_read'>
  declare _create: TObject.Properties.Unwrap<P, '_create'>
  declare _update: TObject.Properties.Unwrap<P, '_update'>
  declare db_output: TObject.Properties.Unwrap<P, 'db_output'>
  declare db_input: TObject.Properties.Unwrap<P, 'db_input'>
  declare db_read: TObject.Properties.Unwrap<P, 'db_read'>
  declare db_create: TObject.Properties.Unwrap<P, 'db_create'>
  declare db_update: TObject.Properties.Unwrap<P, 'db_update'>
  declare json_output: TObject.Properties.Unwrap<P, 'json_output'>
  declare json_input: TObject.Properties.Unwrap<P, 'json_input'>
  declare json_read: TObject.Properties.Unwrap<P, 'json_read'>
  declare json_create: TObject.Properties.Unwrap<P, 'json_create'>
  declare json_update: TObject.Properties.Unwrap<P, 'json_update'>
  constructor(properties: P) {
    const props = {} as TObject.Properties.Zod<P>
    for (const key in properties) {
      const prop = properties[key]
      props[key] = prop.proxy()
    }
    super(
      new z.ZodObject({
        shape: () => props,
        catchall: z.never(),
        typeName: z.ZodFirstPartyTypeKind.ZodObject,
        unknownKeys: 'strip',
      })
    )
    this.properties = properties
  }

  extend<Augmentation extends TObject.Properties>(augmentation: Augmentation): Wrap<TObject<z.objectUtil.extendShape<P, Augmentation>>> {
    return Wrap.apply(
      new TObject({
        ...this.$._def.shape(),
        ...augmentation,
      })
    ) as any
  }
}

export namespace TObject {
  export type Properties = {
    [key: string]: Type
  }

  export namespace Properties {
    export type Zod<P extends Properties> = {
      [K in keyof P]: P[K]['$']
    }
    export type Unwrap<P extends Properties, Target extends keyof Type> = z.objectUtil.flatten<
      TObject.util.addQuestionMarks<
        {
          readonly [K in keyof P as P[K][Target] extends never
            ? never
            : Annotation.Has<P[K][Target], Annotation.Readonly> extends true
              ? K
              : never]: P[K][Target]
        } & {
          [K in keyof P as P[K][Target] extends never
            ? never
            : Annotation.Has<P[K][Target], Annotation.Readonly> extends true
              ? never
              : K]: P[K][Target]
        }
      >
    >
  }

  export namespace util {
    export type optionalKeys<T extends object> = {
      [k in keyof T]: undefined extends T[k] ? k : never
    }[keyof T]
    export type requiredKeys<T extends object> = {
      [k in keyof T]: undefined extends T[k] ? never : k
    }[keyof T]
    export type addQuestionMarks<T extends object, _O = any> = {
      readonly [K in requiredKeys<T>]: T[K]
    } & {
      readonly [K in optionalKeys<T>]?: T[K]
    } & {
      [k in keyof T]?: unknown
    }
  }
}
