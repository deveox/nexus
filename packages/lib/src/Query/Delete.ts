import type { Model } from '@/Model.js'
import { Select } from '@/Query/Select.js'
import { Where } from '@/Query/Where.js'
import type { Transaction } from '@/Transaction.js'

export class Delete<M extends Model> extends Where<M> {
  async one(tx?: Transaction) {
    const model = await new Select(this).one(tx)
    if (this.collection.beforeDelete || this.collection.afterDelete) {
      const transaction = tx ?? (await this.collection.db.tx())
      try {
        await this.collection.beforeDelete?.(transaction, model)
        await this.collection.$.deleteOne({ _id: model.id }, { session: transaction.session })
        await this.collection.afterDelete?.(transaction, model)
        await transaction.commit()
      } catch (error) {
        if (!tx) {
          // make sure to abort the transaction if it was created here
          await transaction.abort()
        }
        throw error
      }
    } else {
      await this.collection.$.deleteOne({ _id: model.id }, { session: tx?.session })
    }
    return model
  }

  async many(tx?: Transaction) {
    const models = await new Select(this).many(tx)
    const ids = models.map(model => model.id)
    if (models.length) {
      if (this.collection.beforeDelete || this.collection.afterDelete) {
        const transaction = tx ?? (await this.collection.db.tx())
        try {
          for (const model of models) {
            await this.collection.beforeDelete?.(transaction, model)
          }
          await this.collection.$.deleteMany(
            {
              _id: { $in: ids },
            },
            { session: transaction.session }
          )
          for (const model of models) {
            await this.collection.afterDelete?.(transaction, model)
          }
          await transaction.commit()
        } catch (error) {
          if (!tx) {
            // make sure to abort the transaction if it was created here
            await transaction.abort()
          }
          throw error
        }
      } else {
        await this.collection.$.deleteMany({ _id: { $in: ids } }, { session: tx?.session })
      }
    }
    return models
  }
}
