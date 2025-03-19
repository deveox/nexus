import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export class TUnknown extends Type.Primitive<z.ZodUnknown> {
  declare db_output: unknown
  declare json_output: unknown
  constructor() {
    super(new z.ZodUnknown({ typeName: z.ZodFirstPartyTypeKind.ZodUnknown }))
  }
}
