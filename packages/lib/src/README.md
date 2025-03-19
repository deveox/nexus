# ORM
ORM is a wrapper around the `mongoose` library that dramatically improves the type safety and reduces the boilerplate code required to define schemas.

Before you dive into the ORM code, it's recommended to read the `@deepkit/type` documentation. The ORM is built on top of this library, and understanding it will help you understand the ORM better.


## Schema Creation
The core goal of the ORM is to reduce the boilerplate code required to define schemas. The crucial part in this process is handled by `@deepkit/type` library. It allows us to translate TypeScript types into runtime code.

ORM does the following:
1. Uses `@deepkit/type` to translate TypeScript types into runtime code.
2. Uses the resulting runtime information to define `mongoose` schema.
3. Provides a type decorators (a.k.a **Annotations** in `@deepkit/type` terminology), which can be used to define non-trivial schema properties.
4. Provides a type-safe way to define additional schema properties, such as indexes, virtuals, and methods.

## Type-Safe wrapper
The ORM provides a type-safe wrapper around the `mongoose` library. The wrapper includes:
- Type-safe wrapper around `mongoose.Query`
- Type-safe wrapper around `mongoose.Model`
- Type-safe wrapper around `mongoose.Document`

Though the wrapper is much more type-safe than the original `mongoose` library, it is not 100% type-safe. The main reason for this is `mongoose` API design which is limiting. Also, the underlying `mongodb` driver is far from being type-safe, which creates additional issues.

What our wrapper **improves**:
- Stricter function signatures.
- Reduces different ways to do the same thing.
- Infers types for nested query selectors (e.g. `{ 'user.name': 'John' }`).
- Better type inference for `populate`.

What our wrapper **does not improve**:
- Aggregations.
- `mongoose` API design.
- Performance (it's roughly the same as the original `mongoose` library).


## Maintenance considerations
The only concern with the ORM maintenance is major `mongoose` updates. If such updates happen, we need to check that ORM wrappers and schema translation work correctly. This should not be a big issue, as `mongoose` is a mature library and does not have frequent breaking changes.