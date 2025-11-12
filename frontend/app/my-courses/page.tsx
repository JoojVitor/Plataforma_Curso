"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CourseCard } from "@/components/course-card"
import { ProtectedRoute } from "@/lib/protected-route"
import { useAuth } from "@/lib/auth-context"
import { useCourses } from "@/hooks/use-courses"

export default function MyCoursesPage() {
  const { user } = useAuth()
  const { cursos, isLoading, error } = useCourses()

  const meusCursos = cursos.filter((curso) => curso.instrutor._id === user?.id)

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1">
          <div className="bg-muted/30 border-b border-border py-8 px-4">
            <div className="container max-w-6xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Meus Cursos</h1>
              <p className="text-muted-foreground">Manage seus cursos criados</p>
            </div>
          </div>

          <div className="py-8 px-4">
            <div className="container max-w-6xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Carregando seus cursos...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-destructive">Erro ao carregar cursos: {error}</p>
                </div>
              ) : meusCursos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {meusCursos.map((course) => (
                    <CourseCard
                      key={course._id}
                      id={course._id}
                      titulo={course.titulo}
                      description={course.descricao}
                      instructor={course.instrutor.nome}
                      thumbnail="/curso-placeholder.jpg"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Você ainda não criou nenhum curso</p>
                  <Button asChild>
                    <Link href="/courses/create">Criar Seu Primeiro Curso</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="border-t border-border py-8 px-4 mt-auto">
          <div className="container max-w-6xl mx-auto text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Plataforma Cursos. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
