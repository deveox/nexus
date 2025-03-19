import { EReadonly } from '@/Schema/EReadonly.js'
import { Type } from '@/Schema/Type.js'
import { ZodScoped } from '@/Schema/ZodType/ZodScoped.js'

export class EScoped<T extends Type, Target extends Type.Target, Scope extends Type.Scope = never> extends Type<
  ZodScoped<T['$'], Target, Scope>
> {
  declare _output: T['_output']
  declare _input: T['_input']
  declare _read: 'read' extends Scope ? T['_read'] : never
  declare _create: 'create' extends Scope ? T['_create'] : never
  declare _update: 'update' extends Scope ? T['_update'] : never
  declare db_output: T['db_output']
  declare db_input: T['db_input']
  declare db_read: 'read' extends Scope ? T['db_read'] : 'db' extends Target ? never : T['db_read']
  declare db_create: 'create' extends Scope ? T['db_create'] : 'db' extends Target ? never : T['db_create']
  declare db_update: 'update' extends Scope ? T['db_update'] : 'db' extends Target ? never : T['db_update']
  declare json_output: T['json_output']
  declare json_input: T['json_input']
  declare json_read: 'read' extends Scope ? T['json_read'] : 'json' extends Target ? never : T['json_read']
  declare json_create: 'create' extends Scope ? T['json_create'] : 'json' extends Target ? never : T['json_create']
  declare json_update: 'update' extends Scope ? T['json_update'] : 'json' extends Target ? never : T['json_update']
  constructor(def: EScoped.Def<T, Target, Scope>) {
    super(
      new ZodScoped({
        ...def,
        inner: def.inner.proxy(),
      })
    )
  }
}

export namespace EScoped {
  export interface Def<T extends Type = Type, Target extends Type.Target = Type.Target, Scope extends Type.Scope = never>
    extends ZodScoped.Def<T['$'], Target, Scope> {
    inner: T
  }
}

export type EImmutable<T extends Type, S extends 'create' | 'read' = 'read'> = EScoped<
  EScoped<EReadonly<T>, 'db', 'read' | 'create'>,
  'json',
  S
>

export function immutable<T extends Type, S extends 'read' | 'create' = 'read'>(type: T, ...scopes: S[]) {
  return new EScoped({
    inner: new EScoped<EReadonly<T>, 'db', 'read' | 'create'>({
      inner: new EReadonly(type.unwrap),
      target: 'db',
      scopes: ['read', 'create'],
    }),

    target: 'json',
    scopes: scopes.length ? scopes : (['read'] as S[]),
  })
}
