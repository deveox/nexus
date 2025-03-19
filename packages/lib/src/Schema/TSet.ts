import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export interface TSet<T extends Type> {
  nonempty(...args: Parameters<z.ZodSet['nonempty']>): TSet<T>
}

export class TSet<T extends Type> extends Type<z.ZodSet<T['$']>> {
  declare _output: Set<T['_output']>
  declare _input: Set<T['_input']>
  declare _read: Set<T['_read']>
  declare _create: Set<T['_create']>
  declare _update: Set<T['_update']>
  declare db_output: T['db_output'][]
  declare db_input: T['db_input'][]
  declare db_read: T['db_read'][]
  declare db_create: T['db_create'][]
  declare db_update: T['db_update'][]
  declare json_output: T['json_output'][]
  declare json_input: T['json_input'][]
  declare json_read: T['json_read'][]
  declare json_create: T['json_create'][]
  declare json_update: T['json_update'][]
  constructor(def: TSet.Def<T>) {
    super(
      new z.ZodSet({
        typeName: z.ZodFirstPartyTypeKind.ZodSet,
        valueType: def.element.proxy(),
        maxSize: def.maxSize ?? null,
        minSize: def.minSize ?? null,
      })
    )
    this.json = {
      serialize(value) {
        return Array.from(value)
      },
      deserializer: z.array(z.any()).transform(value => new Set(value)),
    }
    this.db = this.json
  }

  min(minSize: number, message?: string): this {
    return new TSet({
      ...this.$._def,
      element: this.$._def.valueType,
      minSize: { value: minSize, message: message },
    }) as this
  }

  max(maxSize: number, message?: string): this {
    return new TSet({
      ...this.$._def,
      element: this.$._def.valueType,
      maxSize: { value: maxSize, message: message },
    }) as this
  }
}
export namespace TSet {
  export interface Def<T extends Type> {
    element: T
    maxSize?: z.ZodSetDef['maxSize'] | null
    minSize?: z.ZodSetDef['minSize'] | null
  }
}
