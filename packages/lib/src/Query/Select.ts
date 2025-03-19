import type { Flatten } from '@/utils/Flatten.js'
import type { Model } from '@/Model.js'
import { Where } from '@/Query/Where.js'
import type { Transaction } from '@/Transaction.js'
import { RError } from '@/RError.js'

export class Select<M extends Model> extends Where<M> {
  static DEFAULT_SORT: Select.Sort<Model> = { _id: 1 }

  #sort?: Select.Sort<M['$']>
  /**
   * Specifies the order in which the query returns matching documents.
   */
  sort(arg: Select.Sort<M['$']>) {
    this.#sort = { ...this.#sort, ...arg }
    return this
  }

  async maybeOne(tx?: Transaction): Promise<M | undefined> {
    const res = await this.collection.$.findOne(this.filter, { session: tx?.session, sort: this.#sort ?? Select.DEFAULT_SORT })
    if (res === null) {
      return undefined
    }
    return this.collection.database.deserialize(res)
  }

  async one(tx?: Transaction): Promise<M> {
    const res = await this.maybeOne(tx)
    if (res === undefined) {
      throw new RError(`${this.collection.modelName} not found`, 404)
    }
    return res
  }

  #limit?: number
  limit(value: number) {
    this.#limit = value
    return this
  }
  #offset?: number
  offset(value: number) {
    this.#offset = value
    return this
  }

  async many(tx?: Transaction): Promise<M[]> {
    const q = this.collection.$.find(this.filter, { session: tx?.session }).sort(this.#sort ?? Select.DEFAULT_SORT)
    if (this.#limit) {
      q.limit(this.#limit)
    }
    if (this.#offset) {
      q.skip(this.#offset)
    }
    const res = await q.toArray()
    for (let i = 0; i < res.length; i++) {
      // @ts-expect-error override array with hydrated models
      res[i] = this.collection.database.deserialize(res[i])
    }
    return res as unknown as M[]
  }

  async count(tx?: Transaction): Promise<number> {
    const res = await this.collection.$.countDocuments(this.filter, { session: tx?.session })
    return res
  }
}

export namespace Select {
  export type Sort<T> = { [K in keyof Flatten<T>]: Sort.Order }

  export namespace Sort {
    export type Order = 1 | -1
    export interface Options {
      override?: boolean
    }
  }
}
