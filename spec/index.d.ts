import { z } from 'zod';
export declare const MessageSchema: z.ZodObject<{
    role: z.ZodEnum<["system", "user", "assistant", "function", "tool"]>;
    content: z.ZodNullable<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    function_call: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        arguments: string;
    }, {
        name: string;
        arguments: string;
    }>>;
    tool_calls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"function">;
        function: z.ZodObject<{
            name: z.ZodString;
            arguments: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            arguments: string;
        }, {
            name: string;
            arguments: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        function: {
            name: string;
            arguments: string;
        };
        id: string;
        type: "function";
    }, {
        function: {
            name: string;
            arguments: string;
        };
        id: string;
        type: "function";
    }>, "many">>;
    tool_call_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    content: string | null;
    role: "function" | "assistant" | "system" | "user" | "tool";
    name?: string | undefined;
    function_call?: {
        name: string;
        arguments: string;
    } | undefined;
    tool_calls?: {
        function: {
            name: string;
            arguments: string;
        };
        id: string;
        type: "function";
    }[] | undefined;
    tool_call_id?: string | undefined;
}, {
    content: string | null;
    role: "function" | "assistant" | "system" | "user" | "tool";
    name?: string | undefined;
    function_call?: {
        name: string;
        arguments: string;
    } | undefined;
    tool_calls?: {
        function: {
            name: string;
            arguments: string;
        };
        id: string;
        type: "function";
    }[] | undefined;
    tool_call_id?: string | undefined;
}>;
export declare const ModelSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodLiteral<"model">;
    created: z.ZodNumber;
    owned_by: z.ZodString;
}, "strip", z.ZodTypeAny, {
    object: "model";
    id: string;
    created: number;
    owned_by: string;
}, {
    object: "model";
    id: string;
    created: number;
    owned_by: string;
}>;
export declare const ErrorSchema: z.ZodObject<{
    error: z.ZodObject<{
        message: z.ZodString;
        type: z.ZodString;
        param: z.ZodNullable<z.ZodString>;
        code: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string | null;
        message: string;
        type: string;
        param: string | null;
    }, {
        code: string | null;
        message: string;
        type: string;
        param: string | null;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        code: string | null;
        message: string;
        type: string;
        param: string | null;
    };
}, {
    error: {
        code: string | null;
        message: string;
        type: string;
        param: string | null;
    };
}>;
export declare const ChatCompletionRequestSchema: z.ZodObject<{
    model: z.ZodString;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "assistant", "function", "tool"]>;
        content: z.ZodNullable<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        function_call: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            arguments: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            arguments: string;
        }, {
            name: string;
            arguments: string;
        }>>;
        tool_calls: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodLiteral<"function">;
            function: z.ZodObject<{
                name: z.ZodString;
                arguments: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                arguments: string;
            }, {
                name: string;
                arguments: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }, {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }>, "many">>;
        tool_call_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        content: string | null;
        role: "function" | "assistant" | "system" | "user" | "tool";
        name?: string | undefined;
        function_call?: {
            name: string;
            arguments: string;
        } | undefined;
        tool_calls?: {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }[] | undefined;
        tool_call_id?: string | undefined;
    }, {
        content: string | null;
        role: "function" | "assistant" | "system" | "user" | "tool";
        name?: string | undefined;
        function_call?: {
            name: string;
            arguments: string;
        } | undefined;
        tool_calls?: {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }[] | undefined;
        tool_call_id?: string | undefined;
    }>, "many">;
    temperature: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    n: z.ZodOptional<z.ZodNumber>;
    stream: z.ZodOptional<z.ZodBoolean>;
    stop: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    max_tokens: z.ZodOptional<z.ZodNumber>;
    presence_penalty: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodOptional<z.ZodNumber>;
    logit_bias: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    user: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model: string;
    messages: {
        content: string | null;
        role: "function" | "assistant" | "system" | "user" | "tool";
        name?: string | undefined;
        function_call?: {
            name: string;
            arguments: string;
        } | undefined;
        tool_calls?: {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }[] | undefined;
        tool_call_id?: string | undefined;
    }[];
    stream?: boolean | undefined;
    stop?: string | string[] | undefined;
    max_tokens?: number | undefined;
    temperature?: number | undefined;
    user?: string | undefined;
    top_p?: number | undefined;
    n?: number | undefined;
    presence_penalty?: number | undefined;
    frequency_penalty?: number | undefined;
    logit_bias?: Record<string, number> | undefined;
}, {
    model: string;
    messages: {
        content: string | null;
        role: "function" | "assistant" | "system" | "user" | "tool";
        name?: string | undefined;
        function_call?: {
            name: string;
            arguments: string;
        } | undefined;
        tool_calls?: {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }[] | undefined;
        tool_call_id?: string | undefined;
    }[];
    stream?: boolean | undefined;
    stop?: string | string[] | undefined;
    max_tokens?: number | undefined;
    temperature?: number | undefined;
    user?: string | undefined;
    top_p?: number | undefined;
    n?: number | undefined;
    presence_penalty?: number | undefined;
    frequency_penalty?: number | undefined;
    logit_bias?: Record<string, number> | undefined;
}>;
export declare const ChatCompletionChoiceSchema: z.ZodObject<{
    index: z.ZodNumber;
    message: z.ZodObject<{
        role: z.ZodEnum<["system", "user", "assistant", "function", "tool"]>;
        content: z.ZodNullable<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        function_call: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            arguments: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            arguments: string;
        }, {
            name: string;
            arguments: string;
        }>>;
        tool_calls: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodLiteral<"function">;
            function: z.ZodObject<{
                name: z.ZodString;
                arguments: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                arguments: string;
            }, {
                name: string;
                arguments: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }, {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }>, "many">>;
        tool_call_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        content: string | null;
        role: "function" | "assistant" | "system" | "user" | "tool";
        name?: string | undefined;
        function_call?: {
            name: string;
            arguments: string;
        } | undefined;
        tool_calls?: {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }[] | undefined;
        tool_call_id?: string | undefined;
    }, {
        content: string | null;
        role: "function" | "assistant" | "system" | "user" | "tool";
        name?: string | undefined;
        function_call?: {
            name: string;
            arguments: string;
        } | undefined;
        tool_calls?: {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }[] | undefined;
        tool_call_id?: string | undefined;
    }>;
    finish_reason: z.ZodNullable<z.ZodEnum<["stop", "length", "function_call", "tool_calls", "content_filter"]>>;
}, "strip", z.ZodTypeAny, {
    message: {
        content: string | null;
        role: "function" | "assistant" | "system" | "user" | "tool";
        name?: string | undefined;
        function_call?: {
            name: string;
            arguments: string;
        } | undefined;
        tool_calls?: {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }[] | undefined;
        tool_call_id?: string | undefined;
    };
    index: number;
    finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
}, {
    message: {
        content: string | null;
        role: "function" | "assistant" | "system" | "user" | "tool";
        name?: string | undefined;
        function_call?: {
            name: string;
            arguments: string;
        } | undefined;
        tool_calls?: {
            function: {
                name: string;
                arguments: string;
            };
            id: string;
            type: "function";
        }[] | undefined;
        tool_call_id?: string | undefined;
    };
    index: number;
    finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
}>;
export declare const ChatCompletionResponseSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodLiteral<"chat.completion">;
    created: z.ZodNumber;
    model: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        message: z.ZodObject<{
            role: z.ZodEnum<["system", "user", "assistant", "function", "tool"]>;
            content: z.ZodNullable<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            function_call: z.ZodOptional<z.ZodObject<{
                name: z.ZodString;
                arguments: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                arguments: string;
            }, {
                name: string;
                arguments: string;
            }>>;
            tool_calls: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodLiteral<"function">;
                function: z.ZodObject<{
                    name: z.ZodString;
                    arguments: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    arguments: string;
                }, {
                    name: string;
                    arguments: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                function: {
                    name: string;
                    arguments: string;
                };
                id: string;
                type: "function";
            }, {
                function: {
                    name: string;
                    arguments: string;
                };
                id: string;
                type: "function";
            }>, "many">>;
            tool_call_id: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            content: string | null;
            role: "function" | "assistant" | "system" | "user" | "tool";
            name?: string | undefined;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                id: string;
                type: "function";
            }[] | undefined;
            tool_call_id?: string | undefined;
        }, {
            content: string | null;
            role: "function" | "assistant" | "system" | "user" | "tool";
            name?: string | undefined;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                id: string;
                type: "function";
            }[] | undefined;
            tool_call_id?: string | undefined;
        }>;
        finish_reason: z.ZodNullable<z.ZodEnum<["stop", "length", "function_call", "tool_calls", "content_filter"]>>;
    }, "strip", z.ZodTypeAny, {
        message: {
            content: string | null;
            role: "function" | "assistant" | "system" | "user" | "tool";
            name?: string | undefined;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                id: string;
                type: "function";
            }[] | undefined;
            tool_call_id?: string | undefined;
        };
        index: number;
        finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
    }, {
        message: {
            content: string | null;
            role: "function" | "assistant" | "system" | "user" | "tool";
            name?: string | undefined;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                id: string;
                type: "function";
            }[] | undefined;
            tool_call_id?: string | undefined;
        };
        index: number;
        finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
    }>, "many">;
    usage: z.ZodObject<{
        prompt_tokens: z.ZodNumber;
        completion_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    object: "chat.completion";
    id: string;
    created: number;
    model: string;
    choices: {
        message: {
            content: string | null;
            role: "function" | "assistant" | "system" | "user" | "tool";
            name?: string | undefined;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                id: string;
                type: "function";
            }[] | undefined;
            tool_call_id?: string | undefined;
        };
        index: number;
        finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}, {
    object: "chat.completion";
    id: string;
    created: number;
    model: string;
    choices: {
        message: {
            content: string | null;
            role: "function" | "assistant" | "system" | "user" | "tool";
            name?: string | undefined;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                id: string;
                type: "function";
            }[] | undefined;
            tool_call_id?: string | undefined;
        };
        index: number;
        finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}>;
