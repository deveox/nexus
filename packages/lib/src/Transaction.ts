import type { Db } from '@/Db.js'
import type mongodb from 'mongodb'
export class Transaction {
  readonly db: Db
  readonly session: mongodb.ClientSession

  constructor(db: Db, options?: mongodb.ClientSessionOptions) {
    this.db = db
    this.session = this.db.connection.$.startSession(options)
    this.session.startTransaction()
  }

  async commit() {
    await this.session.commitTransaction()
    await this.session.endSession()
  }

  async abort() {
    await this.session.abortTransaction()
    await this.session.endSession()
  }
}
