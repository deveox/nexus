import { Collection } from '@/Collection.js'
import type { Model } from '@/Model.js'
import type { Filter } from './Filter.js'
import type { Flatten } from '@/utils/index.js'
import { clone, defaultsDeep } from '@/utils/index.js'
export class Base<M extends Model> {
  protected collection: Collection<M>

  constructor(collection: Collection<M>) {
    this.collection = collection
  }
}

export namespace Base {
  export class Query<M extends Model> extends Base<M> {
    filter: Filter.Root<M['$']>
    constructor(query: Query<M>)
    constructor(collection: Collection<M>)
    constructor(collectionOrQuery: Collection<M> | Query<M>, filter?: Filter.Root<M['$']>) {
      if (collectionOrQuery instanceof Collection) {
        super(collectionOrQuery)
        this.filter = clone(filter) ?? {}
      } else {
        super(collectionOrQuery.collection)
        this.filter = defaultsDeep(collectionOrQuery.filter, filter as any, true)
      }
    }

    set<K extends keyof Flatten<M['$']>, OP extends Filter.Operator>(path: K, op: OP, value: Filter.Operators<any>[OP]): this {
      if (this.filter[path]) {
        ;(this.filter[path] as any)[op] = value as any
      } else {
        this.filter[path] = { [op]: value } as Filter.Root<M['$']>[K]
      }
      return this
    }
  }
}
