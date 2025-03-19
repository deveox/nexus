import { TArray } from '@/Schema/TArray.js'
import { TBoolean } from '@/Schema/TBoolean.js'
import { TBuffer } from '@/Schema/TBuffer.js'
import { TDate } from '@/Schema/TDate.js'
import { TNumber } from '@/Schema/TNumber.js'
import { TObject } from '@/Schema/TObject.js'
import { TString } from '@/Schema/TString.js'
import { EOptional } from '@/Schema/EOptional.js'
import { TUnion } from '@/Schema/TUnion.js'
import { TSet } from '@/Schema/TSet.js'
import { TRecord } from '@/Schema/TRecord.js'
import { TUnknown } from '@/Schema/TUnknown.js'
import { TUndefined } from '@/Schema/TUndefined.js'
import { TMap } from '@/Schema/TMap.js'
import { TEnum } from '@/Schema/TEnum.js'
import { EDefault } from '@/Schema/EDefault.js'
import { EScoped, immutable as Immutable } from '@/Schema/EScoped.js'
import type { Type } from '@/Schema/Type.js'
import type { EnumLike, SafeParseReturnType, util } from 'zod'
import { TObjectId } from '@/Schema/TObjectId.js'
import type { EReadonly } from '@/Schema/EReadonly.js'

export type Wrap<T extends Type, Pk extends Wrap.OneTimeMod = never> = Omit<
  {
    optional(): Wrap<EOptional<T>, 'optional'>
    optional(def: util.noUndefined<T['_input']> | (() => T['_input'])): Wrap<EDefault<T>, 'optional'>
    default(def: util.noUndefined<T['_input']> | (() => T['_input'])): Wrap<EDefault<T>, 'optional'>
    scope<S extends [Type.Scope, ...Type.Scope[]]>(...scopes: S): Wrap<EScoped<T, 'json', S[number]>, 'scope' | 'immutable'>
    immutable<S extends 'create' | 'read' = 'read'>(
      ...scopes: S[]
    ): Wrap<EScoped<EScoped<EReadonly<T>, 'db', 'read' | 'create'>, 'json', S>, 'scope' | 'immutable'>
    safeDeserialize<Tg extends Type.Target>(target: Tg, value: unknown): SafeParseReturnType<T[`${Tg}_output`], T[`_output`]>
    safeDeserialize<Tg extends Type.Target, S extends Type.Scope>(
      target: Tg,
      scope: S,
      value: unknown
    ): SafeParseReturnType<T[`${Tg}_${S}`], T[`_${S}`]>
    deserialize<Tg extends Type.Target>(target: Tg, value: unknown): T[`_output`]
    deserialize<Tg extends Type.Target, S extends Type.Scope>(target: Tg, scope: S, value: unknown): T[`_${S}`]
    safeSerialize<Tg extends Type.Target>(target: Tg, value: T[`_output`]): SafeParseReturnType<T[`_output`], T[`${Tg}_output`]>
    safeSerialize<Tg extends Type.Target, S extends Type.Scope>(
      target: Tg,
      scope: S,
      value: T[`_${S}`]
    ): SafeParseReturnType<T[`_${S}`], T[`${Tg}_${S}`]>
    serialize<Tg extends Type.Target>(target: Tg, value: T[`_output`]): T[`${Tg}_output`]
    serialize<Tg extends Type.Target, S extends Type.Scope>(target: Tg, scope: S, value: T[`_${S}`]): T[`${Tg}_${S}`]
    unwrap: T
  },
  Pk
> &
  T

export namespace Wrap {
  export type OneTimeMod = 'optional' | 'scope' | 'immutable'

  export function apply<T extends Type, Pk extends OneTimeMod = never>(type: T, ..._keys: Pk[]) {
    return new Proxy(type, {
      get: (target, prop) => {
        switch (prop) {
          case 'unwrap':
            return target
          case 'optional':
          case 'default':
            return (def?: any) => optional(type, def)
          case 'scope':
            return (...scopes: any) => scope(type, ...scopes)
          case 'immutable':
            return (...scopes: any) => immutable(type, ...scopes)
          case 'deserialize':
            return (tg: Type.Target, scope: Type.Scope, v?: any) => deserialize(type, tg, v === undefined ? undefined : scope, v ?? scope)
          case 'safeDeserialize':
            return (tg: Type.Target, scope: Type.Scope, v?: any) =>
              safeDeserialize(type, tg, v === undefined ? undefined : scope, v ?? scope)
          case 'serialize':
            return (tg: Type.Target, scope: Type.Scope, v?: any) => serialize(type, tg, v === undefined ? undefined : scope, v ?? scope)
          case 'safeSerialize':
            return (tg: Type.Target, scope: Type.Scope, v?: any) => safeSerialize(type, tg, v === undefined ? undefined : scope, v ?? scope)
        }
        return Reflect.get(target, prop)
      },
    }) as unknown as Wrap<T, Pk>
  }
}

