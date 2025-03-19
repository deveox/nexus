import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export class EOptional<T extends Type> extends Type<z.ZodOptional<T['$']>> {
  declare _output: T['_output'] | undefined
  declare _input: T['_input'] | undefined
  declare _read: T['_read'] | undefined
  declare _create: T['_create'] | undefined
  declare _update: T['_update'] | undefined
  declare db_output: T['db_output'] | undefined
  declare db_input: T['db_input'] | undefined
  declare db_read: T['db_read'] | undefined
  declare db_create: T['db_create'] | undefined
  declare db_update: T['db_update'] | undefined
  declare json_output: T['json_output'] | undefined
  declare json_input: T['json_input'] | undefined
  declare json_read: T['json_read'] | undefined
  declare json_create: T['json_create'] | undefined
  declare json_update: T['json_update'] | undefined
  constructor(inner: T) {
    super(
      new z.ZodOptional({
        innerType: inner.proxy(),
        typeName: z.ZodFirstPartyTypeKind.ZodOptional,
      })
    )
  }
}
