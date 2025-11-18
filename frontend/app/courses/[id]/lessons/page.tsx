"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ApiClient } from "@/lib/api-client"

interface Lesson {
  id?: string
  titulo: string
  url?: string
  duration?: string
  completed?: boolean
}

interface Course {
  _id: string
  titulo: string
  aulas: Lesson[]
}

// Mock de fallback
const mockCourseData = {
  id: "mock",
  titulo: "Desenvolvimento Web Completo com React e Next.js",
  lessons: [
    { id: "1", titulo: "Introdução ao Curso", duration: "10:30", completed: true },
    { id: "2", titulo: "Configurando o Ambiente de Desenvolvimento", duration: "15:45", completed: true },
    { id: "3", titulo: "Fundamentos do React", duration: "25:20", completed: false },
    { id: "4", titulo: "Componentes e Props", duration: "30:15", completed: false },
  ],
}

export default function LessonsPage() {
  const params = useParams()
  const id = params?.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>(mockCourseData.lessons)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await ApiClient.get<{ aulas: Lesson[] }>(`/courses/${id}/lessons`)
        setLessons(data.aulas)
        setCourse({ _id: id, titulo: "Curso Atual", aulas: data.aulas })
      } catch (err: any) {
        console.warn("Falha ao buscar aulas. Usando mock:", err)
        setCourse({ _id: mockCourseData.id, titulo: mockCourseData.titulo, aulas: mockCourseData.lessons })
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [id])

  useEffect(() => {
    const updateDurations = async () => {
      const updated = await Promise.all(
        lessons.map(async (lesson) => {
          const src = lesson.url
          if (!src) return lesson

          return new Promise<Lesson>((resolve) => {
            const video = document.createElement("video")
            video.preload = "metadata"
            video.src = src

            const onLoaded = () => {
              const seconds = isFinite(video.duration) ? video.duration : 0
              const minutes = Math.floor(seconds / 60)
              const secs = Math.floor(seconds % 60)
              const formatted = `${minutes}:${secs.toString().padStart(2, "0")}`
              cleanup()
              resolve({ ...lesson, duration: formatted })
            }

            const onError = () => {
              cleanup()
              resolve({ ...lesson, duration: "--:--" })
            }

            const cleanup = () => {
              video.removeEventListener("loadedmetadata", onLoaded)
              video.removeEventListener("error", onError)
              try {
                video.src = ""
              } catch { }
            }

            video.addEventListener("loadedmetadata", onLoaded)
            video.addEventListener("error", onError)

            if (video.readyState >= 1 && isFinite(video.duration)) {
              onLoaded()
            }
          })
        })
      )

      setLessons(updated)
    }

    if (lessons.some((l) => l.url && !l.duration)) {
      updateDurations()
    }
  }, [lessons])

  const currentLesson = lessons[currentLessonIndex]
  const hasNext = currentLessonIndex < lessons.length - 1
  const hasPrevious = currentLessonIndex > 0

  const goToNext = () => hasNext && setCurrentLessonIndex((i) => i + 1)
  const goToPrevious = () => hasPrevious && setCurrentLessonIndex((i) => i - 1)

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link
              href={`/courses/${course?._id || id}`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4 inline mr-1" />
              Voltar ao Curso
            </Link>
          </div>
          <h1 className="text-sm font-medium truncate max-w-md hidden sm:block">
            {course?.titulo || "Carregando curso..."}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-80 border-r border-border bg-card flex flex-col transition-all duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            "absolute lg:relative z-10 h-full lg:z-0",
          )}
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Conteúdo do Curso</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {lessons.filter((l) => l.completed).length} de {lessons.length} aulas concluídas
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id || index}
                  onClick={() => {
                    setCurrentLessonIndex(index)
                    setSidebarOpen(false)
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors mb-1",
                    currentLessonIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {lesson.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium mb-1 line-clamp-2">{lesson.titulo}</div>
                      <div
                        className={cn(
                          "text-xs transition-colors",
                          currentLessonIndex === index
                            ? "text-white"
                            : "text-muted-foreground"
                        )}
                      >
                        {lesson.duration || "--:--"}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player */}
          <div className="bg-black aspect-video w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">Carregando vídeo...</div>
            ) : currentLesson?.url ? (
              <video key={currentLesson.url} controls className="h-full w-full">
                <source src={currentLesson.url} type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>
            ) : (
              <div className="h-full flex items-center justify-center text-white text-center">
                <div>
                  <p className="text-lg mb-2">Nenhum vídeo disponível</p>
                  <p className="text-sm text-gray-400">Aula: {currentLesson?.titulo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Info and Navigation */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-2 text-balance">{currentLesson?.titulo}</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Duração: {currentLesson?.duration || "Indefinida"}
                </p>

                <Card className="p-6 mb-6">
                  <h3 className="font-semibold mb-3">Sobre esta aula</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    {loading
                      ? "Carregando detalhes da aula..."
                      : `Nesta aula, você aprenderá conceitos importantes sobre ${currentLesson?.titulo?.toLowerCase()}.`}
                  </p>
                </Card>

                <div className="flex items-center justify-between gap-4">
                  <Button variant="outline" onClick={goToPrevious} disabled={!hasPrevious}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Aula Anterior
                  </Button>
                  <Button onClick={goToNext} disabled={!hasNext}>
                    Próxima Aula
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
