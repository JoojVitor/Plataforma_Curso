import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={{ name: "Instrutor", role: "instrutor" }} />

      <div className="flex-1 flex">
        <Sidebar userRole="instrutor" />

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
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-1">+2 este mês</p>
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
                <div className="space-y-4">
                  {[
                    { title: "Desenvolvimento Web com React", students: 1234, status: "Publicado" },
                    { title: "Python para Iniciantes", students: 892, status: "Publicado" },
                    { title: "Design UI/UX Avançado", students: 567, status: "Rascunho" },
                  ].map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.students} alunos inscritos</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            course.status === "Publicado"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {course.status}
                        </span>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
