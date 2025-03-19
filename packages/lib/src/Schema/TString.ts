import { Wrap } from '@/Schema/r.js'
import { Type } from '@/Schema/Type.js'
import { z, type ZodString } from 'zod'

export interface TString {
  length(...args: Parameters<ZodString['length']>): Wrap<TString>
  min(...args: Parameters<ZodString['min']>): Wrap<TString>
  max(...args: Parameters<ZodString['max']>): Wrap<TString>
  regex(...args: Parameters<ZodString['regex']>): Wrap<TString>
  startsWith(...args: Parameters<ZodString['startsWith']>): Wrap<TString>
  endsWith(...args: Parameters<ZodString['endsWith']>): Wrap<TString>
  includes(...args: Parameters<ZodString['includes']>): Wrap<TString>
  email(...args: Parameters<ZodString['email']>): Wrap<TString>
  url(...args: Parameters<ZodString['url']>): Wrap<TString>
  uuid(...args: Parameters<ZodString['uuid']>): Wrap<TString>
  nanoid(...args: Parameters<ZodString['nanoid']>): Wrap<TString>
  cuid(...args: Parameters<ZodString['cuid']>): Wrap<TString>
  cuid2(...args: Parameters<ZodString['cuid2']>): Wrap<TString>
  ulid(...args: Parameters<ZodString['ulid']>): Wrap<TString>
  base64(...args: Parameters<ZodString['base64']>): Wrap<TString>
  base64url(...args: Parameters<ZodString['base64url']>): Wrap<TString>
  jwt(...args: Parameters<ZodString['jwt']>): Wrap<TString>
  datetime(...args: Parameters<ZodString['datetime']>): Wrap<TString>
  date(...args: Parameters<ZodString['date']>): Wrap<TString>
  time(...args: Parameters<ZodString['time']>): Wrap<TString>
  duration(...args: Parameters<ZodString['duration']>): Wrap<TString>
  ip(...args: Parameters<ZodString['ip']>): Wrap<TString>
  cidr(...args: Parameters<ZodString['cidr']>): Wrap<TString>
  emoji(...args: Parameters<ZodString['emoji']>): Wrap<TString>
}
export class TString extends Type.Primitive<z.ZodString> {
  declare db_output: string
  declare json_output: string
  constructor(def?: TString.Def) {
    super(
      new z.ZodString({
        ...def,
        checks: def?.checks ?? [],
        coerce: def?.coerce ?? false,
        typeName: z.ZodFirstPartyTypeKind.ZodString,
      })
    )
  }

  _addCheck(check: z.ZodStringCheck): TString {
    return Wrap.apply(new TString({ ...this.$._def, checks: [...this.$._def.checks, check] }))
  }
}

export namespace TString {
  export interface Def {
    checks?: z.ZodStringCheck[]
    coerce?: boolean
  }
}
