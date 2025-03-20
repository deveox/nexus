---
seo:
  title: Nexus - TypeScript ORM
  description: Nexus is database-agnostic TypeScript ORM with emphasis on strong type-safety and simplicity.
---

::u-page-hero
---
orientation: vertical
---

#title
Focus on Application, Not Database


#description
Nexus is a type-safe ORM that puts your application logic first, letting you model your domain naturally in TypeScript while seamlessly connecting to your database of choice.

::div{class="inline-flex items-stretch gap-4 mx-auto"}
  ::div{class="w-60"}
    ::prose-pre{filename="Terminal" code="npm i @deveox/nexus"}
    ```bash
    npm i @deveox/nexus
    ```
    ::
  ::
  ::div{class="my-5 flex items-stretch"}
    ::u-button
    ---
    size: xl
    to: /getting-started
    trailing-icon: i-lucide-arrow-right
    ---
    Get started
    ::
  ::
::


::

::u-page-section{style="background: #141d31;"}
#title
Supercharged with Features

#links
  :::u-button
  ---
  color: neutral
  size: lg
  target: _blank
  to: /getting-started/
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Discover Nexus Beta
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-trophy
  ---
  #title
  App-First Approach

  #description
  
  Model your business entities naturally according to your application's needs, with database concerns abstracted away so you can focus on solving real problems.
  :::

  :::u-page-feature
  ---
  icon: i-simple-icons-typescript
  ---
  #title
  Type-Safe 

  #description
  Define your models with fully typed TypeScript-first approach and catch errors at compile time!
  :::

  :::u-page-feature
  ---
  icon: i-lucide-database
  ---
  #title
  Database Agnostic

  #description
  Connect to MongoDB today with PostgreSQL and other databases coming soon - your application code remains unchanged.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-book-lock
  ---
  #title
  Repository Pattern

  #description
  Clean architecture with repository pattern implementation for clear separation between your domain models and data access logic.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-blocks
  ---
  #title
  Schema Composition

  #description
  Compose, extend, and reuse schemas with a Zod-like API that promotes code reusability and DRY principles.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-network
  ---
  #title
  Advanced Data Modeling

  #description
  Support for sophisticated modeling techniques including discriminated unions, single table inheritance, and polymorphic relationships to handle complex data structures.

  :::
::
