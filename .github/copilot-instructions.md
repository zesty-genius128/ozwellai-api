# Ozwell Public API Specification Repository

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information in the instructions is incomplete or found to be in error.**

## Repository Overview

The Ozwell Public API Specification is an API specification repository that defines OpenAI-compatible endpoints using Zod type definitions. This repository is currently in early development phase with planned structure documented but not yet implemented.

## Working Effectively

### Current Repository State
- **IMPORTANT**: This repository is in early specification/planning phase
- Only basic files exist: README.md, LICENSE, .gitignore, and this instruction file
- Planned directory structure exists in README.md but directories are not created yet
- No build system, dependencies, or runnable code exists currently

### Essential Commands (Validated)
Navigate and explore the repository:
```bash
cd /home/runner/work/ozwellai-api/ozwellai-api
ls -la
cat README.md
find . -name "*.md" -type f
grep -r "TODO\|HACK\|FIXME" . || true
```

View repository structure and documentation:
```bash
cat README.md | head -20  # View project overview
cat LICENSE  # View Apache 2.0 license
cat .gitignore  # View ignored file patterns
```

## Planned Directory Structure (from README.md)

The repository will eventually contain:
```
/spec                # Zod type definitions and endpoint specs (the core API contract)
/reference-server    # Fastify server stub for reference/testing  
/clients
  /typescript        # TypeScript client implementation
  /python            # Python client implementation
/docs                # Generated OpenAPI/Swagger docs and usage guides
/scripts             # Utility scripts (e.g., for codegen, validation)
/tests               # Shared test cases and fixtures
README.md
CONTRIBUTING.md
LICENSE
```

## Development Phases

### Phase 1: Core Specification (Current Phase)
- Define all base types using Zod
- Implement endpoint definitions (call-for-call with OpenAI)
- Add IndexedCP upload endpoints for reliable file delivery
- Add conversation management/sharing endpoints

### Phase 2: Documentation
- Set up OpenAPI generation from Zod
- Integrate Swagger UI for interactive docs  
- Write usage examples for each endpoint

### Phase 3: Client Implementations
- TypeScript client: auto-generate types and API calls from spec
- Python client: mirror TypeScript client functionality

### Phase 4: Reference Implementation
- Add Fastify server stub that returns hard-coded responses for all endpoints
- Document how to use the server stub for local testing and integration

## Working with Specifications

### When Creating Zod Definitions
- Create the `/spec` directory first: `mkdir -p spec`
- Use TypeScript files with `.ts` extension
- Follow Zod best practices for type definitions
- Ensure OpenAI API compatibility for standard endpoints
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

### Directory Structure Setup (When Needed)
```bash
# Create planned directory structure
mkdir -p spec reference-server clients/typescript clients/python docs scripts tests

# Verify structure
ls -la
```

### File Content Reference
Output from `ls -la` in repository root:
```
total 40
drwxr-xr-x 4 runner docker  4096 Aug 17 19:56 .
drwxr-xr-x 3 runner docker  4096 Aug 17 19:54 ..
drwxr-xr-x 7 runner docker  4096 Aug 17 19:56 .git
drwxr-xr-x 2 runner docker  4096 Aug 17 19:56 .github
-rw-r--r-- 1 runner docker  2152 Aug 17 19:54 .gitignore
-rw-r--r-- 1 runner docker 11357 Aug 17 19:54 LICENSE
-rw-r--r-- 1 runner docker  4631 Aug 17 19:54 README.md
```

## Project Characteristics

### Technology Stack (Planned)
- **Type System**: Zod for runtime type validation and TypeScript integration
- **API Documentation**: OpenAPI/Swagger generated from Zod definitions
- **Reference Server**: Fastify for lightweight, fast API stub
- **Client Libraries**: TypeScript (primary), Python (secondary)
- **Build System**: Node.js/npm ecosystem
- **Compatibility**: OpenAI API call-for-call compatibility

### Development Principles
- **Single Source of Truth**: Zod definitions drive everything
- **OpenAPI Generation**: Documentation auto-generated from types
- **Implementation Agnostic**: Specification independent of implementation
- **Community Driven**: Open, transparent development process
- **Extensible**: Support for enhanced features beyond OpenAI compatibility

### API Extensions Beyond OpenAI
- IndexedCP upload endpoints for reliable file delivery
- Conversation management and sharing endpoints  
- Multi-user contribution support for shared conversations
- Enhanced authentication methods (planned)
- Advanced conversation analytics (planned)

## Next Development Steps

Based on the README.md To-Do list, the immediate priorities are:

1. **Core Specification Phase**:
   - Define base types using Zod
   - Implement OpenAI-compatible endpoint definitions
   - Add IndexedCP upload endpoints
   - Add conversation management endpoints

2. **Setup Development Environment**:
   - Create `package.json` with TypeScript and Zod dependencies
   - Set up TypeScript configuration
   - Configure build and validation scripts

3. **Documentation Setup**:
   - Set up OpenAPI generation from Zod
   - Configure Swagger UI integration
   - Create usage examples

Always reference README.md for the most current project status and priorities.