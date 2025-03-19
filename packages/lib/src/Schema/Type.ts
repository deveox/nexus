import {
  getParsedType,
  ParseParams as ZodParseParams,
  ParseReturnType,
  SafeParseReturnType,
  SyncParseReturnType,
  ZodType,
  ParseContext as ZodParseContext,
  ParseInput as ZodParseInput,
  ZodError,
  isValid,
  z,
} from 'zod'

export interface Serializer<V = any, VI = any, Serialized = any, SI = Serialized> {
  serialize(value: V): Serialized
  deserializer: ZodType<VI, any, SI>
}

const MARKER = Symbol('Type')

export class Type<T extends ZodType = any> {
  [MARKER] = true as const
  $: T & { _parseNative: T['_parse'] }
  unwrap: this = this
  declare _output: any
  declare _input: any
  declare _read: any
  declare _create: any
  declare _update: any
  declare db_output: any
  declare db_input: any
  declare db_read: any
  declare db_create: any
  declare db_update: any
  declare json_output: any
  declare json_input: any
  declare json_read: any
  declare json_create: any
  declare json_update: any
  constructor(zod: T) {
    this.$ = zod as this['$']
    this.$._parseNative = this.$._parse
    this.$._parse = this._parse.bind(this)
  }

  json?: Serializer<this['_output'], this['_input'], this['json_output'], this['json_input']>
  db?: Serializer<this['_output'], this['_input'], this['db_output'], this['db_input']>
  _parse(input: Type.ParseInput) {
    const ctx = input.parent.common
    switch (ctx.ctx?.operation) {
      case 'deserialize':
        return this._deserialize(input, ctx.ctx.target)
      case 'serialize':
        return this._serialize(input, ctx.ctx.target)
      default:
        return this.$._parseNative(input)
    }
  }

  parse(...args: Parameters<T['parse']>) {
    return (this.$.parse as any)(...args)
  }

  _serializeStatus(r: SyncParseReturnType, serializer: Serializer) {
    if (r.status === 'aborted') {
      return r
    }
    return {
      status: r.status,
      value: serializer.serialize(r.value),
    }
  }
  _serialize(input: Type.ParseInput, target: Type.Target) {
    const res = this.$._parseNative(input)
    if (this[target]) {
      if (res instanceof Promise) {
        return res.then(r => this._serializeStatus(r, this[target] as Serializer))
      }
      return this._serializeStatus(res, this[target])
    }
    return res
  }
  _deserialize(input: Type.ParseInput, target: 'db' | 'json') {
    if (this[target]) {
      const res = this[target].deserializer._parse(input)
      if (res instanceof Promise) {
        return res.then(r => this._deserializeStatus(input, r))
      }
      return this._deserializeStatus(input, res)
    }
    return this.$._parseNative(input)
  }

  _deserializeStatus(input: Type.ParseInput, r: SyncParseReturnType) {
    if (r.status === 'aborted') {
      return r
    }
    input.data = r.value
    return this.$._parseNative(input)
  }

  safeParse(data: unknown, params?: Partial<ZodParseParams>): SafeParseReturnType<this['_input'], this['_output']>
  safeParse(data: unknown, params?: Partial<Type.ParseParams>): SafeParseReturnType<this['_input'], this['_output']> {
    const ctx: Type.ParseContext = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap,
        ctx: params?.ctx,
      },
      path: params?.path || [],
      schemaErrorMap: this.$._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data),
    }
    const result = this.$._parseSync({ data, path: ctx.path, parent: ctx })

    const res = Type.handleResult(ctx, result)
    if (params?.ctx?.scope === undefined || !res.success) {
      return res
    }
    // remove scope-excluded fields
    const excluded = this.removeExcluded(res.data)
    return { success: true, data: excluded === Type.EXCLUDE ? undefined : excluded }
  }

  removeExcluded(value: unknown) {
    switch (typeof value) {
      case 'object': {
        if (value === null) {
          return value
        }
        if (Array.isArray(value)) {
          const res: unknown[] = value.filter(v => this.removeExcluded(v) !== Type.EXCLUDE)
          if (res.length) return res
          return Type.EXCLUDE
        }
        if (value instanceof Map) {
          if (value.has(Type.EXCLUDE)) {
            return Type.EXCLUDE
          }
          for (const [k, v] of value) {
            if (this.removeExcluded(v) === Type.EXCLUDE) {
              value.delete(k)
            }
          }
          if (value.size) return value
          return Type.EXCLUDE
        }
        if (value instanceof Set) {
          for (const v of value) {
            if (this.removeExcluded(v) === Type.EXCLUDE) {
              value.delete(v)
            }
          }
          if (value.size) return value
          return Type.EXCLUDE
        }
        for (const k in value) {
          if (Object.hasOwn(value, k) && this.removeExcluded(value[k as keyof typeof value]) === Type.EXCLUDE) {
            delete value[k as keyof typeof value]
          }
        }
        if (Object.keys(value).length) return value
        return Type.EXCLUDE
      }
    }
    return value
  }
  proxy(): this & this['$'] {
    return new Proxy(this, {
      get: (target, key, receiver) => {
        const data = Reflect.get(target, key, receiver)
        if (data === undefined && key in this.$) {
          return (this.$ as any)[key]
        }
        return data
      },
      set: (target, key, value) => {
        if (key in this.$) {
          ;(this.$ as any)[key] = value
        }
        return Reflect.set(target, key, value)
      },
    }) as this & this['$']
  }
}

