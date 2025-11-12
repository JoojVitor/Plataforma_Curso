export class ApiClient {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      ...options?.headers,
    };

    if (!headers["Content-Type"] && !(options?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // 🔑 envia cookies automaticamente
    });

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.message || `API error: ${response.status}`);
      } catch {
        throw new Error(`API error: ${response.status}`);
      }
    }

    return response.json();
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
    });
  }

  static async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  static async createCourse<T>(courseData: unknown): Promise<T> {
    return this.post<T>("/courses", courseData);
  }

  static async uploadVideo(fileName: string, contentType: string) {
    return this.post<{ uploadUrl: string; key: string }>("/upload", {
      fileName,
      contentType,
    });
  }
}
