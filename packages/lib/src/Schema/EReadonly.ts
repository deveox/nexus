import type { Annotation } from '@/utils/Annotation.js'
import { Type } from '@/Schema/Type.js'
import type { MakeReadonly } from '@/utils/index.js'
import { z } from 'zod'

export class EReadonly<T extends Type = any> extends Type<z.ZodReadonly<T['$']>> {
  declare _output: MakeReadonly<T['_output']> & Annotation.Readonly
  declare _input: MakeReadonly<T['_input']> & Annotation.Readonly
  declare _read: MakeReadonly<T['_read']> & Annotation.Readonly
  declare _create: MakeReadonly<T['_create']> & Annotation.Readonly
  declare _update: MakeReadonly<T['_update']> & Annotation.Readonly
  declare db_output: MakeReadonly<T['db_output']> & Annotation.Readonly
  declare db_input: MakeReadonly<T['db_input']> & Annotation.Readonly
  declare db_read: MakeReadonly<T['db_read']> & Annotation.Readonly
  declare db_create: MakeReadonly<T['db_create']> & Annotation.Readonly
  declare db_update: MakeReadonly<T['db_update']> & Annotation.Readonly
  declare json_output: MakeReadonly<T['json_output']> & Annotation.Readonly
  declare json_input: MakeReadonly<T['json_input']> & Annotation.Readonly
  declare json_read: MakeReadonly<T['json_read']> & Annotation.Readonly
  declare json_create: MakeReadonly<T['json_create']> & Annotation.Readonly
  declare json_update: MakeReadonly<T['json_update']> & Annotation.Readonly
  constructor(inner: T) {
    super(
      new z.ZodReadonly({
        innerType: inner.proxy(),
        typeName: z.ZodFirstPartyTypeKind.ZodReadonly,
      })
    )
  }
}
