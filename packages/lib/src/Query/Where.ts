import type { Filter } from './Filter.js'
import type { Flatten } from '@/utils/Flatten.js'
import type { Model } from '@/Model.js'
import { Base } from '@/Query/Base.js'

export class Where<M extends Model> extends Base.Query<M> {
  /**
   * The `$all` operator selects the documents where the value of a field is an array that contains all the specified elements.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/all/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param value - An array of values to match against.
   */
  all<K extends keyof Flatten<M['$']> & string>(path: K, value: Flatten<M['$']>[K] extends (infer R)[] ? R[] : never[]): this {
    return this.set(path, '$all', value)
  }

  /**
   * The `$and` operator performs a logical `AND` operation on an array of  `expressions` and selects the documents that satisfy all the `expressions`.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/and/)
   * @param expressions - Array of filters (expressions)
   */
  and(expressions: Filter<M['$']>[]) {
    if (this.filter.$and) {
      this.filter.$and.push(...expressions)
    } else {
      this.filter.$and = expressions
    }
    return this
  }

  /**
   * The `$or` operator performs a logical `OR` operation on an array of `expressions` and selects the documents that satisfy at least one of the `expressions`.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/or/)
   * @param expressions - Array of filters (expressions)
   */
  or(expressions: Filter<M['$']>[]): this {
    if (this.filter.$or) {
      this.filter.$or.push(...expressions)
    } else {
      this.filter.$or = expressions
    }
    return this
  }

  /**
   * `$nor` performs a logical `NOR` operation on an array of expressions and selects the documents that **fail** all the expressions.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/nor/)
   * @param expressions - Array of filters (expressions)
   */
  nor(expressions: Filter<M['$']>[]): this {
    if (this.filter.$nor) {
      this.filter.$nor.push(...expressions)
    } else {
      this.filter.$nor = expressions
    }
    return this
  }

  /**
   * The `$elemMatch` operator matches documents that contain an array field with at least one element that matches all the specified query criteria.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/elemMatch/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param expression - The query criteria to match.
   */
  elemMatch<K extends keyof Flatten<M['$']>>(path: K, expression: Flatten<M['$']>[K]): this {
    return this.set(path, '$elemMatch', expression as any)
  }

  /**
   * The `$exists` operator matches documents that contain or do not contain a specified field.
   * If field value is `null`, it will be considered to exist.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/exists/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param shouldExist - If `true`, `$exists` matches the documents that contain the field, if `false`, the documents that do not contain the field.
   */
  exists(path: keyof Flatten<M['$']>, shouldExist: boolean) {
    return this.set(path, '$exists', shouldExist)
  }

  /**
   * `$gt` selects those documents where the field is greater than (i.e. `>`) the specified value.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/gt/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param value - The value to check against.
   */
  gt<K extends keyof Flatten<M['$']>>(path: K, value: Flatten<M['$']>[K]) {
    return this.set(path, '$gt', value)
  }

  /**
   * `$gte` selects the documents where the field is greater than or equal to (i.e. `>=`) a specified value.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/gte/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param value - The value to check against.
   */
  gte<K extends keyof Flatten<M['$']>>(path: K, value: Flatten<M['$']>[K]) {
    return this.set(path, '$gte', value)
  }

  /**
   * `$lt` selects the documents where the field is less than (i.e. `<`) the specified value.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/lt/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param value - The value to check against.
   */
  lt<K extends keyof Flatten<M['$']>>(path: K, value: Flatten<M['$']>[K]) {
    return this.set(path, '$lt', value)
  }

  /**
   * `$lte` selects the documents where the field is less than or equal to (i.e. `<=`) the specified value.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/lte/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param value - The value to check against.
   */
  lte<K extends keyof Flatten<M['$']>>(path: K, value: Flatten<M['$']>[K]) {
    return this.set(path, '$lte', value)
  }

  /**
   * The `$in` operator selects the documents where the field equals to at least one value in the specified array.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/in/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param values - Array of values to match against.
   */
  in<K extends keyof Flatten<M['$']>>(path: K, values: Flatten<M['$']>[K][]): this {
    return this.set(path, '$in', values)
  }

  /**
   * The `$nin` operator selects the documents where the field doesn't exist or the field value is not in the specified array.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/nin/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param values - Array of values to match against.
   */
  nin<K extends keyof Flatten<M['$']>>(path: K, values: Flatten<M['$']>[K][]): this {
    return this.set(path, '$nin', values)
  }

  /**
   * `$eq` selects the documents where the field is equal to the specified value.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/eq/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param value - The value to check against.
   */
  eq<K extends keyof Flatten<M['$']>>(path: K, value: Flatten<M['$']>[K]): this {
    return this.set(path, '$eq', value)
  }

  /**
   * `$ne` selects the documents where the field is not equal to the specified value.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/ne/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param value - The value to check against.
   */
  ne<K extends keyof Flatten<M['$']>>(path: K, value: Flatten<M['$']>[K]): this {
    return this.set(path, '$ne', value)
  }

  /**
   * `$mod` selects documents where the value of a field divided by a divisor has the specified remainder.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/mod/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param divisor - The divisor.
   * @param remainder - The remainder.
   */
  mod<K extends Flatten.Keys<M['$']>>(
    path: K,
    divisor: Flatten.Value<M['$'], K> extends number ? number : never, // if field type is not a number, use of this function should not be allowed
    remainder: Flatten.Value<M['$'], K> extends number ? number : never // if field type is not a number, use of this function should not be allowed
  ) {
    return this.set(path, '$mod', [divisor, remainder])
  }

  /**
   * `$regex` selects documents where field value matches the specified regular expression.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/regex/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param regexp - The regular expression to match against.
   */
  regex<K extends Flatten.Keys<M['$']>>(
    path: K,
    regexp: Flatten.Value<M['$'], K> extends string ? RegExp : never // if field type is not a string, use of this function should not be allowed
  ) {
    return this.set(path, '$regex', regexp)
  }

  /**
   * `$size` selects documents if the field value is an array with the specified length.
   * [MongoDB Documentation](https://docs.mongodb.com/manual/reference/operator/query/size/)
   * @param path - The field to check. Can be a path to a nested field.
   * @param length - The array length to check against.
   */
  // biome-ignore lint/suspicious/noExplicitAny: it's ok to use any in extends clause
  size<K extends keyof Flatten<M['$']>>(path: K, length: Flatten<M['$']>[K] extends any[] ? number : never) {
    return this.set(path, '$size', length)
  }
}
