import { ChangeTracker } from '@/ChangeTracker.js'
import type { Collection } from '@/Collection.js'
import type { Schema } from '@/Schema/index.js'
import { deepSet } from '@/utils/index.js'
import type { ObjectId } from 'mongodb'

export abstract class Model<S extends Schema.TModel = any> {
  /**
   * Collection of the model
   * It's private to avoid TS type recursion
   */
  #collection: Collection<this>
  abstract schema: S
  name: string
  $: S['_output']
  #changes: ChangeTracker<this['$']>
  get changes() {
    return this.#changes.changes
  }
  constructor(config: Model.Config<S>) {
    this.#collection = config.collection
    this.name = config.name ?? this.constructor.name
    this.$ = config.data as this['$']
    this.#changes = new ChangeTracker()
  }

  get id(): ObjectId {
    return this.$._id as ObjectId
  }

  edit(): this {
    this.$ = this.#changes.track(this.$)
    return this
  }

  set(data: S['_update']) {
    this.edit()
    deepSet(this.$, data)
  }
}

export namespace Model {
  export interface Config<S extends Schema.TModel = any> {
    collection: Collection<any>
    name?: string
    data: S['_output']
  }

  export type Constructor<M extends Model> = new (config: Config<M['schema']>) => M

  export type SchemaPropertiesBound = {
    _id: Schema.EImmutable<Schema.TObjectId>
  }
}
