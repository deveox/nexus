/**
 * By convention, a type annotation is defined to be an object literal with a single optional property `__t` that should be a string literal.
 * Annotations serve as hints for the type system and are not used at runtime.
 *
 * Typescript evaluates intersection between object literal and primitive types as primitive type, e.g. `string & { __t: 'readonly' }` is compatible with `string`.
 * @example
 * export type Readonly<T> = T & { __t?: 'readonly' };
 */
export type Annotation<Name extends string = string> = { __t?: Name }
export namespace Annotation {
  export type Has<T, A extends Annotation> = T extends A
    ? T extends { __t?: infer TT }
      ? TT extends A['__t']
        ? true
        : false
      : false
    : false

  export type Remove<T> = Has<T, Annotation> extends true ? Omit<T, '__t'> : T
  export type Readonly = Annotation<'readonly'>
}
