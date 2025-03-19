import { Type } from '@/Schema/Type.js'
import { z } from 'zod'

export class ZodScoped<T extends z.ZodType, Target extends Type.Target = Type.Target, Scope extends Type.Scope = never> extends z.ZodType<
  T['_output'],
  ZodScoped.Def<T, Target, Scope>,
  T['_input']
> {
  declare _scope: Scope
  read = false
  create = false
  update = false
  constructor(def: ZodScoped.Def<T, Target, Scope>) {
    super(def)
    if (def.scopes) {
      for (const scope of def.scopes) {
        this[scope] = true
      }
    }
  }
  _parse(input: Type.ParseInput) {
    if (input.parent.common.ctx?.target === this._def.target && input.parent.common.ctx.scope && !this[input.parent.common.ctx.scope]) {
      return z.OK(Type.EXCLUDE as any) // TODO remove as any
    }
    return this._def.inner._parse(input)
  }
}

export namespace ZodScoped {
  export interface Def<T extends z.ZodType = z.ZodType, Target extends Type.Target = Type.Target, Scope extends Type.Scope = never>
    extends z.ZodTypeDef {
    inner: T
    target: Target
    scopes?: Scope[]
  }
}
