import { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import type { SocketStream } from '@fastify/websocket';
import OzwellAI from 'ozwellai';

type JsonRecord = Record<string, unknown>;

interface ClientHelloMessage {
  type: 'client_hello';
  version: string;
  capabilities?: JsonRecord;
}

interface ModelRequestMessage {
  type: 'model_request';
  id: string | number;
  model?: string;
  params: {
    model?: string;
    prompt?: string;
    system?: string;
    messages?: Array<{ role: string; content: string }>;
    stream?: boolean;
  } & JsonRecord;
}

interface ToolCallMessage {
  type: 'tools/call';
  id: string | number;
  params: {
    name: string;
    arguments?: JsonRecord;
  } & JsonRecord;
}

type IncomingMessage = ClientHelloMessage | ModelRequestMessage | ToolCallMessage | JsonRecord;

const DEFAULT_MODEL = (process.env.MCP_DEFAULT_MODEL || 'llama3').trim();
const rawApiKey = (process.env.MCP_API_KEY || 'ollama').trim();
const explicitBaseUrl = process.env.MCP_BASE_URL?.trim();

const resolvedBaseUrl = explicitBaseUrl ||
  (rawApiKey.toLowerCase() === 'ollama' ? 'http://127.0.0.1:11434' : undefined);

const ozwellClient = new OzwellAI({
  apiKey: rawApiKey,
  ...(resolvedBaseUrl ? { baseURL: resolvedBaseUrl } : {}),
});

console.log('[MCP] Host configuration', {
  defaultModel: DEFAULT_MODEL,
  baseURL: resolvedBaseUrl || 'https://api.ozwell.ai',
  apiKey: rawApiKey.toLowerCase() === 'ollama' ? 'ollama (local)' : '[custom]'
});

function send(socket: SocketStream['socket'], payload: JsonRecord) {
  socket.send(JSON.stringify(payload));
}

async function handleModelRequest(socket: SocketStream['socket'], message: ModelRequestMessage) {
  const requestId = message.id;
  const params = message.params || {};
  const model = params.model || message.model || DEFAULT_MODEL;

  const prompt = params.prompt as string | undefined;
  const systemPrompt = params.system as string | undefined;
  const messages = params.messages as Array<{ role: string; content: string }> | undefined;

  const chatMessages = messages && messages.length > 0
    ? messages
    : [
        { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
        { role: 'user', content: prompt || '' },
      ];

  try {
    const response = await ozwellClient.createChatCompletion({
      model,
      messages: chatMessages,
      stream: false,
    });

    const content = response.choices?.[0]?.message?.content ?? '';

    send(socket, {
      type: 'model_response',
      id: requestId,
      response: {
        content: [{ type: 'text', text: content }],
        metadata: {
          model,
        },
        usage: response.usage,
      },
      error: null,
    });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Model request failed';
    console.error('[MCP] model_request failed:', error);
    send(socket, {
      type: 'model_response',
      id: requestId,
      response: null,
      error: {
        code: 'model_error',
        message: messageText,
      },
    });
  }
}

function handleToolCall(socket: SocketStream['socket'], message: ToolCallMessage) {
  const { id, params } = message;
  const toolName = params?.name;
  const args = params?.arguments || {};

  send(socket, {
    type: 'tool_response',
    id,
    result: {
      content: [
        {
          type: 'text',
          text: `Tool ${toolName || 'unknown'} acknowledged with args ${JSON.stringify(args)}`,
        },
      ],
      metadata: {},
    },
    error: null,
  });
}

function handleMessage(socket: SocketStream['socket'], raw: string) {
  let parsed: IncomingMessage;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    send(socket, {
      type: 'error',
      error: {
        code: 'invalid_json',
        message: 'Unable to parse JSON payload',
      },
    });
    return;
  }

  if (!parsed || typeof parsed !== 'object') {
    return;
  }

  switch (parsed.type) {
    case 'client_hello': {
      send(socket, {
        type: 'server_hello',
        version: parsed.version || '1.0',
        capabilities: {
          model: {
            request: {
              stream: false,
            },
          },
          tools: {
            call: true,
          },
        },
      });
      break;
    }

    case 'model_request': {
      handleModelRequest(socket, parsed as ModelRequestMessage);
      break;
    }

    case 'tools/call': {
      handleToolCall(socket, parsed as ToolCallMessage);
      break;
    }

    default: {
      send(socket, {
        type: 'error',
        error: {
          code: 'unsupported_message',
          message: `Unsupported MCP message type: ${String(parsed.type)}`,
        },
      });
      break;
    }
  }
}

export async function registerMcpHost(fastify: FastifyInstance) {
  await fastify.register(websocket);

  fastify.get('/mcp/ws', { websocket: true }, (connection) => {
    const { socket } = connection;

    socket.on('message', (data: string | Buffer) => {
      const raw = typeof data === 'string' ? data : data.toString();
      handleMessage(socket, raw);
    });

    socket.on('error', (error: Error) => {
      fastify.log.error({ err: error }, 'MCP websocket error');
    });
  });
}

export default registerMcpHost;
