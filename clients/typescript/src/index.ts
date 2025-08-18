import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  ModelsListResponse,
  FileObject,
  FileListResponse,
  ResponseRequest,
  Response,
} from '@mieweb/ozwellai-spec';

export interface OzwellAIConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

export class OzwellAI {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: OzwellAIConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.ozwell.ai';
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'User-Agent': 'ozwellai-typescript/1.0.0',
      ...config.defaultHeaders,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Create a chat completion
   */
  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    return this.makeRequest<ChatCompletionResponse>('/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Create embeddings
   */
  async createEmbedding(
    request: EmbeddingRequest
  ): Promise<EmbeddingResponse> {
    return this.makeRequest<EmbeddingResponse>('/v1/embeddings', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * List available models
   */
  async listModels(): Promise<ModelsListResponse> {
    return this.makeRequest<ModelsListResponse>('/v1/models');
  }

  /**
   * Upload a file
   */
  async uploadFile(file: File | Blob, purpose: string): Promise<FileObject> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    return this.makeRequest<FileObject>('/v1/files', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        // Don't set Content-Type, let browser set it with boundary for FormData
      },
    });
  }

  /**
   * List files
   */
  async listFiles(): Promise<FileListResponse> {
    return this.makeRequest<FileListResponse>('/v1/files');
  }

  /**
   * Get file details
   */
  async getFile(fileId: string): Promise<FileObject> {
    return this.makeRequest<FileObject>(`/v1/files/${fileId}`);
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<{ deleted: boolean; id: string }> {
    return this.makeRequest<{ deleted: boolean; id: string }>(`/v1/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Create a response (Ozwell-specific endpoint)
   */
  async createResponse(request: ResponseRequest): Promise<Response> {
    return this.makeRequest<Response>('/v1/responses', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export default OzwellAI;

// Re-export types from the spec for convenience
export type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  ModelsListResponse,
  FileObject,
  FileListResponse,
  ResponseRequest,
  Response,
} from '@mieweb/ozwellai-spec';
