import { Navbar } from "@/components/navbar"
import { CourseCard } from "@/components/course-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

// Mock data for all courses
const allCourses = [
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
  {
    id: "3",
    title: "Design UI/UX: Do Conceito ao Protótipo",
    description: "Aprenda os fundamentos de design de interfaces e experiência do usuário com projetos práticos.",
    instructor: "Ana Costa",
    thumbnail: "/ui-ux-design-concept.png",
    duration: "25h",
    students: 567,
  },
  {
    id: "4",
    title: "JavaScript Moderno: ES6+ e Além",
    description: "Domine as features modernas do JavaScript e escreva código mais limpo e eficiente.",
    instructor: "Carlos Oliveira",
    thumbnail: "/javascript-programming.png",
    duration: "30h",
    students: 1456,
  },
  {
    id: "5",
    title: "Marketing Digital e Redes Sociais",
    description: "Aprenda estratégias de marketing digital para impulsionar seu negócio nas redes sociais.",
    instructor: "Fernanda Lima",
    thumbnail: "/digital-marketing-social-media.png",
    duration: "20h",
    students: 789,
  },
  {
    id: "6",
    title: "Fotografia Profissional para Iniciantes",
    description: "Descubra os fundamentos da fotografia e aprenda a capturar imagens incríveis.",
    instructor: "Roberto Alves",
    thumbnail: "/professional-photography-camera.jpg",
    duration: "15h",
    students: 432,
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
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" placeholder="Buscar cursos..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-64">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="popular">
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
            <div className="mb-4 text-sm text-muted-foreground">{allCourses.length} cursos encontrados</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
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
