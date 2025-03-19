import { Type } from '@/Schema/Type.js'
import { addIssueToContext, z } from 'zod'

export class ZodBool extends z.ZodType<boolean, ZodBool.Def, boolean> {
  _parse(input: z.ParseInput) {
    const ctx = this._getOrReturnCtx(input)
    let v: boolean | undefined
    if (this._def.coerce) {
      v = this._build(input, ctx)
    } else {
      v = ctx.parsedType === 'boolean' ? input.data : undefined
    }
    if (v === undefined) {
      addIssueToContext(ctx, { code: z.ZodIssueCode.invalid_type, expected: z.ZodParsedType.boolean, received: ctx.parsedType })
      return z.INVALID
    }
    return z.OK(v)
  }
  _build(input: z.ParseInput, _ctx: z.ParseContext): boolean | undefined {
    const v = typeof input.data === 'string' ? input.data.toLowerCase() : input.data
    switch (v) {
      case 1:
      case '1':
      case 'true':
      case 'yes':
        return true
      case 'false':
      case '0':
      case 'no':
      case '':
      case 0:
      case -1:
      case undefined:
      case null:
        return false
    }
    return undefined
  }
}

export namespace ZodBool {
  export interface Def extends z.ZodTypeDef {
    coerce?: boolean
  }
}

export class TBoolean extends Type.Primitive<ZodBool> {
  declare db_output: boolean
  declare json_output: boolean
  constructor(def?: TBoolean.Def) {
    super(new ZodBool(def || {}))
  }
}

export namespace TBoolean {
  export type Def = ZodBool.Def
}