export function safeSerialize<T extends Type, Tg extends Type.Target, S extends Type.Scope>(
  type: T,
  target: Tg,
  scope: S | undefined,
  value: T[`_${S}`]
): SafeParseReturnType<T[`_${S}`], T[`${Tg}_${S}`]> {
  return type.safeParse(value, {
    // @ts-expect-error private implementation
    ctx: {
      target,
      operation: 'serialize',
      scope,
    },
  })
}

export function serialize<T extends Type, Tg extends Type.Target, S extends Type.Scope>(
  type: T,
  target: Tg,
  scope: S | undefined,
  value: T[`_${S}`]
): T[`${Tg}_${S}`] {
  const res = safeSerialize(type, target, scope, value)
  if (res.success) return res.data
  throw res.error
}

export function safeDeserialize<T extends Type, Tg extends Type.Target, S extends Type.Scope>(
  type: T,
  target: Tg,
  scope: S | undefined,
  value: unknown
): SafeParseReturnType<T[`${Tg}_${S}`], T[`_${S}`]> {
  return type.safeParse(value, {
    // @ts-expect-error private implementation
    ctx: {
      target,
      operation: 'deserialize',
      scope,
    },
  })
}

export function deserialize<T extends Type, Tg extends Type.Target, S extends Type.Scope>(
  type: T,
  target: Tg,
  scope: S | undefined,
  value: unknown
): T[`_${S}`] {
  const res = safeDeserialize(type, target, scope, value)
  if (res.success) return res.data
  throw res.error
}

export function optional(): Wrap<TUndefined, 'optional'>
export function optional<T extends Type>(inner: Wrap<T> | T): Wrap<EOptional<T>, 'optional'>
export function optional<T extends Type>(
  inner: Wrap<T> | T,
  def: util.noUndefined<T['_input']> | (() => T['_input'])
): Wrap<EDefault<T>, 'optional'>
export function optional<T extends Type>(
  inner?: Wrap<T> | T,
  def?: util.noUndefined<T['_input']> | (() => T['_input'])
): Wrap<EOptional<T>, 'optional'> | Wrap<TUndefined, 'optional'> | Wrap<EDefault<T>, 'optional'> {
  if (inner) {
    if (def) {
      return Wrap.apply(new EDefault({ inner: inner.unwrap, default: def }), 'optional')
    }
    return Wrap.apply(new EOptional(inner.unwrap), 'optional')
  }
  return Wrap.apply(new TUndefined(), 'optional')
}

export function scope<T extends Type, S extends [Type.Scope, ...Type.Scope[]]>(type: Wrap<T> | T, ...scopes: S) {
  return Wrap.apply(new EScoped<T, 'json', S[number]>({ inner: type.unwrap, target: 'json', scopes }), 'scope', 'immutable')
}

export function immutable<T extends Type, S extends 'read' | 'create' = 'read'>(type: Wrap<T> | T, ...scopes: S[]) {
  return Wrap.apply(Immutable(type.unwrap, ...scopes), 'scope', 'immutable')
}

export function string() {
  return Wrap.apply(new TString())
}

export function boolean(def?: TBoolean.Def) {
  return Wrap.apply(new TBoolean(def))
}

export function number() {
  return Wrap.apply(new TNumber())
}

export function enm<V extends EnumLike>(value: V) {
  return Wrap.apply(new TEnum({ enum: value }))
}

export function object<P extends TObject.Properties>(properties: P) {
  return Wrap.apply(
    new TObject<{
      [K in keyof P]: P[K]['unwrap']
    }>(properties)
  )
}

export function array<T extends Type>(element: Wrap<T>) {
  return Wrap.apply(new TArray({ element: element.unwrap }))
}

export function date() {
  return Wrap.apply(new TDate())
}

export function buffer(def?: TBuffer.Def) {
  return Wrap.apply(new TBuffer(def))
}

export function objectId(def?: TObjectId.Def) {
  return Wrap.apply(new TObjectId(def))
}

export function union<E extends [Type, ...Type[]]>(elements: E) {
  return Wrap.apply(new TUnion<E[number]>(elements))
}

export function set<T extends Type>(el: Wrap<T>) {
  return Wrap.apply(new TSet<T>({ element: el.unwrap }))
}

export function record<Key extends TRecord.KeyType, Value extends Type>(key: Wrap<Key>, value: Wrap<Value>) {
  return Wrap.apply(new TRecord({ key: key.unwrap, value: value.unwrap }))
}
export function map<Key extends TRecord.KeyType, Value extends Type>(key: Wrap<Key>, value: Wrap<Value>) {
  return Wrap.apply(new TMap({ key: key.unwrap, value: value.unwrap }))
}

export function unknown() {
  return Wrap.apply(new TUnknown())
}

export * as r from './r.js'
