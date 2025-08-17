# Ozwell API Specification

This directory contains the canonical Zod-based API specification for the Ozwell API.

## Structure

- `index.ts` - Main export file containing all Zod schemas and TypeScript types
- `package.json` - Package configuration with Zod dependency
- `tsconfig.json` - TypeScript configuration for building the spec
- `dist/` - Compiled JavaScript and type definitions (generated)

## Usage

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

From the reference server or other TypeScript projects:

```typescript
import { ChatCompletionRequestSchema, ChatCompletionResponseSchema } from '../../../spec';
// or if using this as a package:
import { ChatCompletionRequestSchema, ChatCompletionResponseSchema } from '@ozwell/api-spec';
```

## Schemas Included

- **Common schemas**: `MessageSchema`, `ModelSchema`, `ErrorSchema`
- **Chat completions**: `ChatCompletionRequestSchema`, `ChatCompletionResponseSchema`, `ChatCompletionChunkSchema`
- **Embeddings**: `EmbeddingRequestSchema`, `EmbeddingResponseSchema`
- **Files**: `FileObjectSchema`, `FileListResponseSchema`
- **Models**: `ModelsListResponseSchema`
- **Responses**: `ResponseRequestSchema`, `ResponseSchema` (custom endpoint)

All schemas export both the Zod schema and corresponding TypeScript types.