export declare const ResponseRequestSchema: z.ZodObject<{
    model: z.ZodString;
    input: z.ZodString;
    stream: z.ZodOptional<z.ZodBoolean>;
    max_tokens: z.ZodOptional<z.ZodNumber>;
    temperature: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    model: string;
    input: string;
    stream?: boolean | undefined;
    max_tokens?: number | undefined;
    temperature?: number | undefined;
}, {
    model: string;
    input: string;
    stream?: boolean | undefined;
    max_tokens?: number | undefined;
    temperature?: number | undefined;
}>;
export declare const ResponseSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodLiteral<"response">;
    created: z.ZodNumber;
    model: z.ZodString;
    output: z.ZodString;
    usage: z.ZodObject<{
        input_tokens: z.ZodNumber;
        output_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total_tokens: number;
        input_tokens: number;
        output_tokens: number;
    }, {
        total_tokens: number;
        input_tokens: number;
        output_tokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    object: "response";
    id: string;
    created: number;
    output: string;
    model: string;
    usage: {
        total_tokens: number;
        input_tokens: number;
        output_tokens: number;
    };
}, {
    object: "response";
    id: string;
    created: number;
    output: string;
    model: string;
    usage: {
        total_tokens: number;
        input_tokens: number;
        output_tokens: number;
    };
}>;
export declare const EmbeddingRequestSchema: z.ZodObject<{
    model: z.ZodString;
    input: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    encoding_format: z.ZodOptional<z.ZodEnum<["float", "base64"]>>;
    dimensions: z.ZodOptional<z.ZodNumber>;
    user: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model: string;
    input: string | string[];
    dimensions?: number | undefined;
    user?: string | undefined;
    encoding_format?: "base64" | "float" | undefined;
}, {
    model: string;
    input: string | string[];
    dimensions?: number | undefined;
    user?: string | undefined;
    encoding_format?: "base64" | "float" | undefined;
}>;
export declare const EmbeddingSchema: z.ZodObject<{
    object: z.ZodLiteral<"embedding">;
    embedding: z.ZodArray<z.ZodNumber, "many">;
    index: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    object: "embedding";
    embedding: number[];
    index: number;
}, {
    object: "embedding";
    embedding: number[];
    index: number;
}>;
export declare const EmbeddingResponseSchema: z.ZodObject<{
    object: z.ZodLiteral<"list">;
    data: z.ZodArray<z.ZodObject<{
        object: z.ZodLiteral<"embedding">;
        embedding: z.ZodArray<z.ZodNumber, "many">;
        index: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        object: "embedding";
        embedding: number[];
        index: number;
    }, {
        object: "embedding";
        embedding: number[];
        index: number;
    }>, "many">;
    model: z.ZodString;
    usage: z.ZodObject<{
        prompt_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        prompt_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        total_tokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    object: "list";
    data: {
        object: "embedding";
        embedding: number[];
        index: number;
    }[];
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
}, {
    object: "list";
    data: {
        object: "embedding";
        embedding: number[];
        index: number;
    }[];
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
}>;
export declare const FileObjectSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodLiteral<"file">;
    bytes: z.ZodNumber;
    created_at: z.ZodNumber;
    filename: z.ZodString;
    purpose: z.ZodString;
}, "strip", z.ZodTypeAny, {
    object: "file";
    id: string;
    bytes: number;
    created_at: number;
    filename: string;
    purpose: string;
}, {
    object: "file";
    id: string;
    bytes: number;
    created_at: number;
    filename: string;
    purpose: string;
}>;
export declare const FileListResponseSchema: z.ZodObject<{
    object: z.ZodLiteral<"list">;
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        object: z.ZodLiteral<"file">;
        bytes: z.ZodNumber;
        created_at: z.ZodNumber;
        filename: z.ZodString;
        purpose: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        object: "file";
        id: string;
        bytes: number;
        created_at: number;
        filename: string;
        purpose: string;
    }, {
        object: "file";
        id: string;
        bytes: number;
        created_at: number;
        filename: string;
        purpose: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    object: "list";
    data: {
        object: "file";
        id: string;
        bytes: number;
        created_at: number;
        filename: string;
        purpose: string;
    }[];
}, {
    object: "list";
    data: {
        object: "file";
        id: string;
        bytes: number;
        created_at: number;
        filename: string;
        purpose: string;
    }[];
}>;
export declare const ModelsListResponseSchema: z.ZodObject<{
    object: z.ZodLiteral<"list">;
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        object: z.ZodLiteral<"model">;
        created: z.ZodNumber;
        owned_by: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        object: "model";
        id: string;
        created: number;
        owned_by: string;
    }, {
        object: "model";
        id: string;
        created: number;
        owned_by: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    object: "list";
    data: {
        object: "model";
        id: string;
        created: number;
        owned_by: string;
    }[];
}, {
    object: "list";
    data: {
        object: "model";
        id: string;
        created: number;
        owned_by: string;
    }[];
}>;
export declare const ChatCompletionChunkSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodLiteral<"chat.completion.chunk">;
    created: z.ZodNumber;
    model: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        delta: z.ZodObject<{
            role: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
            function_call: z.ZodOptional<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                arguments: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name?: string | undefined;
                arguments?: string | undefined;
            }, {
                name?: string | undefined;
                arguments?: string | undefined;
            }>>;
            tool_calls: z.ZodOptional<z.ZodArray<z.ZodObject<{
                index: z.ZodNumber;
                id: z.ZodOptional<z.ZodString>;
                type: z.ZodOptional<z.ZodLiteral<"function">>;
                function: z.ZodOptional<z.ZodObject<{
                    name: z.ZodOptional<z.ZodString>;
                    arguments: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name?: string | undefined;
                    arguments?: string | undefined;
                }, {
                    name?: string | undefined;
                    arguments?: string | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                index: number;
                function?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                id?: string | undefined;
                type?: "function" | undefined;
            }, {
                index: number;
                function?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                id?: string | undefined;
                type?: "function" | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            content?: string | undefined;
            role?: string | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                index: number;
                function?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                id?: string | undefined;
                type?: "function" | undefined;
            }[] | undefined;
        }, {
            content?: string | undefined;
            role?: string | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                index: number;
                function?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                id?: string | undefined;
                type?: "function" | undefined;
            }[] | undefined;
        }>;
        finish_reason: z.ZodNullable<z.ZodEnum<["stop", "length", "function_call", "tool_calls", "content_filter"]>>;
    }, "strip", z.ZodTypeAny, {
        index: number;
        finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
        delta: {
            content?: string | undefined;
            role?: string | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                index: number;
                function?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                id?: string | undefined;
                type?: "function" | undefined;
            }[] | undefined;
        };
    }, {
        index: number;
        finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
        delta: {
            content?: string | undefined;
            role?: string | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                index: number;
                function?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                id?: string | undefined;
                type?: "function" | undefined;
            }[] | undefined;
        };
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    object: "chat.completion.chunk";
    id: string;
    created: number;
    model: string;
    choices: {
        index: number;
        finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
        delta: {
            content?: string | undefined;
            role?: string | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                index: number;
                function?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                id?: string | undefined;
                type?: "function" | undefined;
            }[] | undefined;
        };
    }[];
}, {
    object: "chat.completion.chunk";
    id: string;
    created: number;
    model: string;
    choices: {
        index: number;
        finish_reason: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null;
        delta: {
            content?: string | undefined;
            role?: string | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                index: number;
                function?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                id?: string | undefined;
                type?: "function" | undefined;
            }[] | undefined;
        };
    }[];
}>;
export type Message = z.infer<typeof MessageSchema>;
export type Model = z.infer<typeof ModelSchema>;
export type ChatCompletionRequest = z.infer<typeof ChatCompletionRequestSchema>;
export type ChatCompletionResponse = z.infer<typeof ChatCompletionResponseSchema>;
export type ResponseRequest = z.infer<typeof ResponseRequestSchema>;
export type Response = z.infer<typeof ResponseSchema>;
export type EmbeddingRequest = z.infer<typeof EmbeddingRequestSchema>;
export type EmbeddingResponse = z.infer<typeof EmbeddingResponseSchema>;
export type FileObject = z.infer<typeof FileObjectSchema>;
export type FileListResponse = z.infer<typeof FileListResponseSchema>;
export type ModelsListResponse = z.infer<typeof ModelsListResponseSchema>;
export type ChatCompletionChunk = z.infer<typeof ChatCompletionChunkSchema>;
//# sourceMappingURL=index.d.ts.map