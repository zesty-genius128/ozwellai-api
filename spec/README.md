# Ozwell API Specification

Read the [TypeScript-First](TypeScript-First.md) Approach.


This directory contains the canonical Zod-based API specification for the Ozwell API.

## Structure

- `index.ts` - Main export file containing all Zod schemas and TypeScript types
- `package.json` - Package configuration with Zod dependency
- `tsconfig.json` - TypeScript configuration for building the spec
- `dist/` - Compiled JavaScript and type definitions (generated)

## Usage Patterns

### Most Common: Git Submodule (Recommended)

For most use cases, you'll want to include this entire repository as a Git submodule to get both the specification and reference server:

```bash
git submodule add https://github.com/mieweb/ozwellai-api.git
```

This gives you access to:
- The complete API specification in `/spec`
- The reference Fastify server implementation in `/reference-server`
- All documentation and examples

### Less Common: NPM Package for Spec Only

If you only need the Zod schemas (rare), you can install just the spec:

```bash
npm install @mieweb/ozwellai-spec
```

```typescript
import { ChatCompletionRequestSchema, ChatCompletionResponseSchema } from '@mieweb/ozwellai-spec';
```

### End-User Client Usage

Most end users won't interact with this spec directly. They'll use the main client library:

```typescript
// ES Modules
import OzwellAI from "ozwellai";

// Or in CommonJS:
// const OzwellAI = require("ozwellai");

const client = new OzwellAI({
  apiKey: process.env.OZWELLAI_API_KEY, // best practice: load from env
});
```

## Local Development

### Installing Dependencies

```bash
npm install
```

### Building

```bash
npm run build
```

### Development (Watch Mode)

```bash
npm run dev
```

## Importing from Other Projects

### From TypeScript Projects (Direct Schema Import)

```typescript
import { ChatCompletionRequestSchema, ChatCompletionResponseSchema } from '../../../spec';
// or if using this as a package:
import { ChatCompletionRequestSchema, ChatCompletionResponseSchema } from '@mieweb/ozwellai-spec';
```

### Client Usage Pattern

For end-user applications, the recommended usage pattern is:

```typescript
// ES Modules
import OzwellAI from "ozwellai";

// Or in CommonJS:
// const OzwellAI = require("ozwellai");

const client = new OzwellAI({
  apiKey: process.env.OZWELLAI_API_KEY, // best practice: load from env
});
```

## Schemas Included

- **Common schemas**: `MessageSchema`, `ModelSchema`, `ErrorSchema`
- **Chat completions**: `ChatCompletionRequestSchema`, `ChatCompletionResponseSchema`, `ChatCompletionChunkSchema`
- **Embeddings**: `EmbeddingRequestSchema`, `EmbeddingResponseSchema`
- **Files**: `FileObjectSchema`, `FileListResponseSchema`
- **Models**: `ModelsListResponseSchema`
- **Responses**: `ResponseRequestSchema`, `ResponseSchema` (custom endpoint)

All schemas export both the Zod schema and corresponding TypeScript types.

# History on why we chose this workflow

https://chatgpt.com/share/68d47683-1e00-8004-9936-c5b05e2bab7a
