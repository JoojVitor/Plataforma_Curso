"use client"

import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/lib/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useCourses } from "@/hooks/use-courses"

export default function DashboardPage() {
  const { user } = useAuth()
  const { cursos, isLoading, error } = useCourses()

  const meusCursos = cursos.filter((curso) => curso.instrutor._id === user?.id)

  return (
    <ProtectedRoute requiredRole={["instrutor", "admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 flex">
          <Sidebar userRole={user?.role === "admin" ? "admin" : "instrutor"} />

          <main className="flex-1 overflow-auto bg-muted/30">
            <div className="container max-w-6xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                  <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo da sua atividade.</p>
                </div>
                <Button asChild>
                  <Link href="/courses/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Curso
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cursos</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{meusCursos.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Cursos publicados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Alunos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3,456</div>
                    <p className="text-xs text-muted-foreground mt-1">+234 este mês</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground mt-1">+5% este mês</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Meus Cursos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">Carregando cursos...</p>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-destructive">Erro ao carregar cursos: {error}</p>
                    </div>
                  ) : meusCursos.length > 0 ? (
                    <div className="space-y-4">
                      {meusCursos.map((course) => (
                        <div
                          key={course._id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium">{course.titulo}</h3>
                            <p className="text-sm text-muted-foreground">
                              {course.aulas.length} aulas · {course.descricao.substring(0, 50)}...
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Publicado
                            </span>
                            <Button variant="outline" size="sm" asChild className="bg-transparent">
                              <Link href={`/courses/${course._id}`}>Ver</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Você ainda não criou nenhum curso</p>
                      <Button asChild>
                        <Link href="/courses/create">Criar Primeiro Curso</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
