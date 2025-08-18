"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCompletionChunkSchema = exports.ModelsListResponseSchema = exports.FileListResponseSchema = exports.FileObjectSchema = exports.EmbeddingResponseSchema = exports.EmbeddingSchema = exports.EmbeddingRequestSchema = exports.ResponseSchema = exports.ResponseRequestSchema = exports.ChatCompletionResponseSchema = exports.ChatCompletionChoiceSchema = exports.ChatCompletionRequestSchema = exports.ErrorSchema = exports.ModelSchema = exports.MessageSchema = void 0;
const zod_1 = require("zod");
// Common schemas
exports.MessageSchema = zod_1.z.object({
    role: zod_1.z.enum(['system', 'user', 'assistant', 'function', 'tool']),
    content: zod_1.z.string().nullable(),
    name: zod_1.z.string().optional(),
    function_call: zod_1.z.object({
        name: zod_1.z.string(),
        arguments: zod_1.z.string(),
    }).optional(),
    tool_calls: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.literal('function'),
        function: zod_1.z.object({
            name: zod_1.z.string(),
            arguments: zod_1.z.string(),
        }),
    })).optional(),
    tool_call_id: zod_1.z.string().optional(),
});
exports.ModelSchema = zod_1.z.object({
    id: zod_1.z.string(),
    object: zod_1.z.literal('model'),
    created: zod_1.z.number(),
    owned_by: zod_1.z.string(),
});
exports.ErrorSchema = zod_1.z.object({
    error: zod_1.z.object({
        message: zod_1.z.string(),
        type: zod_1.z.string(),
        param: zod_1.z.string().nullable(),
        code: zod_1.z.string().nullable(),
    }),
});
// Chat completions schemas
exports.ChatCompletionRequestSchema = zod_1.z.object({
    model: zod_1.z.string(),
    messages: zod_1.z.array(exports.MessageSchema),
    temperature: zod_1.z.number().min(0).max(2).optional(),
    top_p: zod_1.z.number().min(0).max(1).optional(),
    n: zod_1.z.number().min(1).max(128).optional(),
    stream: zod_1.z.boolean().optional(),
    stop: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    max_tokens: zod_1.z.number().min(1).optional(),
    presence_penalty: zod_1.z.number().min(-2).max(2).optional(),
    frequency_penalty: zod_1.z.number().min(-2).max(2).optional(),
    logit_bias: zod_1.z.record(zod_1.z.string(), zod_1.z.number()).optional(),
    user: zod_1.z.string().optional(),
});
exports.ChatCompletionChoiceSchema = zod_1.z.object({
    index: zod_1.z.number(),
    message: exports.MessageSchema,
    finish_reason: zod_1.z.enum(['stop', 'length', 'function_call', 'tool_calls', 'content_filter']).nullable(),
});
exports.ChatCompletionResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    object: zod_1.z.literal('chat.completion'),
    created: zod_1.z.number(),
    model: zod_1.z.string(),
    choices: zod_1.z.array(exports.ChatCompletionChoiceSchema),
    usage: zod_1.z.object({
        prompt_tokens: zod_1.z.number(),
        completion_tokens: zod_1.z.number(),
        total_tokens: zod_1.z.number(),
    }),
});
// Responses endpoint schemas (new primitive)
exports.ResponseRequestSchema = zod_1.z.object({
    model: zod_1.z.string(),
    input: zod_1.z.string(),
    stream: zod_1.z.boolean().optional(),
    max_tokens: zod_1.z.number().min(1).optional(),
    temperature: zod_1.z.number().min(0).max(2).optional(),
});
exports.ResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    object: zod_1.z.literal('response'),
    created: zod_1.z.number(),
    model: zod_1.z.string(),
    output: zod_1.z.string(),
    usage: zod_1.z.object({
        input_tokens: zod_1.z.number(),
        output_tokens: zod_1.z.number(),
        total_tokens: zod_1.z.number(),
    }),
});
// Embeddings schemas
exports.EmbeddingRequestSchema = zod_1.z.object({
    model: zod_1.z.string(),
    input: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
    encoding_format: zod_1.z.enum(['float', 'base64']).optional(),
    dimensions: zod_1.z.number().optional(),
    user: zod_1.z.string().optional(),
});
exports.EmbeddingSchema = zod_1.z.object({
    object: zod_1.z.literal('embedding'),
    embedding: zod_1.z.array(zod_1.z.number()),
    index: zod_1.z.number(),
});
exports.EmbeddingResponseSchema = zod_1.z.object({
    object: zod_1.z.literal('list'),
    data: zod_1.z.array(exports.EmbeddingSchema),
    model: zod_1.z.string(),
    usage: zod_1.z.object({
        prompt_tokens: zod_1.z.number(),
        total_tokens: zod_1.z.number(),
    }),
});
// Files schemas
exports.FileObjectSchema = zod_1.z.object({
    id: zod_1.z.string(),
    object: zod_1.z.literal('file'),
    bytes: zod_1.z.number(),
    created_at: zod_1.z.number(),
    filename: zod_1.z.string(),
    purpose: zod_1.z.string(),
});
exports.FileListResponseSchema = zod_1.z.object({
    object: zod_1.z.literal('list'),
    data: zod_1.z.array(exports.FileObjectSchema),
});
// Models list schema
exports.ModelsListResponseSchema = zod_1.z.object({
    object: zod_1.z.literal('list'),
    data: zod_1.z.array(exports.ModelSchema),
});
// Streaming schemas
exports.ChatCompletionChunkSchema = zod_1.z.object({
    id: zod_1.z.string(),
    object: zod_1.z.literal('chat.completion.chunk'),
    created: zod_1.z.number(),
    model: zod_1.z.string(),
    choices: zod_1.z.array(zod_1.z.object({
        index: zod_1.z.number(),
        delta: zod_1.z.object({
            role: zod_1.z.string().optional(),
            content: zod_1.z.string().optional(),
            function_call: zod_1.z.object({
                name: zod_1.z.string().optional(),
                arguments: zod_1.z.string().optional(),
            }).optional(),
            tool_calls: zod_1.z.array(zod_1.z.object({
                index: zod_1.z.number(),
                id: zod_1.z.string().optional(),
                type: zod_1.z.literal('function').optional(),
                function: zod_1.z.object({
                    name: zod_1.z.string().optional(),
                    arguments: zod_1.z.string().optional(),
                }).optional(),
            })).optional(),
        }),
        finish_reason: zod_1.z.enum(['stop', 'length', 'function_call', 'tool_calls', 'content_filter']).nullable(),
    })),
});
//# sourceMappingURL=index.js.map