import { type EImmutable, immutable } from '@/Schema/EScoped.js'
import { TDate } from '@/Schema/TDate.js'
import { TObject } from '@/Schema/TObject.js'
import { TObjectId } from '@/Schema/TObjectId.js'

export class TModel<
  P extends TObject.Properties = TObject.Properties,
  CreatedAt extends true | string = never,
  UpdatedAt extends true | string = never,
> extends TObject<P & TModel.Properties<CreatedAt, UpdatedAt>> {
  createdAt?: CreatedAt
  updatedAt?: UpdatedAt
  constructor(properties: P, def?: TModel.Def<CreatedAt, UpdatedAt>) {
    const props = {
      ...properties,
      _id: immutable(new TObjectId()),
    } as TObject.Properties
    const createdAt = def?.createdAt === true ? 'createdAt' : def?.createdAt
    if (createdAt) {
      props[createdAt as string] = immutable(new TDate())
    }
    const updatedAt = def?.updatedAt === true ? 'updatedAt' : def?.updatedAt
    if (updatedAt) {
      props[updatedAt as string] = new TDate()
    }
    super(props as P & TModel.Properties<CreatedAt, UpdatedAt>)
    this.createdAt = createdAt as CreatedAt
    this.updatedAt = updatedAt as UpdatedAt
  }
}

export namespace TModel {
  export type PrimaryKey = EImmutable<TObjectId>
  export type Properties<CreatedAt extends true | string = never, UpdatedAt extends true | string = never> = {
    _id: PrimaryKey
  } & {
    [K in CreatedAt as CreatedAt extends true ? 'createdAt' : CreatedAt extends string ? CreatedAt : never]: EImmutable<TDate>
  } & {
    [K in UpdatedAt as UpdatedAt extends true ? 'updatedAt' : UpdatedAt extends string ? UpdatedAt : never]: TDate
  }

  export interface Def<CreatedAt extends true | string = never, UpdatedAt extends true | string = never> {
    createdAt?: CreatedAt
    updatedAt?: UpdatedAt
  }
}
