"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data
const courseData = {
  id: "1",
  title: "Desenvolvimento Web Completo com React e Next.js",
  lessons: [
    { id: "1", title: "Introdução ao Curso", duration: "10:30", videoUrl: "#", completed: true },
    { id: "2", title: "Configurando o Ambiente de Desenvolvimento", duration: "15:45", videoUrl: "#", completed: true },
    { id: "3", title: "Fundamentos do React", duration: "25:20", videoUrl: "#", completed: false },
    { id: "4", title: "Componentes e Props", duration: "30:15", videoUrl: "#", completed: false },
    { id: "5", title: "State e Lifecycle", duration: "28:40", videoUrl: "#", completed: false },
    { id: "6", title: "Hooks do React", duration: "35:25", videoUrl: "#", completed: false },
    { id: "7", title: "Introdução ao Next.js", duration: "20:10", videoUrl: "#", completed: false },
    { id: "8", title: "Roteamento no Next.js", duration: "22:35", videoUrl: "#", completed: false },
    { id: "9", title: "Server Components", duration: "30:50", videoUrl: "#", completed: false },
    { id: "10", title: "Projeto Final", duration: "45:00", videoUrl: "#", completed: false },
  ],
}

export default function LessonsPage() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const currentLesson = courseData.lessons[currentLessonIndex]
  const hasNext = currentLessonIndex < courseData.lessons.length - 1
  const hasPrevious = currentLessonIndex > 0

  const goToNext = () => {
    if (hasNext) setCurrentLessonIndex(currentLessonIndex + 1)
  }

  const goToPrevious = () => {
    if (hasPrevious) setCurrentLessonIndex(currentLessonIndex - 1)
  }

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
              href={`/courses/${courseData.id}`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4 inline mr-1" />
              Voltar ao Curso
            </Link>
          </div>
          <h1 className="text-sm font-medium truncate max-w-md hidden sm:block">{courseData.title}</h1>
          <div className="w-20" /> {/* Spacer for centering */}
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
              {courseData.lessons.filter((l) => l.completed).length} de {courseData.lessons.length} aulas concluídas
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {courseData.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
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
                      <div className="text-sm font-medium mb-1 line-clamp-2">{lesson.title}</div>
                      <div
                        className={cn("text-xs", currentLessonIndex === index ? "opacity-90" : "text-muted-foreground")}
                      >
                        {lesson.duration}
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
            <div className="h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-lg mb-2">Player de Vídeo</div>
                <div className="text-sm text-gray-400">Aula: {currentLesson.title}</div>
              </div>
            </div>
          </div>

          {/* Lesson Info and Navigation */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-2 text-balance">{currentLesson.title}</h2>
                <p className="text-sm text-muted-foreground mb-6">Duração: {currentLesson.duration}</p>

                <Card className="p-6 mb-6">
                  <h3 className="font-semibold mb-3">Sobre esta aula</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    Nesta aula, você aprenderá conceitos importantes sobre {currentLesson.title.toLowerCase()}.
                    Acompanhe o vídeo com atenção e pratique os exemplos apresentados para fixar o conteúdo.
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
