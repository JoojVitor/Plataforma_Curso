import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CourseCard } from "@/components/course-card"
import { BookOpen, Users, Award, TrendingUp } from "lucide-react"

// Mock data for featured courses
const featuredCourses = [
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
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-linear-to-b from-primary/10 to-background py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Aprenda com os Melhores Instrutores
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Milhares de cursos online para você desenvolver suas habilidades e alcançar seus objetivos profissionais
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Começar Agora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/courses">Explorar Cursos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 border-b border-border">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Cursos</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">50k+</div>
              <div className="text-sm text-muted-foreground">Alunos</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">200+</div>
              <div className="text-sm text-muted-foreground">Instrutores</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Cursos em Destaque</h2>
              <p className="text-muted-foreground">Os cursos mais populares da plataforma</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
              <Link href="/courses">Ver Todos</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/courses">Ver Todos os Cursos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Pronto para Começar sua Jornada?</h2>
          <p className="text-lg mb-8 opacity-90 text-pretty">
            Junte-se a milhares de alunos que já estão transformando suas carreiras
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Criar Conta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 mt-auto">
        <div className="container max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Plataforma Cursos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
