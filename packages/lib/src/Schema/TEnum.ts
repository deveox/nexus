import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export class TEnum<V extends z.EnumLike> extends Type.Primitive<z.ZodNativeEnum<V>> {
  declare _input: V[keyof V]
  declare _output: V[keyof V]
  declare db_output: V[keyof V]
  declare json_output: V[keyof V]

  constructor(def: TEnum.Def<V>) {
    super(
      new z.ZodNativeEnum({
        typeName: z.ZodFirstPartyTypeKind.ZodNativeEnum,
        values: def.enum,
      })
    )
  }
}

export namespace TEnum {
  export interface Def<V extends z.EnumLike> {
    enum: V
  }
}
