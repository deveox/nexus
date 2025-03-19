import type { Model } from '@/Model.js'
import { Base } from '@/Query/Base.js'
import type { Schema } from '@/Schema/index.js'
import { DateTime } from 'luxon'
import type { Transaction } from '@/Transaction.js'
import { ObjectId } from 'mongodb'
import { RError } from '@/RError.js'
export class Create<M extends Model> extends Base<M> {
  protected async beforeCreate(tx: Transaction, data: M['schema']['_create']): Promise<M> {
    const input = await this.collection.beforeCreate(tx, data)
    input.$._id = new ObjectId()
    const schema = this.collection.schema as Schema.TModel
    if (schema.createdAt) {
      input.$[schema.createdAt] = DateTime.now()
    }
    if (schema.updatedAt) {
      input.$[schema.updatedAt] = DateTime.now()
    }
    const res = schema.safeParse(input)
    if (!res.success) {
      throw new RError(res.error.message, 422)
    }
    return this.collection.new(res.data as M['$'])
  }

  async one(data: M['schema']['_create'], tx?: Transaction): Promise<M> {
    const transaction = tx ?? (await this.collection.db.tx())
    try {
      const model = await this.beforeCreate(transaction, data)
      await this.collection.$.insertOne(model, { session: transaction.session })
      await this.collection.afterCreate?.(transaction, model)
      return model
    } catch (e) {
      if (!tx) {
        // Rollback transaction if it was created in this method
        await transaction.abort()
      }
      throw e
    }
  }

  async many(data: M['schema']['_create'][], tx?: Transaction): Promise<M[]> {
    const transaction = tx ?? (await this.collection.db.tx())
    try {
      const models: M[] = []
      for (const doc of data) {
        const model = await this.beforeCreate(transaction, doc)
        models.push(model)
      }
      await this.collection.$.insertMany(models, { session: transaction.session })
      for (const model of models) {
        await this.collection.afterCreate?.(transaction, model)
      }
      return models
    } catch (e) {
      if (!tx) {
        // Rollback transaction if it was created in this method
        await transaction.abort()
      }
      throw e
    }
  }
}
