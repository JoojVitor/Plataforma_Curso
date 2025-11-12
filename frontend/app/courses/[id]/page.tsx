"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, BookOpen, Play, Edit } from "lucide-react"
import { ApiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

interface Lesson {
  titulo: string
  url: string
}

interface Course {
  _id: string
  titulo: string
  descricao: string
  instrutor: {
    nome: string
    email: string
  }
  aulas: Lesson[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const { user, isAuthenticated, isLoading } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchCourse = async () => {
      try {
        const data = await ApiClient.get<Course>(`/courses/${id}`)
        setCourse(data)
      } catch (err: any) {
        console.error("Erro ao buscar curso:", err)
        setError(err.message || "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <p>Verificando autenticação...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground">
        <Navbar />
        <p>Carregando curso...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Erro ao carregar curso</h1>
            <p className="text-muted-foreground mb-4">{error || "Curso não encontrado"}</p>
            <Button asChild>
              <Link href="/courses">Voltar para Cursos</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isInstructor = user?.role === "instrutor" || user?.role === "admin"

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header do Curso */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">Curso</Badge>
                  <Badge variant="outline">{course.aulas.length} aulas</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                  {course.titulo}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 text-pretty">
                  {course.descricao}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Instrutor: {course.instrutor?.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.aulas.length} aulas disponíveis</span>
                  </div>
                </div>
              </div>

              {/* Card lateral (ações e informações) */}
              <div className="lg:col-span-1">
                <Card>
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    {!isAuthenticated ? (
                      <Button className="w-full" size="lg" asChild>
                        <Link href="/login">Faça login para acessar</Link>
                      </Button>
                    ) : isInstructor ? (
                      <>
                        <Button variant="outline" className="w-full bg-transparent" asChild>
                          <Link href={`/courses/${course._id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Curso
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="w-full" size="lg">
                          Inscrever-se no Curso
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/courses/${course._id}/lessons`}>
                            <Play className="mr-2 h-4 w-4" />
                            Acessar Conteúdo
                          </Link>
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Aulas */}
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Conteúdo do Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {course.aulas.map((aula, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="font-medium">{aula.titulo}</div>
                      </div>
                    </div>
                    {index < course.aulas.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
