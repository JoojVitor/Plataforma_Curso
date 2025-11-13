"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  Users,
  BookOpen,
  Play,
  Edit,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { ApiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { VideoPlayer } from "./components/video-player"

interface Lesson {
  titulo: string
  url: string
  duration?: string
  completed?: boolean
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
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchCourseAndLessons = async () => {
      try {
        const data = await ApiClient.get<Course>(`/courses/${id}`)
        setCourse(data)

        if (isAuthenticated) {
          try {
            const lessonsData = await ApiClient.get<{ aulas: Lesson[] }>(`/courses/${id}/lessons`)
            setLessons(lessonsData.aulas)
            setSelectedLesson(lessonsData.aulas[0])
            setIsEnrolled(true)
          } catch (err: any) {
            console.warn("Usuário não inscrito ou sem acesso:", err)
            setIsEnrolled(false)
          }
        }
      } catch (err: any) {
        console.error("Erro ao buscar curso:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseAndLessons()
  }, [id, isAuthenticated])

  // 🔹 Calcula a duração individual de cada vídeo
  useEffect(() => {
    const updateDurations = async () => {
      const updatedLessons = await Promise.all(
        lessons.map(async (lesson) => {
          if (!lesson.url || lesson.duration) return lesson

          return new Promise<Lesson>((resolve) => {
            const video = document.createElement("video")
            video.src = lesson.url
            video.preload = "metadata"

            video.addEventListener("loadedmetadata", () => {
              const seconds = video.duration
              const minutes = Math.floor(seconds / 60)
              const secs = Math.floor(seconds % 60)
              const formatted = `${minutes}:${secs.toString().padStart(2, "0")}`
              resolve({ ...lesson, duration: formatted })
            })

            video.addEventListener("error", () => resolve({ ...lesson, duration: "--:--" }))
          })
        }),
      )

      setLessons(updatedLessons)
    }

    if (lessons.some((l) => !l.duration && l.url)) {
      updateDurations()
    }
  }, [lessons])

  const totalDuration = useMemo(() => {
    const toSeconds = (duration?: string) => {
      if (!duration || duration === "--:--") return 0
      const [min, sec] = duration.split(":").map(Number)
      return min * 60 + sec
    }

    const totalSeconds = lessons.reduce((sum, l) => sum + toSeconds(l.duration), 0)
    const totalMinutes = Math.floor(totalSeconds / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) return `${hours}h ${minutes}min`
    if (minutes > 0) return `${minutes}min`
    return "—"
  }, [lessons])

  const handleEnroll = async () => {
    try {
      setFeedback(null)
      await ApiClient.post(`/enrollments/${id}`, {})

      setIsEnrolled(true)
      setFeedback({ type: "success", message: "Inscrição realizada com sucesso!" })

      const lessonsData = await ApiClient.get<{ aulas: Lesson[] }>(`/courses/${id}/lessons`)
      setLessons(lessonsData.aulas)
      setSelectedLesson(lessonsData.aulas[0])
    } catch (err: any) {
      console.error("Erro ao inscrever:", err)
      setFeedback({ type: "error", message: err.message || "Falha ao se inscrever no curso." })
    }
  }

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
        {/* Cabeçalho do curso */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">Curso</Badge>
                  <Badge variant="outline">{lessons.length} aulas</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{course.titulo}</h1>
                <p className="text-lg text-muted-foreground mb-6 text-pretty">{course.descricao}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Instrutor: {course.instrutor?.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{totalDuration || "—"} de conteúdo</span>
                  </div>
                </div>
              </div>

              {/* Card lateral */}
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
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/courses/${course._id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Curso
                        </Link>
                      </Button>
                    ) : isEnrolled ? (
                      <Button className="w-full" size="lg" asChild>
                        <Link href={`/courses/${course._id}/lessons`}>
                          <Play className="mr-2 h-4 w-4" />
                          Acessar Conteúdo
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" size="lg" onClick={handleEnroll}>
                        Inscrever-se no Curso
                      </Button>
                    )}

                    {feedback && (
                      <div
                        className={`flex items-center gap-2 text-sm border rounded-lg p-3 ${
                          feedback.type === "success"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-destructive text-destructive bg-destructive/10"
                        }`}
                      >
                        {feedback.type === "success" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <span>{feedback.message}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Player de vídeo */}
        {isEnrolled && selectedLesson && (
          <div className="container max-w-4xl mx-auto px-4 py-8">
            <VideoPlayer videoUrl={selectedLesson.url} titulo={selectedLesson.titulo} />
          </div>
        )}

        {/* Lista de aulas */}
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
                {lessons.length > 0 ? (
                  lessons.map((aula, index) => (
                    <div key={index}>
                      <div
                        onClick={() => setSelectedLesson(aula)}
                        className={`flex flex-col p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedLesson?.titulo === aula.titulo
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="font-medium">{aula.titulo}</div>
                        </div>
                        <span className="ml-11 text-xs text-muted-foreground mt-1">
                          {aula.duration || "--:--"}
                        </span>
                      </div>
                      {index < lessons.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isAuthenticated
                      ? "Nenhuma aula disponível no momento."
                      : "Faça login para visualizar as aulas."}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
