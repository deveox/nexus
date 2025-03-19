import { Type } from '@/Schema/Type.js'
import { ZodDateTime } from '@/Schema/ZodType/ZodDateTime.js'
import { DateTime } from 'luxon'
import { z } from 'zod'

export class TDate extends Type.Primitive<ZodDateTime> {
  declare db_output: Date
  declare json_output: string
  constructor(def?: TDate.Def) {
    super(
      new ZodDateTime({
        ...def,
        coerce: def?.coerce ?? false,
      })
    )
    this.json = {
      serialize(value) {
        return value.toISO()
      },
      deserializer: z.string().transform(v => DateTime.fromISO(v)),
    }
    this.db = {
      serialize(value) {
        return value.toJSDate()
      },
      deserializer: z.date().transform(v => DateTime.fromJSDate(v)),
    }
  }
}

export namespace TDate {
  export interface Def extends Partial<ZodDateTime.Def> {}
}
