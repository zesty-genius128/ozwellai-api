import { FastifyPluginAsync } from 'fastify';
import { Readable } from 'stream';
import { validateAuth, createError, getLlamaConfig, buildLlamaHeaders, buildLlamaUrl } from '../util';

const chatRoute: FastifyPluginAsync = async (fastify) => {
  // POST /v1/chat/completions
  fastify.post('/v1/chat/completions', {
    schema: {
      headers: {
        type: 'object',
        properties: {
          authorization: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          model: { type: 'string' },
          messages: { 
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string' },
                content: { type: 'string' }
              },
              required: ['role', 'content']
            }
          },
          stream: { type: 'boolean' },
          max_tokens: { type: 'number' },
          temperature: { type: 'number' }
        },
        required: ['model', 'messages']
      }
    },
  }, async (request, reply) => {
    // Validate authorization
    if (!validateAuth(request.headers.authorization)) {
      reply.code(401);
      return createError('Invalid API key provided', 'invalid_request_error');
    }

    const body = request.body as any;
    const { model, messages, stream = false, max_tokens = 150, temperature = 0.7 } = body;

    // Validate model against configured list
    const { models: supportedModels } = getLlamaConfig();
    if (!supportedModels.includes(model)) {
      reply.code(400);
      return createError(`Model '${model}' not found`, 'invalid_request_error', 'model');
    }

    const llamaRequestBody: Record<string, unknown> = {
      model,
      messages,
    };

    if (typeof stream === 'boolean') {
      llamaRequestBody.stream = stream;
    }
    if (typeof max_tokens === 'number') {
      llamaRequestBody.max_tokens = max_tokens;
    }
    if (typeof temperature === 'number') {
      llamaRequestBody.temperature = temperature;
    }

    let llamaResponse: globalThis.Response;
    try {
      llamaResponse = await fetch(buildLlamaUrl('/chat/completions'), {
        method: 'POST',
        headers: buildLlamaHeaders(),
        body: JSON.stringify(llamaRequestBody),
      });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to reach Llama backend');
      reply.code(502);
      return createError('Failed to reach Llama backend', 'server_error');
    }

    if (stream) {
      if (!llamaResponse.ok) {
        const errorText = await llamaResponse.text();
        reply.code(llamaResponse.status);
        try {
          return JSON.parse(errorText);
        } catch {
          return createError(errorText || 'Llama streaming request failed', 'server_error');
        }
      }

      reply.code(llamaResponse.status);
      llamaResponse.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-length') {
          reply.header(key, value);
        }
      });

      const streamBody = llamaResponse.body;
      if (!streamBody) {
        reply.code(502);
        return createError('Llama backend returned empty stream', 'server_error');
      }

      const nodeStream = typeof (streamBody as any).pipe === 'function'
        ? (streamBody as unknown as NodeJS.ReadableStream)
        : Readable.fromWeb(streamBody as any);

      return reply.send(nodeStream);
    }

    const responseText = await llamaResponse.text();
    let responseJson: unknown;
    if (responseText.length > 0) {
      try {
        responseJson = JSON.parse(responseText);
      } catch (error) {
        request.log.error({ err: error, responseText }, 'Invalid JSON from Llama backend');
        reply.code(502);
        return createError('Invalid response from Llama backend', 'server_error');
      }
    }

    reply.code(llamaResponse.status);
    llamaResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-length') {
        reply.header(key, value);
      }
    });

    if (!llamaResponse.ok) {
      if (responseJson) {
        return responseJson;
      }
      return createError('Llama request failed', 'server_error');
    }

    return responseJson ?? {};
  });
};

export default chatRoute;
