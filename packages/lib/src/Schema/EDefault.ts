import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export class EDefault<T extends Type = Type> extends Type<z.ZodDefault<T['$']>> {
  declare _output: T['_output']
  declare _input: T['_input'] | undefined
  declare _read: T['_read']
  declare _create: T['_create']
  declare _update: T['_update']
  declare db_output: T['db_output']
  declare db_input: T['db_input'] | undefined
  declare db_read: T['db_read']
  declare db_create: T['db_create']
  declare db_update: T['db_update']
  declare json_output: T['json_output']
  declare json_input: T['json_input'] | undefined
  declare json_read: T['json_read']
  declare json_create: T['json_create']
  declare json_update: T['json_update']
  constructor(def: EDefault.Def<T>) {
    super(
      new z.ZodDefault({
        innerType: def.inner.proxy(),
        defaultValue: typeof def.default === 'function' ? (def.default as () => T['_input']) : ((() => def.default) as () => T['_input']),
        typeName: z.ZodFirstPartyTypeKind.ZodDefault,
      })
    )
  }
}

export namespace EDefault {
  export interface Def<T extends Type = Type> extends Omit<z.ZodDefaultDef<T['$']>, 'innerType' | 'defaultValue' | 'typeName'> {
    inner: T
    default: T['_input'] | (() => T['_input'])
  }
}
