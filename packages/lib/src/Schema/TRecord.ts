import { Type } from '@/Schema/Type.js'
import { z } from 'zod'
import { TString } from './TString.js'

export class TRecord<Key extends TRecord.KeyType, Value extends Type> extends Type<z.ZodRecord<Key['$'], Value['$']>> {
  declare _output: Record<Key['_output'], Value['_output']>
  declare _input: Record<Key['_input'], Value['_input']>
  declare _read: Record<Key['_read'], Value['_read']>
  declare _create: Record<Key['_create'], Value['_create']>
  declare _update: Record<Key['_update'], Value['_update']>
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

  constructor(def: TRecord.Def<Key, Value>) {
    super(
      new z.ZodRecord({
        typeName: z.ZodFirstPartyTypeKind.ZodRecord,
        keyType: def.key.proxy() as Key['$'],
        valueType: def.value.proxy(),
      })
    )
  }
}

export namespace TRecord {
  export type Key = string | number
  export type KeyType = TString

  export interface Def<Key extends KeyType, Value extends Type> {
    key: Key
    value: Value
  }
}
