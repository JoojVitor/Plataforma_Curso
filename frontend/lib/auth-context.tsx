"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
    id: string;
    nome: string;
    email: string;
    role: "aluno" | "instrutor" | "admin";
    avatar: any;
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (email: string, senha: string, nome: string, role: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("authToken")

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, senha: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      const data = await response.json()
      const { token, user: userData } = data

      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, senha: string, nome: string, role: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha, nome, role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      const data = await response.json()
      const { token, user: userData } = data

      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Register error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
