# Ozwell Public API Specification Repository

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information in the instructions is incomplete or found to be in error.**

## Repository Overview
This public repository for Ozwell API is the canonical reference for the API, enabling both internal and external teams to build against a stable, well-documented contract.
The Ozwell API specification project is an open and reliable source of truth for all Ozwell API interactions. All types and endpoints are defined using [Zod](https://github.com/colinhacks/zod), ensuring type safety, clarity, and consistency. 

## Working Effectively
Make sure your code fits within the Planned Directory Structure (from README.md)
Use a single TypeScript codebase with ESM-first design, build outputs for both ESM and CJS along with type definitions, publish to npm for Node users, and also publish to JSR to provide first-class DX for Deno, while ensuring compatibility by testing across Node and Deno in CI.


## Working with Specifications

### When Creating Zod Definitions
- Update the `/spec` directory first.
- Use TypeScript files with `.ts` extension
- Follow Zod best practices for type definitions
- Document any Ozwell-specific extensions clearly

### When Adding New Endpoints
- Always reference the OpenAI API documentation for compatibility
- Add IndexedCP-specific endpoints separately from OpenAI-compatible ones
- Include conversation management endpoints for multi-user scenarios
- Document the purpose and usage of each endpoint

### When Setting Up Build System
- Use Node.js/npm ecosystem (inferred from .gitignore patterns)
- Include TypeScript compilation for Zod definitions
- Set up OpenAPI generation from Zod schemas
- Configure linting and formatting tools

## Validation Steps

### Before Making Changes
- Read README.md thoroughly to understand current project state
- Check if planned directories exist yet: `ls -la`
- Understand which development phase the repository is in

### After Creating New Structure
- Validate directory structure matches README.md documentation
- Ensure new files follow the established patterns
- Update documentation if directory structure changes

### Future Build/Test Commands (When Implemented)
These commands will be added once the build system is established:
- Install dependencies: `npm install` (when package.json exists)
- Run type checking: `npm run type-check` (when configured)
- Generate OpenAPI docs: `npm run generate-docs` (when configured)  
- Run validation: `npm run validate` (when configured)
- Run tests: `npm test` (when test suite exists)

## Key Files and Locations

### Current Files
- `README.md` - Project overview and planned structure
- `LICENSE` - Apache 2.0 license
- `.gitignore` - Node.js focused ignore patterns
- `.github/copilot-instructions.md` - This file

### Future Important Locations
- `/spec/` - Core API type definitions (Zod schemas)
- `/reference-server/` - Fastify test server implementation
- `/docs/` - Generated OpenAPI/Swagger documentation
- `/clients/typescript/` - TypeScript client library
- `/clients/python/` - Python client library
- `/scripts/` - Build and utility scripts
- `/tests/` - Test cases and fixtures
- `CONTRIBUTING.md` - Contribution guidelines (planned)

## Common Tasks

### Repository Exploration
```bash
# View all files
ls -la

# Find all markdown files  
find . -name "*.md" -type f

# Check for development indicators
grep -r "TODO\|HACK\|FIXME" . || true

# View project overview
cat README.md | head -20
```

Always reference README.md for the most current project status and priorities.
