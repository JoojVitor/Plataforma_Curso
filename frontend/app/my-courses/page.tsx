"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CourseCard } from "@/components/course-card"
import { ProtectedRoute } from "@/lib/protected-route"
import { useAuth } from "@/lib/auth-context"

const myCourses = [
  {
    id: "1",
    title: "Desenvolvimento Web Completo com React e Next.js",
    description: "Aprenda a criar aplicações web modernas do zero com as tecnologias mais demandadas do mercado.",
    instructor: "Maria Silva",
    thumbnail: "/web-development-coding.png",
    duration: "40h",
    students: 1234,
  },
  {
    id: "2",
    title: "Python para Ciência de Dados e Machine Learning",
    description: "Domine Python e suas bibliotecas para análise de dados, visualização e aprendizado de máquina.",
    instructor: "João Santos",
    thumbnail: "/python-data-science.png",
    duration: "35h",
    students: 892,
  },
]

export default function MyCoursesPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1">
          <div className="bg-muted/30 border-b border-border py-8 px-4">
            <div className="container max-w-6xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Meus Cursos</h1>
              <p className="text-muted-foreground">Continue aprendendo de onde parou</p>
            </div>
          </div>

          <div className="py-8 px-4">
            <div className="container max-w-6xl mx-auto">
              {myCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Você ainda não está inscrito em nenhum curso</p>
                  <Button asChild>
                    <Link href="/courses">Explorar Cursos</Link>
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
