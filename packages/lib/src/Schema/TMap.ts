import { Type } from '@/Schema/Type.js'
import { z } from 'zod'
import type { TRecord } from '@/Schema/TRecord.js'

export class TMap<Key extends TRecord.KeyType, Value extends Type> extends Type<z.ZodMap<Key['$'], Value['$']>> {
  declare _output: Map<Key['_output'], Value['_output']>
  declare _input: Map<Key['_input'], Value['_input']>
  declare _read: Map<Key['_read'], Value['_read']>
  declare _create: Map<Key['_create'], Value['_create']>
  declare _update: Map<Key['_update'], Value['_update']>
  declare db_output: Record<Key['db_output'], Value['db_output']>
  declare db_input: Record<Key['db_input'], Value['db_input']>
  declare db_read: Record<Key['db_read'], Value['db_read']>
  declare db_create: Record<Key['db_create'], Value['db_create']>
  declare db_update: Record<Key['db_update'], Value['db_update']>
  declare json_output: Record<Key['json_output'], Value['json_output']>
  declare json_input: Record<Key['json_input'], Value['json_input']>
  declare json_read: Record<Key['json_read'], Value['json_read']>
  declare json_create: Record<Key['json_create'], Value['json_create']>
  declare json_update: Record<Key['json_update'], Value['json_update']>
  constructor(def: TMap.Def<Key, Value>) {
    super(
      new z.ZodMap({
        keyType: def.key.proxy() as Key['$'],
        valueType: def.value.proxy(),
        typeName: z.ZodFirstPartyTypeKind.ZodMap,
      })
    )
    this.json = {
      serialize: value => {
        return Object.fromEntries(value) as this['json_output']
      },
      deserializer: z.record(z.any(), z.any()).transform(value => new Map(Object.entries(value))),
    }
    this.db = this.json
  }
}

export namespace TMap {
  export interface Def<Key extends TRecord.KeyType, Value extends Type> {
    key: Key
    value: Value
  }
}
