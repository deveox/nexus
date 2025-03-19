# Contributing to Regula

Thank you for considering contributing to Regula! This document outlines the process for contributing to the project and how to use our commit message guidelines to ensure automated versioning works correctly.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `bun install`
3. Make your changes in a new branch
4. Run tests: `cd packages/lib && bun test`
5. Run linter: `cd packages/lib && bun run lint`

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for semantic versioning and automated changelog generation. Each commit message should be structured as follows:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

The commit type determines how your changes affect semantic versioning:

- `feat`: A new feature (triggers a MINOR version bump)
- `fix`: A bug fix (triggers a PATCH version bump)
- `docs`: Documentation changes only
- `style`: Changes that don't affect the code's meaning (whitespace, formatting, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Code changes that improve performance
- `test`: Adding missing or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools
- `ci`: Changes to CI configuration files and scripts
- `build`: Changes that affect the build system or external dependencies

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` at the beginning of the body or footer section, or append a `!` after the type/scope. This will trigger a MAJOR version bump.

Example:
```
feat(api)!: remove deprecated endpoints

BREAKING CHANGE: The /v1/legacy endpoint has been removed. Use /v2/new instead.
```

## Submitting Changes

1. Commit your changes using the conventional commit format:
   ```
   bun run commit
   ```
   This will guide you through creating a properly formatted commit message.

2. Push your changes to your fork
3. Submit a pull request

Thank you for your contribution!