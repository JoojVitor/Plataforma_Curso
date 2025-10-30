import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, BookOpen, Star, Play, Edit } from "lucide-react"

// Mock data - in a real app, this would come from a database
const courseData = {
  "1": {
    id: "1",
    title: "Desenvolvimento Web Completo com React e Next.js",
    description:
      "Aprenda a criar aplicações web modernas do zero com as tecnologias mais demandadas do mercado. Este curso abrangente cobre desde os fundamentos até técnicas avançadas de desenvolvimento.",
    longDescription:
      "Neste curso completo, você aprenderá tudo o que precisa para se tornar um desenvolvedor web profissional. Começaremos com os fundamentos do HTML, CSS e JavaScript, e então mergulharemos profundamente em React e Next.js. Você construirá projetos reais e aprenderá as melhores práticas da indústria.",
    instructor: "Maria Silva",
    instructorBio: "Desenvolvedora Full Stack com 10 anos de experiência em empresas de tecnologia.",
    thumbnail: "/web-development-coding.png",
    duration: "40h",
    students: 1234,
    rating: 4.8,
    reviews: 342,
    level: "Intermediário",
    category: "Desenvolvimento",
    lessons: [
      { id: "1", title: "Introdução ao Curso", duration: "10:30", completed: false },
      { id: "2", title: "Configurando o Ambiente de Desenvolvimento", duration: "15:45", completed: false },
      { id: "3", title: "Fundamentos do React", duration: "25:20", completed: false },
      { id: "4", title: "Componentes e Props", duration: "30:15", completed: false },
      { id: "5", title: "State e Lifecycle", duration: "28:40", completed: false },
      { id: "6", title: "Hooks do React", duration: "35:25", completed: false },
      { id: "7", title: "Introdução ao Next.js", duration: "20:10", completed: false },
      { id: "8", title: "Roteamento no Next.js", duration: "22:35", completed: false },
      { id: "9", title: "Server Components", duration: "30:50", completed: false },
      { id: "10", title: "Projeto Final", duration: "45:00", completed: false },
    ],
  },
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = courseData[id as keyof typeof courseData]

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Curso não encontrado</h1>
            <Button asChild>
              <Link href="/courses">Voltar para Cursos</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Mock user - in a real app, this would come from authentication
  const currentUser = { role: "aluno" as const, isEnrolled: false }
  const isInstructor = currentUser.role === "instrutor"

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={{ name: "Usuário Teste", role: currentUser.role }} />

      <div className="flex-1">
        {/* Course Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6 text-pretty">{course.description}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-muted-foreground">({course.reviews} avaliações)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.students} alunos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration} de conteúdo</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{course.instructor[0]}</span>
                  </div>
                  <div>
                    <div className="font-medium">{course.instructor}</div>
                    <div className="text-sm text-muted-foreground">{course.instructorBio}</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    {currentUser.isEnrolled ? (
                      <Button className="w-full" size="lg" asChild>
                        <Link href={`/courses/${course.id}/lessons`}>
                          <Play className="mr-2 h-4 w-4" />
                          Continuar Assistindo
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" size="lg">
                        Inscrever-se no Curso
                      </Button>
                    )}
                    {isInstructor && (
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/courses/${course.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Curso
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>Sobre o Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{course.longDescription}</p>
                </CardContent>
              </Card>

              {/* Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Conteúdo do Curso
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {course.lessons.length} aulas • {course.duration}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.lessons.map((lesson, index) => (
                      <div key={lesson.id}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{lesson.title}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.duration}
                          </div>
                        </div>
                        {index < course.lessons.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>O que você vai aprender</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Fundamentos de React e Next.js</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Componentes e gerenciamento de estado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Roteamento e navegação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Server Components e SSR</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Melhores práticas de desenvolvimento</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
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
