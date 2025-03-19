import { Wrap } from '@/Schema/r.js'
import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export interface TNumber {
  positive(...args: Parameters<z.ZodNumber['positive']>): Wrap<TNumber>
  nonpositive(...args: Parameters<z.ZodNumber['nonpositive']>): Wrap<TNumber>
  negative(...args: Parameters<z.ZodNumber['negative']>): Wrap<TNumber>
  nonnegative(...args: Parameters<z.ZodNumber['nonnegative']>): Wrap<TNumber>
  int(...args: Parameters<z.ZodNumber['int']>): Wrap<TNumber>
  gte(...args: Parameters<z.ZodNumber['gte']>): Wrap<TNumber>
  gt(...args: Parameters<z.ZodNumber['gt']>): Wrap<TNumber>
  lte(...args: Parameters<z.ZodNumber['lte']>): Wrap<TNumber>
  lt(...args: Parameters<z.ZodNumber['lt']>): Wrap<TNumber>
  min: (...args: Parameters<z.ZodNumber['min']>) => Wrap<TNumber>
  safe(...args: Parameters<z.ZodNumber['safe']>): Wrap<TNumber>
  step: (...args: Parameters<z.ZodNumber['step']>) => Wrap<TNumber>
  finite(...args: Parameters<z.ZodNumber['finite']>): Wrap<TNumber>
  multipleOf(...args: Parameters<z.ZodNumber['multipleOf']>): Wrap<TNumber>
}
export class TNumber extends Type.Primitive<z.ZodNumber> {
  declare db_output: number
  declare json_output: number
  constructor(def?: TNumber.Def) {
    super(
      new z.ZodNumber({
        typeName: z.ZodFirstPartyTypeKind.ZodNumber,
        coerce: def?.coerce ?? false,
        checks: def?.checks ?? [],
      })
    )
  }
  _addCheck(check: z.ZodNumberCheck): Wrap<TNumber> {
    return Wrap.apply(new TNumber({ ...this.$._def, checks: [...this.$._def.checks, check] }))
  }

  max(...args: Parameters<z.ZodNumber['max']>): Wrap<TNumber> {
    return Wrap.apply(new TNumber({ ...this.$._def, checks: [...this.$._def.checks, { kind: 'max', value: args[0], inclusive: false }] }))
  }
}

export namespace TNumber {
  export interface Def {
    checks?: z.ZodNumberCheck[]
    coerce?: boolean
  }
}
