import { Select } from '@/Query/Select.js'
import { Create } from '@/Query/Create.js'
import { Delete } from '@/Query/Delete.js'
import type { Model } from '@/Model.js'
import type { Transaction } from '@/Transaction.js'
import type { Db } from '@/Db.js'
import type mongodb from 'mongodb'
import snakeCase from 'lodash.snakecase'
import { r } from '@/Schema/r.js'
import type { ObjectId } from 'mongodb'
import { Update } from '@/Query/Update.js'
import { RError } from './RError.js'

export class Collection<M extends Model = Model> {
  readonly db: Db
  readonly $: mongodb.Collection
  readonly Model: Model.Constructor<M>
  readonly schema: Model['schema']
  readonly beforeCreate: NonNullable<Collection.Config<M>['beforeCreate']>
  readonly afterCreate: Collection.Config<M>['afterCreate']
  readonly beforeDelete: Collection.Config<M>['beforeDelete']
  readonly afterDelete: Collection.Config<M>['afterDelete']
  readonly beforeUpdate: Collection.Config<M>['beforeUpdate']
  readonly afterUpdate: Collection.Config<M>['afterUpdate']

  get modelName() {
    return this.Model.name
  }

  get name() {
    return this.$.collectionName
  }

  json: Collection.JSONCodec<M, this>
  database: Collection.DbCodec<M, this>
  constructor(config: Collection.Config<M>) {
    this.db = config.db
    this.Model = config.model
    this.schema = this.Model.prototype.schema
    const name = config?.collection ?? snakeCase(this.Model.name)
    this.$ = this.db.$.collection(name, config?.mongodb)
    this.beforeCreate =
      config?.beforeCreate ?? (((data: M['schema']['_create']) => data) as unknown as NonNullable<Collection.Config<M>['beforeCreate']>)
    this.afterCreate = config?.afterCreate
    this.beforeDelete = config?.beforeDelete
    this.afterDelete = config?.afterDelete
    this.beforeUpdate = config?.beforeUpdate
    this.afterUpdate = config?.afterUpdate
    this.json = new Collection.JSONCodec(this)
    this.database = new Collection.DbCodec(this)
  }

  new(data: M['$']) {
    return new this.Model({
      collection: this,
      data,
    })
  }

  select(): Select<M>
  select(id: string | ObjectId): Promise<M>
  select(id?: string | ObjectId) {
    if (id) {
      return (this as unknown as Collection).select().eq('_id', id).one()
    }
    return new Select(this)
  }

  create() {
    return new Create(this)
  }

  delete(): Delete<M>
  delete(id: string | ObjectId): Promise<M>
  delete(id?: string | ObjectId) {
    if (id) {
      return (this as unknown as Collection).delete().eq('_id', id).one()
    }
    return new Delete(this)
  }

  update(id: string | ObjectId, data: M['schema']['_update']): Promise<M>
  update(): Update<M>
  update(id?: string | ObjectId, data?: M['schema']['_update']) {
    if (id && data) {
      return (this as unknown as Collection).update().eq('_id', id).one(data)
    }
    return new Update(this)
  }
}

export namespace Collection {
  export interface Config<M extends Model> {
    db: Db
    model: Model.Constructor<M>
    /**
     * Mongoose model name
     */
    name?: string
    /**
     * Collection name in MongoDB
     */
    collection?: string
    // indexes?: Index<M>[];
    beforeCreate?(tx: Transaction, data: M['schema']['_create']): Promise<Omit<M['schema']['_input'], 'id' | 'createdAt' | 'updatedAt'>>
    afterCreate?(tx: Transaction, model: M): Promise<void>
    beforeDelete?(tx: Transaction, model: M): Promise<void>
    afterDelete?(tx: Transaction, model: M): Promise<void>
    beforeUpdate?(tx: Transaction, model: M): Promise<void>
    afterUpdate?(tx: Transaction, model: M): Promise<void>
    mongodb?: mongodb.CollectionOptions
  }

  export class JSONCodec<M extends Model, C extends Collection<M>> {
    protected readonly collection: C
    constructor(collection: C) {
      this.collection = collection
    }
    deserialize<S extends 'create' | 'update'>(scope: S, value: unknown) {
      const res = r.safeDeserialize(this.collection.schema, 'json', scope, value)
      if (res.success) {
        return res.data
      }
      throw new RError(res.error.message, 422)
    }

    serialize(model: M) {
      const res = r.safeSerialize(this.collection.schema, 'json', 'read', model.$)
      if (res.success) {
        return res.data
      }
      throw new RError(res.error.message)
    }
  }

  export class DbCodec<M extends Model, C extends Collection<M>> {
    protected readonly collection: C
    constructor(collection: C) {
      this.collection = collection
    }
    serialize<S extends 'create' | 'update'>(scope: S, value: M) {
      const res = r.safeSerialize(this.collection.schema, 'db', scope, value.$)
      if (res.success) {
        return res.data
      }
      throw new RError(res.error.message)
    }

    deserialize(data: unknown): M {
      const res = r.safeDeserialize(this.collection.schema, 'db', 'read', data)
      if (res.success) {
        return new this.collection.Model({
          collection: this.collection,
          data: res.data,
        })
      }
      throw new RError(res.error.message)
    }
  }
}
