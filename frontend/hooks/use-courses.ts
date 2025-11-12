"use client"

import { useState, useEffect } from "react"
import { ApiClient } from "@/lib/api-client"

export interface Aula {
  titulo: string
  url: string
}

export interface Instrutor {
  _id: string
  nome: string
  email: string
}

export interface Curso {
  _id: string
  titulo: string
  descricao: string
  instrutor: Instrutor
  aulas: Aula[]
  createdAt: string
  updatedAt: string
}

interface UseCursosReturn {
  cursos: Curso[]
  isLoading: boolean
  error: string | null
}

export function useCourses(): UseCursosReturn {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await ApiClient.get<Curso[]>("/courses")
        setCursos(response)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar cursos"
        setError(errorMessage)
        console.error("Erro ao buscar cursos:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCursos()
  }, [])

  return { cursos, isLoading, error }
}
