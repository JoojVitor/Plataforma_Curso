"use client"

import type React from "react"

import { useAuth } from "./auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: ("aluno" | "instrutor" | "admin")[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`)
    } else if (!isLoading && requiredRole && user && !requiredRole.includes(user.role)) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return null
  }

  return children
}
