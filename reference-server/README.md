# OzwellAI Reference Server

An OpenAI-compatible Fastify server that provides a reference implementation of the OzwellAI API. This server mimics the OpenAI REST API, allowing existing OpenAI SDKs and clients to work by only changing the `base_url` and `api_key`.

## Features

- **Full OpenAI API Compatibility**: Wire-compatible with OpenAI's API specification
- **Real Text Inference**: Proxies to a configurable Llama backend (Ollama by default)
- **Streaming Support**: Server-Sent Events (SSE) for both `/v1/responses` and `/v1/chat/completions`
- **File Management**: Complete file upload, download, and management system
- **Docker Support**: Multi-architecture Docker images with security best practices
- **CI/CD Ready**: Automated testing and publishing workflows
- **Swagger Documentation**: Interactive API docs at `/docs`
- **TypeScript**: Fully typed with Zod schema validation
- **No Database**: All data stored in JSON files under `/data`

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# (Optional) start Ollama in another terminal
# ollama serve

# Start development server
npm run dev
```

The server will start at `http://localhost:3000`

### Configure Llama Backend

The chat completion endpoint forwards requests to a Llama-compatible API. By default it targets a local Ollama instance at `http://localhost:11434/v1` and exposes the `llama3` model. You can override the target and models with environment variables:

| Variable | Description | Default |
| --- | --- | --- |
| `LLAMA_BASE_URL` | Base URL for the upstream OpenAI-compatible endpoint | `http://localhost:11434/v1` |
| `LLAMA_API_KEY` | Optional bearer token passed to the upstream API | _empty_ |
| `LLAMA_MODELS` | Comma-separated list of model ids to expose via `/v1/models` | `llama3` |

Example:

```bash
export LLAMA_BASE_URL="http://localhost:11434/v1"
export LLAMA_MODELS="llama3,llama3.1"
npm run dev
```

If you are using Ollama locally:

```bash
ollama pull llama3
ollama serve
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run spec` - Generate OpenAPI specification

## API Endpoints

### Models
- `GET /v1/models` - List available models

### Chat Completions  
- `POST /v1/chat/completions` - Create chat completion (supports streaming)

### Responses (New Primitive)
- `POST /v1/responses` - Generate response with semantic events streaming (uses the built-in deterministic generator)

### Embeddings
- `POST /v1/embeddings` - Generate text embeddings

### Files
- `POST /v1/files` - Upload file
- `GET /v1/files` - List files
- `GET /v1/files/{id}` - Get file metadata
- `GET /v1/files/{id}/content` - Download file content
- `DELETE /v1/files/{id}` - Delete file

### Documentation
- `GET /docs` - Swagger UI documentation
- `GET /openapi.json` - OpenAPI 3.1 specification
- `GET /health` - Health check

## Authentication

The server accepts any Bearer token for testing purposes:

```bash
Authorization: Bearer your-test-key-here
```

## Example Usage

### Using curl

#### List Models
```bash
curl -H "Authorization: Bearer test" http://localhost:3000/v1/models
```

#### Chat Completion (Non-streaming)
```bash
curl -H "Authorization: Bearer test" \
     -H "Content-Type: application/json" \
     -d '{"model":"llama3","messages":[{"role":"user","content":"Hello!"}]}' \
     http://localhost:3000/v1/chat/completions
```

#### Chat Completion (Streaming)
```bash
curl -N -H "Authorization: Bearer test" \
     -H "Content-Type: application/json" \
     -d '{"model":"llama3","messages":[{"role":"user","content":"hi"}],"stream":true}' \
     http://localhost:3000/v1/chat/completions
```

#### Responses (Non-streaming)
```bash
curl -H "Authorization: Bearer test" \
     -H "Content-Type: application/json" \
     -d '{"model":"llama3","input":"hello"}' \
     http://localhost:3000/v1/responses
```

#### Responses (Streaming with Semantic Events)
```bash
curl -N -H "Authorization: Bearer test" \
     -H "Content-Type: application/json" \
     -d '{"model":"llama3","input":"stream please","stream":true}' \
     http://localhost:3000/v1/responses
```

#### Embeddings
```bash
curl -H "Authorization: Bearer test" \
     -H "Content-Type: application/json" \
     -d '{"model":"text-embedding-3-small","input":"abc"}' \
     http://localhost:3000/v1/embeddings
```

#### File Upload
```bash
curl -H "Authorization: Bearer test" \
     -F "file=@README.md" \
     -F "purpose=assistants" \
     http://localhost:3000/v1/files
```

### Using OpenAI SDK

#### Node.js
```typescript
import OpenAI from 'openai';

const ozwellai = new OpenAI({
  baseURL: 'http://localhost:3000/v1',
  apiKey: 'test-key',
});

const response = await ozwellai.chat.completions.create({
  model: "llama3",
  messages: [{ role: "user", content: "Hello!" }]
});
```

#### Python
```python
from openai import OpenAI

ozwellai = OpenAI(
    base_url="http://localhost:3000/v1",
    api_key="test-key"
)

response = ozwellai.chat.completions.create(
    model="llama3",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Data Storage

All data is stored in the `/data` directory:

```
/data
  /files
    index.json      # File metadata
    file-xxxxx      # Uploaded file content
```

### Reset State

To reset all data, simply delete the `/data` directory:

```bash
rm -rf data/
```

## Text Generation

- `/v1/chat/completions` forwards directly to the configured Llama backend, including streaming
- `/v1/responses` keeps the deterministic generator so you can run consistent tests with semantic events

## Streaming

### Chat Completions Streaming
- Uses OpenAI's standard chunked SSE format
- Sends `data:` prefixed JSON objects
- Ends with `data: [DONE]`

### Responses Streaming  
- Uses semantic event types: `start`, `content`, `completion`, `done`
- Each event has appropriate data payload
- Provides structured streaming experience

## OpenAPI Specification

The server generates OpenAPI 3.1 compliant documentation based on the current [OpenAI API specification](https://platform.openai.com/docs/api-reference). The spec is available at:

- Interactive docs: `http://localhost:3000/docs`
- JSON spec: `http://localhost:3000/openapi.json`

## Configuration

Environment variables:
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `NODE_ENV` - Environment (development/production)

## Error Handling

All errors follow OpenAI's error format:

```json
{
  "error": {
    "message": "Error description",
    "type": "error_type",
    "param": "parameter_name",
    "code": "error_code"
  }
}
```

Common HTTP status codes:
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid API key)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Testing

The server is designed for deterministic testing:
- Text generation produces consistent outputs for same inputs
- Embeddings are deterministic based on input text
- All responses include proper usage statistics
- File operations maintain consistent metadata

## Development

### Project Structure

```
src/
├── server.ts           # Main server setup
├── routes/             # API endpoint handlers
│   ├── models.ts
│   ├── chat.ts
│   ├── responses.ts
│   ├── embeddings.ts
│   └── files.ts
├── schemas/            # Zod schemas for validation
│   └── index.ts
└── util/               # Utility functions
    └── index.ts
```

### Adding New Endpoints

1. Define Zod schemas in `src/schemas/`
2. Create route handler in `src/routes/`
3. Register route in `src/server.ts`
4. Update OpenAPI documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Apache 2.0 - see LICENSE file for details

## Contact

For questions or support, please open an issue in the repository.