export namespace Type {
  export const EXCLUDE = Symbol('EXCLUDE')

  export interface Any<V = any, JSON = V, DB = V> extends ZodType<V, any, any> {
    [MARKER]: true
    unwrap: this
    _output: V
    _read: any
    _create: any
    _update: any
    _input: any
    db_output: DB
    db_read: any
    db_create: any
    db_update: any
    db_input: any
    json_output: JSON
    json_read: any
    json_create: any
    json_update: any
    json_input: any
  }

  export type Constructor = new (...args: any[]) => ZodTypeImpl
  export type ConstructorAny<C extends Constructor> = new (...args: any[]) => InstanceType<C> & Any
  export class ZodTypeImpl extends ZodType<any, any, any> {
    _parse(input: ZodParseInput) {
      return input as any as ParseReturnType<any>
    }
  }

  export type Target = 'db' | 'json'
  export namespace Target {
    export type Any = Target | ''
  }
  export type Operation = 'serialize' | 'deserialize'
  export type Scope = 'create' | 'update' | 'read'

  export interface Context {
    target: Target
    operation: Operation
    scope?: Scope
  }

  export interface ParseContext extends ZodParseContext {
    common: {
      [K in keyof ZodParseContext['common']]: ZodParseContext['common'][K]
    } & {
      ctx?: Context
    }
  }
  export interface ParseInput extends ZodParseInput {
    parent: ParseContext
  }
  export interface ParseParams extends Partial<ZodParseParams> {
    ctx?: Context
  }
  export const handleResult = <Input, Output>(
    ctx: ParseContext,
    result: SyncParseReturnType<Output>
  ): { success: true; data: Output } | { success: false; error: ZodError<Input> } => {
    if (isValid(result)) {
      return { success: true, data: result.value }
    }
    if (!ctx.common.issues.length) {
      throw new Error('Validation failed but no issues detected.')
    }

    return {
      success: false,
      get error() {
        if ((this as any)._error) return (this as any)._error as Error
        const error = new ZodError(ctx.common.issues)
        ;(this as any)._error = error
        return (this as any)._error
      },
    }
  }

  type GetProps<TBase> = TBase extends new (props: infer P) => any ? P : never
  type GetInstance<TBase> = TBase extends new (...args: any[]) => infer I ? I : never
  export type MergeConstructor<A, B> = new (props: GetProps<A> & GetProps<B>) => GetInstance<A> & GetInstance<B>

  /**
   * The return type of the Type function
   *
   * @template C - The constructor type being extended
   */
  export type TypeExtended<C extends Constructor> = {
    new (
      ...args: ConstructorParameters<C>
    ): InstanceType<C> & {
      [MARKER]: true
      unwrap: InstanceType<C> & { [MARKER]: true }
      _output: any
      _input: any
      _read: any
      _create: any
      _update: any
      db_output: any
      db_input: any
      db_read: any
      db_create: any
      db_update: any
      json_output: any
      json_input: any
      json_read: any
      json_create: any
      json_update: any

      json?: Serializer
      db?: Serializer

      _parse(input: ParseInput): z.ParseReturnType<any>
      _serializeStatus(r: z.SyncParseReturnType, serializer: Serializer): z.SyncParseReturnType
      _serialize(input: ParseInput, target: Target): z.ParseReturnType<any>
      _deserialize(input: ParseInput, target: 'db' | 'json'): z.ParseReturnType<any>
      _deserializeStatus(input: ParseInput, r: z.SyncParseReturnType): z.SyncParseReturnType

      safeParse(data: unknown, params?: Partial<z.ParseParams>): z.SafeParseReturnType<any, any>
      safeParse(data: unknown, params?: Partial<ParseParams>): z.SafeParseReturnType<any, any>

      removeExcluded(value: unknown): unknown
    }
  }

  export class Primitive<T extends ZodType> extends Type<T> {
    declare _output: T['_output']
    declare _read: this['_output']
    declare _create: this['_output']
    declare _update: this['_output']
    declare _input: T['_input']
    declare db_output: any
    declare db_read: this['db_output']
    declare db_create: this['db_output']
    declare db_update: this['db_output']
    declare db_input: this['db_output']
    declare json_output: any
    declare json_read: this['json_output']
    declare json_create: this['json_output']
    declare json_update: this['json_output']
    declare json_input: this['json_output']
  }
}
