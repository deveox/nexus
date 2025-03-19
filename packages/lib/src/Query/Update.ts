import type { Model } from '@/Model.js'
import { Select } from '@/Query/Select.js'
import { Where } from '@/Query/Where.js'
import { RError } from '@/RError.js'
import type { Schema } from '@/Schema/index.js'
import type { Transaction } from '@/Transaction.js'
import { utils } from '@/utils/index.js'
import { DateTime } from 'luxon'
import type { Flatten } from 'mongodb'

export class Update<M extends Model> extends Where<M> {
  async save(model: M, tx?: Transaction) {
    if (this.collection.beforeUpdate || this.collection.afterUpdate) {
      const transaction = tx ?? this.collection.db.tx()
      try {
        await this.collection.beforeUpdate?.(transaction, model)
        const req = this.prepareChanges(model)
        await this.collection.$.updateOne({ _id: model.id }, req, { session: transaction.session })
        await this.collection.afterUpdate?.(transaction, model)
      } catch (e) {
        if (!tx) {
          // Rollback transaction if it was created in this method
          await transaction.abort()
        }
        throw e
      }
    } else {
      const req = this.prepareChanges(model)
      await this.collection.$.updateOne({ _id: model.id }, req)
    }
    return model
  }

  async one(data: M['schema']['_update'], tx?: Transaction) {
    const model = await new Select(this).one(tx)
    model.set(data)
    return this.save(model, tx)
  }

  async saveMany(models: M[], tx?: Transaction) {
    if (this.collection.beforeUpdate || this.collection.afterUpdate) {
      const transaction = tx ?? this.collection.db.tx()
      try {
        const reqs = []
        for (const m of models) {
          await this.collection.beforeUpdate?.(transaction, m)
          reqs.push({ updateOne: { filter: { _id: m.id }, update: this.prepareChanges(m) } })
        }

        await this.collection.$.bulkWrite(reqs, { session: transaction.session })
        if (this.collection.afterUpdate) {
          for (const m of models) {
            await this.collection.afterUpdate?.(transaction, m)
          }
        }
      } catch (e) {
        if (!tx) {
          // Rollback transaction if it was created in this method
          await transaction.abort()
        }
        throw e
      }
    } else {
      const reqs = models.map(m => ({ updateOne: { filter: { _id: m.id }, update: this.prepareChanges(m) } }))
      await this.collection.$.bulkWrite(reqs)
    }
    return models
  }

  async many(data: M['schema']['_update'], tx?: Transaction) {
    const models = await new Select(this).many(data)
    for (const m of models) {
      m.set(data)
    }
    return this.saveMany(models, tx)
  }

  protected prepareChanges(model: M): Update.Request<M> {
    const changes = model.changes
    if (Object.keys(changes).length === 0) {
      throw new RError('No changes to save')
    }

    const serialized = this.collection.database.serialize('update', model)
    const $set = {} as Update.Request<M>['$set']
    const $unset = {} as Update.Request<M>['$unset']
    for (const [key, value] of Object.entries(changes)) {
      if (value) {
        if (value.newValue === undefined) {
          ;($unset[key] as any) = ''
        } else {
          $set[key] = utils.get(serialized, key)
        }
      }
    }
    const schema = this.collection.schema as Schema.TModel
    if (schema.updatedAt) {
      $set[schema.updatedAt] = DateTime.now().toJSDate()
    }
    return { $set, $unset }
  }
}

export namespace Update {
  export interface Request<M extends Model> {
    $set: Flatten<M['schema']['_update']>
    $unset: Record<keyof Flatten<M['schema']['_update']>, string>
  }
}
