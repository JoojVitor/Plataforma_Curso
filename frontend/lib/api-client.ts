export class ApiClient {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

  static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `API error: ${response.status}`)
    }

    return response.json()
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  static async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}
