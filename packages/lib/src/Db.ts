import { Collection } from '@/Collection.js'
import type { Connection } from '@/Connection.js'
import type { Model } from '@/Model.js'
import { Transaction } from '@/Transaction.js'
import type mongodb from 'mongodb'
export class Db {
  readonly connection: Connection
  readonly $: mongodb.Db
  constructor(connection: Connection, dbName?: string, options?: mongodb.DbOptions) {
    this.connection = connection
    this.$ = this.connection.$.db(dbName, options)
  }

  get name() {
    return this.$.databaseName
  }

  tx(options?: mongodb.ClientSessionOptions) {
    return new Transaction(this, options)
  }

  collection<M extends Model>(model: Model.Constructor<M>, config?: Omit<Collection.Config<M>, 'model' | 'db'>) {
    return new Collection({
      ...config,
      db: this,
      model,
    })
  }
}
