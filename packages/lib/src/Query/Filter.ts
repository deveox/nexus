import { Flatten } from '@/utils/Flatten.js'
import { Unparsable } from '@/utils/index.js'
import type mongodb from 'mongodb'

export type Filter<T> = {
  [K in keyof Flatten<T>]?: Filter.Condition<Flatten<T>[K]>
}
export namespace Filter {
  export type Operators<T> = {
    [K in keyof mongodb.FilterOperators<T> as string extends K ? never : K]?: mongodb.FilterOperators<T>[K]
  }

  export type Operator = keyof Operators<any>

  export type Condition<T> = T extends Unparsable | any[]
    ? Operators<T>
    : {
        [K in keyof T]?: Condition<T[K]>
      } & Operators<T>

  export type Root<T> = Filter<T> & {
    $and?: Filter<T>[]
    $nor?: Filter<T>[]
    $or?: Filter<T>[]
  }
}
