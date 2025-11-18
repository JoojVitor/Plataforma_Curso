"use client"

import { useEffect, useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { CourseCard } from "@/components/course-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { ApiClient } from "@/lib/api-client"

interface Course {
  _id: string
  titulo: string
  descricao: string
  instrutor: {
    nome: string
    email: string
  }
  categoria?: string
  aulas?: { titulo: string; url: string }[]
}

// Mock para visual
const mockCourses = [
  {
    id: "1",
    titulo: "Desenvolvimento Web Completo com React e Next.js",
    descricao:
      "Aprenda a criar aplicações web modernas do zero com as tecnologias mais demandadas do mercado.",
    instrutor: "Maria Silva",
    thumbnail: "/web-development-coding.png",
    duration: "40h",
    students: 1234,
    categoria: "Desenvolvimento",
  },
  {
    id: "2",
    titulo: "Python para Ciência de Dados e Machine Learning",
    descricao:
      "Domine Python e suas bibliotecas para análise de dados, visualização e aprendizado de máquina.",
    instrutor: "João Santos",
    thumbnail: "/python-data-science.png",
    duration: "35h",
    students: 892,
    categoria: "Ciência de Dados",
  },
  {
    id: "3",
    titulo: "Design UI/UX: Do Conceito ao Protótipo",
    descricao: "Aprenda os fundamentos de design de interfaces e experiência do usuário.",
    instrutor: "Ana Costa",
    thumbnail: "/ui-ux-design-concept.png",
    duration: "25h",
    students: 567,
    categoria: "Design",
  },
]

const categories = [
  "Todas as Categorias",
  "Desenvolvimento",
  "Design",
  "Marketing",
  "Negócios",
  "Fotografia",
  "Ciência de Dados",
]

export default function CoursesPage() {
  const [backendCourses, setBackendCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas as Categorias")
  const [sortOption, setSortOption] = useState("popular")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await ApiClient.get<Course[]>("/courses")
        setBackendCourses(data)
      } catch (err: any) {
        console.error("Erro ao buscar cursos:", err)
        setError("Erro ao carregar cursos disponíveis.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const combinedCourses = useMemo(() => {
    const backFormatted = backendCourses.map((course) => ({
      id: course._id,
      titulo: course.titulo,
      descricao: course.descricao,
      instrutor: course.instrutor?.nome || "Instrutor",
      thumbnail: "/course-placeholder.png",
      duration: `${course.aulas?.length || 0} aulas`,
      students: Math.floor(Math.random() * 500) + 50,
      categoria: course.categoria || "Desenvolvimento",
    }))

    return [...backFormatted, ...mockCourses]
  }, [backendCourses])

  const filteredCourses = useMemo(() => {
    let result = [...combinedCourses]

    if (searchTerm.trim()) {
      result = result.filter((c) =>
        (c.titulo + c.descricao)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "Todas as Categorias") {
      result = result.filter((c) => c.categoria === selectedCategory)
    }

    if (sortOption === "recent") {
      result.sort((a, b) => (a.id < b.id ? 1 : -1))
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.students - a.students)
    }

    return result
  }, [combinedCourses, searchTerm, selectedCategory, sortOption])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border py-8 px-4">
          <div className="container max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Todos os Cursos</h1>
            <p className="text-muted-foreground">Explore nossa biblioteca completa de cursos</p>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-border py-6 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* 🔍 Busca */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cursos..."
                  className="pl-10"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Categorias */}
              <Select
                value={selectedCategory}
                onValueChange={(val) =>
                  setSelectedCategory(
                    categories.find((c) => c.toLowerCase().replace(/\s+/g, "-") === val) ||
                      "Todas as Categorias"
                  )
                }
              >
                <SelectTrigger className="w-full md:w-64">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category.toLowerCase().replace(/\s+/g, "-")}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Ordenação */}
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Mais Populares</SelectItem>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="rating">Melhor Avaliados</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="py-8 px-4">
          <div className="container max-w-6xl mx-auto">
            {loading ? (
              <p className="text-muted-foreground text-center py-10">
                Carregando cursos...
              </p>
            ) : error ? (
              <p className="text-destructive text-center py-10">{error}</p>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  {filteredCourses.length} cursos encontrados
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      titulo={course.titulo}
                      descricao={course.descricao}
                      instrutor={course.instrutor}
                      thumbnail={course.thumbnail}
                      duration={course.duration}
                      students={course.students}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 mt-auto">
        <div className="container max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Plataforma Cursos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
