import { Type } from '@/Schema/Type.js'
import { addIssueToContext, z } from 'zod'
import { ObjectId } from 'bson'

export class ZodObjectId extends z.ZodType<ObjectId, z.ZodTypeDef, ObjectId> {
  _parse(input: z.ParseInput) {
    const ctx = this._getOrReturnCtx(input)
    if (input.data instanceof ObjectId) {
      return z.OK(input.data)
    }
    addIssueToContext(ctx, { code: z.ZodIssueCode.invalid_type, expected: 'ObjectId' as z.ZodParsedType, received: ctx.parsedType })
    return z.INVALID
  }
}

export class TObjectId extends Type.Primitive<ZodObjectId> {
  declare db_output: ObjectId
  declare json_output: string
  constructor(def?: TObjectId.Def) {
    super(new ZodObjectId(def ?? {}))
    this.json = {
      serialize: value => {
        return value.toString()
      },
      deserializer: z.string().transform(v => new ObjectId(v)),
    }
  }
}

export namespace TObjectId {
  export type Def = z.ZodTypeDef
}
