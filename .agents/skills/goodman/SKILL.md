```markdown
# goodman Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `goodman` repository, a TypeScript codebase built on the Next.js framework. You'll learn how to structure files, write imports/exports, follow commit message patterns, and understand testing conventions. This guide is ideal for onboarding new contributors or maintaining consistency in collaborative development.

## Coding Conventions

### File Naming
- Use **camelCase** for filenames.
  - Example: `userProfile.ts`, `getUserData.tsx`

### Import Style
- Use **absolute imports** for modules.
  - Example:
    ```typescript
    import { fetchData } from 'utils/api'
    import UserCard from 'components/userCard'
    ```

### Export Style
- Prefer **named exports**.
  - Example:
    ```typescript
    // userProfile.ts
    export function getUserProfile(id: string) { ... }
    export const USER_ROLE = 'admin'
    ```

### Commit Messages
- Freeform style, sometimes with prefixes.
- Average commit message length: ~75 characters.
  - Example:
    ```
    Add user authentication middleware for protected routes
    Fix: correct typo in dashboard header
    ```

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- **Test File Pattern:** All test files use the `*.test.*` naming convention.
  - Example: `userProfile.test.ts`, `authHandler.test.tsx`
- **Testing Framework:** Not explicitly detected. Check project dependencies for specifics.
- **Test Example:**
  ```typescript
  // userProfile.test.ts
  import { getUserProfile } from 'userProfile'

  test('should return user data', () => {
    const user = getUserProfile('123')
    expect(user).toHaveProperty('name')
  })
  ```

## Commands

| Command | Purpose |
|---------|---------|
| /test   | Run all test files matching *.test.* pattern |
| /lint   | Run linter to check code style and formatting |
| /build  | Build the Next.js project for production |
```
