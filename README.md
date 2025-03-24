<div align="center">
  <a href="https://nexus.deveox.com/">
    <picture>
        <img height="80" width="auto" alt="TypeORM Logo" src="https://github.com/deveox/nexus/raw/main/packages/docs/public/logo.svg">
    </picture>
  </a>
</div>


![npm](https://img.shields.io/npm/v/@deveox/nexus)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/deveox/nexus/publish-lib.yml)
![License](https://img.shields.io/npm/l/@deveox/nexus)
![npm downloads](https://img.shields.io/npm/dt/@deveox/nexus)

Nexus is a database-agnostic TypeScript ORM with an emphasis on strong type-safety and simplicity. It puts your application logic first, letting you model your domain naturally while seamlessly connecting to your database of choice.

## Key Features

- **App-First Approach** - Model your business entities naturally according to your application's needs
- **Type-Safe** - Fully typed TypeScript-first approach to catch errors at compile time
- **Database Agnostic** - Connect to MongoDB today with PostgreSQL coming soon
- **Repository Pattern** - Clean architecture with clear separation between models and data access
- **Schema Composition** - Compose, extend, and reuse schemas with a Zod-like API
- **Advanced Data Modeling** - Support for discriminated unions, single table inheritance, and polymorphic relationships

## Installation

```bash
npm install @deveox/nexus
```

## Quick Example

```typescript
import { n, model, db } from '@deveox/nexus'

// Define your schema
const schema = n.model({
  name: n.string(),
  email: n.string().email(),
  age: n.number().min(18),
}, {
  createdAt: true,
  updatedAt: true
})

// Create your model
export class User extends model(schema) {
  get fullName() {
    return `${this.$.name}`
  }
  
  greet() {
    console.log(`Hello, my name is ${this.$.name} and I'm ${this.$.age} years old.`)
  }
}

// Create collection
export const Users = db.collection(User)

// Use it!
const user = await Users.create().one({ 
  name: 'John Doe', 
  email: 'john@example.com', 
  age: 25 
})

user.greet() // Hello, my name is John Doe and I'm 25 years old.
```

## Documentation

For full documentation, visit [https://nexus.deveox.com](https://nexus.deveox.com)

## Sponsors

Become a gold sponsor and get premium technical support from our core contributors. 

[Churnkey - retention automation for self-serve subscription companies](https://churnkey.co/)


## License

MIT