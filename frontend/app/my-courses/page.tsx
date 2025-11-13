"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CourseCard } from "@/components/course-card"
import { ProtectedRoute } from "@/lib/protected-route"
import { useAuth } from "@/lib/auth-context"
import { useCourses } from "@/hooks/use-courses"
import { ApiClient } from "@/lib/api-client"
import { useEffect, useState } from "react"

interface Enrollment {
  _id: string
  curso: {
    _id: string
    titulo: string
    descricao: string
    instrutor: { nome: string }
  }
}

export default function MyCoursesPage() {
  const { user } = useAuth()

  const { cursos, isLoading, error } = useCourses()
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([])
  const [loadingEnrollments, setLoadingEnrollments] = useState(true)

  const isInstructor = user?.role === "instrutor" || user?.role === "admin"
  const isStudent = user?.role === "aluno"

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!isStudent) {
        setLoadingEnrollments(false)
        return
      }

      try {
        const data = await ApiClient.get<Enrollment[]>("/enrollments/me")
        setMyEnrollments(data)
      } catch (err) {
        console.error("Erro ao buscar inscrições:", err)
      } finally {
        setLoadingEnrollments(false)
      }
    }

    fetchEnrollments()
  }, [isStudent])

  const meusCursosInstrutor = cursos.filter((curso) => curso.instrutor._id === user?.id)

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1">
          <div className="bg-muted/30 border-b border-border py-8 px-4">
            <div className="container max-w-6xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {isStudent ? "Meus Cursos" : "Cursos Criados"}
              </h1>
              <p className="text-muted-foreground">
                {isStudent ? "Cursos nos quais você está inscrito" : "Gerencie os cursos criados por você"}
              </p>
            </div>
          </div>

          <div className="py-8 px-4">
            <div className="container max-w-6xl mx-auto">
              {/* ALUNO */}
              {isStudent && (
                <>
                  {loadingEnrollments ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">Carregando seus cursos...</p>
                    </div>
                  ) : myEnrollments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myEnrollments.map((enroll) => (
                        <CourseCard
                          key={enroll.curso._id}
                          id={enroll.curso._id}
                          titulo={enroll.curso.titulo}
                          description={enroll.curso.descricao}
                          instrutor={enroll.curso.instrutor.nome}
                          thumbnail="/curso-placeholder.jpg"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">Você ainda não está inscrito em nenhum curso</p>
                      <Button asChild>
                        <Link href="/courses">Explorar cursos disponíveis</Link>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* INSTRUTOR */}
              {isInstructor && (
                <>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">Carregando seus cursos...</p>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-destructive">Erro ao carregar cursos: {error}</p>
                    </div>
                  ) : meusCursosInstrutor.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {meusCursosInstrutor.map((course) => (
                        <CourseCard
                          key={course._id}
                          id={course._id}
                          titulo={course.titulo}
                          description={course.descricao}
                          instrutor={course.instrutor.nome}
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
                </>
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
