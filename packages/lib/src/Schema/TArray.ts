import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export class TArray<T extends Type = Type> extends Type<z.ZodArray<T['$']>> {
  declare _output: T['_output'][]
  declare _input: T['_input'][]
  declare _read: T['_read'][]
  declare _create: T['_create'][]
  declare _update: T['_update'][]
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
  constructor(def: TArray.Def<T>) {
    super(
      new z.ZodArray({
        typeName: z.ZodFirstPartyTypeKind.ZodArray,
        type: def.element.proxy(),
        exactLength: def.exactLength ?? null,
        minLength: def.minLength ?? null,
        maxLength: def.maxLength ?? null,
        description: def.description,
        errorMap: def.errorMap,
      })
    )
  }
}
export namespace TArray {
  export interface Def<T extends Type> extends Omit<Partial<z.ZodArrayDef<T['$']>>, 'typeName' | 'type'> {
    element: T
  }
}
