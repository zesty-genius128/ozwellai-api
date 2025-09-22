import { FastifyPluginAsync } from 'fastify';
import { validateAuth, createError, getLlamaConfig } from '../util';

const modelsRoute: FastifyPluginAsync = async (fastify) => {
  // GET /v1/models
  fastify.get('/v1/models', {
    schema: {
      headers: {
        type: 'object',
        properties: {
          authorization: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            object: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  object: { type: 'string' },
                  created: { type: 'number' },
                  owned_by: { type: 'string' }
                },
                required: ['id', 'object', 'created', 'owned_by']
              }
            }
          },
          required: ['object', 'data']
        }
      },
    },
  }, async (request, reply) => {
    // Validate authorization
    if (!validateAuth(request.headers.authorization)) {
      reply.code(401);
      return createError('Invalid API key provided', 'invalid_request_error');
    }

    // Return hardcoded list of models
    const { models: configuredModels } = getLlamaConfig();
    const models = configuredModels.map(modelId => ({
      id: modelId,
      object: 'model' as const,
      created: 1677610602,
      owned_by: 'llama',
    }));

    // Add OpenAI-compatible headers
    reply.headers({
      'x-request-id': `req_${Date.now()}`,
      'openai-processing-ms': '50',
      'openai-version': '2020-10-01',
    });

    return {
      object: 'list' as const,
      data: models,
    };
  });
};

export default modelsRoute;
