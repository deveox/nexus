import { Type } from '@/Schema/Type.js'
import { z, type ZodTypeAny } from 'zod'

export type ZodUnionLike = readonly [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]

export class TUnion<E extends Type> extends Type<z.ZodUnion<TUnion.Elements.Zod<E>>> {
  declare _output: E['_output']
  declare _input: E['_input']
  declare _read: E['_read']
  declare _create: E['_create']
  declare _update: E['_update']
  declare db_output: E['db_output']
  declare db_input: E['db_input']
  declare db_read: E['db_read']
  declare db_create: E['db_create']
  declare db_update: E['db_update']
  declare json_output: E['json_output']
  declare json_input: E['json_input']
  declare json_read: E['json_read']
  declare json_create: E['json_create']
  declare json_update: E['json_update']
  constructor(options: TUnion.Elements<E>) {
    super(new z.ZodUnion({ typeName: z.ZodFirstPartyTypeKind.ZodUnion, options: options.map(e => e.proxy()) as TUnion.Elements.Zod<E> }))
  }
}

export namespace TUnion {
  export type Elements<E extends Type> = [E, ...E[]]
  export namespace Elements {
    export type Zod<E extends Type> = [E['$'], ...E['$'][]]
  }
}
