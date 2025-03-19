import { Db } from '@/Db.js'
import mongodb from 'mongodb'

export class Connection {
  readonly $: mongodb.MongoClient
  constructor(uri: string, options?: mongodb.ConnectOptions) {
    this.$ = new mongodb.MongoClient(uri, options)
  }

  async connect() {
    await this.$.connect()
  }

  async disconnect() {
    await this.$.close()
  }

  db(name?: string, options?: mongodb.DbOptions) {
    return new Db(this, name, options)
  }
}
