import { ChangeTracker } from '@/ChangeTracker.js'
import type { Collection } from '@/Collection.js'
import type { Schema } from '@/Schema/index.js'
import { deepSet } from '@/utils/index.js'

export abstract class Model<S extends Schema.TModel = any> {
  /**
   * Collection of the model
   * It's private to avoid TS type recursion
   */
  #collection: Collection<this>
  abstract schema: S
  name: string
  #changes: ChangeTracker<this>
  get $changes() {
    return this.#changes.changes
  }
  constructor(config: Model.Config<S>) {
    this.#collection = config.collection
    this.name = config.name ?? this.constructor.name
    this.#changes = new ChangeTracker()
  }

  $edit(): this {
    return this.#changes.track(this)
  }

  $set(data: S['_update']) {
    const m = this.$edit()
    deepSet(m, data)
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

  export function register<S extends Schema.TModel = any>(
    schema: S
  ): new (
    ...args: ConstructorParameters<typeof Model>
  ) => Model & S['_output'] {
    // Create a subclass
    const EnhancedClass = class extends Model<S> {
      schema = schema
      constructor(config: Model.Config<S>) {
        super(config)
        // Initialize extra properties
        Object.assign(this, config.data)
      }
    }

    return EnhancedClass as any
  }
}
