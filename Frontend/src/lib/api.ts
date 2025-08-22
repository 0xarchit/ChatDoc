import axios from "axios";

// Default API base URL - can be overridden in settings
export const DEFAULT_API_BASE_URL = "https://chatdoc-main-4df34c0.d2.zuplo.dev";

// Get API base URL from localStorage or use default
export const getApiBaseUrl = (): string => {
  return localStorage.getItem("apiBaseUrl") || DEFAULT_API_BASE_URL;
};

// Set API base URL in localStorage
export const setApiBaseUrl = (url: string): void => {
  localStorage.setItem("apiBaseUrl", url);
};

// Create axios instance with dynamic base URL
export const api = axios.create();

// Interceptor to always use the current base URL from settings
api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

// API Types
export interface UploadResponse {
  upload_id: string;
}

export interface QueryRequest {
  question: string;
  upload_id: string;
  mistral_api_key?: string | null;
  zilliz_uri?: string | null;
  zilliz_token?: string | null;
  collection_name?: string | null;
}

export interface QueryResponse {
  answer: string;
}

export interface DeleteResponse {
  status: string;
}

export interface ActiveResponse {
  message: string;
}

export interface BYOKConfig {
  mistral_api_key: string;
  zilliz_uri: string;
  zilliz_token: string;
  collection_name: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  ts: string;
}

export interface HistoryEntry {
  upload_id: string;
  filename: string;
  upload_date: string;
  byok: boolean;
  overrides?: Partial<BYOKConfig>;
  chats: ChatMessage[];
}

export interface ChatHistory {
  entries: HistoryEntry[];
}

// API Methods
export const apiMethods = {
  // Check if API is active
  async checkActive(): Promise<ActiveResponse> {
    const response = await api.get<ActiveResponse>("/active");
    return response.data;
  },

  // Upload a file
  async uploadFile(
    file: File,
    overrides?: Partial<BYOKConfig>
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    if (overrides?.mistral_api_key) {
      formData.append("mistral_api_key", overrides.mistral_api_key);
    }
    if (overrides?.zilliz_uri) {
      formData.append("zilliz_uri", overrides.zilliz_uri);
    }
    if (overrides?.zilliz_token) {
      formData.append("zilliz_token", overrides.zilliz_token);
    }
    if (overrides?.collection_name) {
      formData.append("collection_name", overrides.collection_name);
    }

    const response = await api.post<UploadResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Query a document
  async query(request: QueryRequest): Promise<QueryResponse> {
    // The backend may return different shapes; normalize to a string answer
    const response = await api.post<any>("/query", request);

    const normalizeAnswer = (raw: any): string => {
      if (raw == null) return "";
      // If it's already a string
      if (typeof raw === "string") return raw;

      // Common shapes: { answer: string | { content, ... } } or { content } or arrays
      const candidate = raw?.answer ?? raw?.message ?? raw;

      if (typeof candidate === "string") return candidate;

      // If object with content
      const content =
        candidate?.content ?? candidate?.text ?? candidate?.output ?? null;
      if (typeof content === "string") return content;

      // If content is an array of parts (e.g., [{type:'text', text:'...'}])
      if (Array.isArray(content)) {
        try {
          const parts = content
            .map((p: any) =>
              typeof p === "string"
                ? p
                : p?.text ?? p?.content ?? p?.value ?? ""
            )
            .filter(Boolean);
          if (parts.length) return parts.join("");
        } catch {
          // fall through
        }
      }

      // Try some other reasonable fields
      if (typeof candidate?.output_text === "string")
        return candidate.output_text;
      if (typeof candidate?.data === "string") return candidate.data;

      // Fallback to JSON string
      try {
        return JSON.stringify(candidate);
      } catch {
        return "";
      }
    };

    const answer = normalizeAnswer(response.data);
    return { answer };
  },

  // Delete a document
  async deleteDocument(
    uploadId: string,
    overrides?: Partial<BYOKConfig>
  ): Promise<DeleteResponse> {
    const params = new URLSearchParams();
    if (overrides?.mistral_api_key) {
      params.append("mistral_api_key", overrides.mistral_api_key);
    }
    if (overrides?.zilliz_uri) {
      params.append("zilliz_uri", overrides.zilliz_uri);
    }
    if (overrides?.zilliz_token) {
      params.append("zilliz_token", overrides.zilliz_token);
    }
    if (overrides?.collection_name) {
      params.append("collection_name", overrides.collection_name);
    }

    const url = `/delete/${uploadId}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await api.delete<DeleteResponse>(url);
    return response.data;
  },
};
