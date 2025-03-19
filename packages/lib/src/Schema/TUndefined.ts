import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export class TUndefined extends Type.Primitive<z.ZodUndefined> {
  declare db_output: undefined
  declare json_output: undefined
  constructor() {
    super(new z.ZodUndefined({ typeName: z.ZodFirstPartyTypeKind.ZodUndefined }))
  }
}
