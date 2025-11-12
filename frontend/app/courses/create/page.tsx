"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/lib/protected-route"
import { VideoUpload } from "@/components/video-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { ApiClient } from "@/lib/api-client"

interface Lesson {
  id: string
  titulo: string
  url: string
}

interface CourseFormData {
  titulo: string
  descricao: string
  categoria?: string
  nivel?: string
  aulas: Lesson[]
}

export default function CreateCoursePage() {
  const { user } = useAuth()
  const router = useRouter()

  const [courseData, setCourseData] = useState<CourseFormData>({
    titulo: "",
    descricao: "",
    categoria: "",
    nivel: "",
    aulas: [{ id: "1", titulo: "", url: "" }],
  })

  const [lessons, setLessons] = useState<Lesson[]>([{ id: "1", titulo: "", url: "" }])
  const [submitting, setSubmitting] = useState(false)
  const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(null)

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      titulo: "",
      url: "",
    }
    setLessons([...lessons, newLesson])
  }

  const removeLesson = (id: string) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((lesson) => lesson.id !== id))
    }
  }

  const updateLessonTitle = (id: string, titulo: string) => {
    setLessons(lessons.map((lesson) => (lesson.id === id ? { ...lesson, titulo } : lesson)))
  }

  const handleUploadSuccess = (key: string, fileName: string, lessonId: string) => {
    console.log("[v0] Upload success for lesson:", lessonId, "key:", key)
    setLessons(lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, url: key } : lesson)))
    setUploadingLessonId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!courseData.titulo.trim()) {
      toast("Campo obrigatório", {
        description: "Por favor, preencha o título do curso"
      })
      return
    }

    if (!courseData.descricao.trim()) {
      toast("Campo obrigatório", {
        description: "Por favor, preencha a descrição do curso"
      })
      return
    }

    if (lessons.length === 0 || lessons.some((l) => !l.titulo || !l.url)) {
      toast("Aulas incompletas", {
        description: "Todas as aulas precisam de título e vídeo"
      })
      return
    }

    setSubmitting(true)

    try {
      console.log("[v0] Submitting course with payload:", {
        titulo: courseData.titulo,
        descricao: courseData.descricao,
        aulas: lessons,
      })

      await ApiClient.createCourse({
        titulo: courseData.titulo,
        descricao: courseData.descricao,
        categoria: courseData.categoria || "",
        nivel: courseData.nivel || "",
        aulas: lessons,
      })

      toast("Sucesso!", {
        description: "Curso criado com sucesso. Redirecionando...",
      })

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("[v0] Course creation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar curso"

      toast("Erro ao criar curso", {
        description: errorMessage
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ProtectedRoute requiredRole={["instrutor", "admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 flex">
          <Sidebar userRole={user?.role === "admin" ? "admin" : "instrutor"} />

          <main className="flex-1 overflow-auto">
            <div className="container max-w-4xl mx-auto px-4 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Criar Novo Curso</h1>
                <p className="text-muted-foreground">Preencha as informações abaixo para criar seu curso</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                    <CardDescription>Dados principais do seu curso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título do Curso *</Label>
                      <Input
                        id="titulo"
                        placeholder="Ex: Desenvolvimento Web com React"
                        value={courseData.titulo}
                        onChange={(e) => setCourseData({ ...courseData, titulo: e.target.value })}
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição do Curso *</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva em detalhes o que os alunos aprenderão neste curso"
                        rows={4}
                        value={courseData.descricao}
                        onChange={(e) => setCourseData({ ...courseData, descricao: e.target.value })}
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select
                          value={courseData.categoria}
                          onValueChange={(value) => setCourseData({ ...courseData, categoria: value })}
                          disabled={submitting}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="negocios">Negócios</SelectItem>
                            <SelectItem value="fotografia">Fotografia</SelectItem>
                            <SelectItem value="ciencia-dados">Ciência de Dados</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level">Nível</Label>
                        <Select
                          value={courseData.nivel}
                          onValueChange={(value) => setCourseData({ ...courseData, nivel: value })}
                          disabled={submitting}
                        >
                          <SelectTrigger id="level">
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iniciante">Iniciante</SelectItem>
                            <SelectItem value="intermediario">Intermediário</SelectItem>
                            <SelectItem value="avancado">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lessons */}
                <Card>
                  <CardHeader>
                    <CardTitle>Aulas do Curso</CardTitle>
                    <CardDescription>Adicione as aulas e faça upload dos vídeos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} className="p-4 border border-border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                            <span className="font-medium">Aula {index + 1}</span>
                          </div>
                          {lessons.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLesson(lesson.id)}
                              className="text-destructive hover:text-destructive"
                              disabled={submitting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`lesson-titulo-${lesson.id}`}>Título da Aula *</Label>
                          <Input
                            id={`lesson-titulo-${lesson.id}`}
                            value={lesson.titulo}
                            onChange={(e) => updateLessonTitle(lesson.id, e.target.value)}
                            placeholder="Ex: Introdução ao React"
                            required
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`lesson-video-${lesson.id}`}>Vídeo da Aula *</Label>
                          <VideoUpload
                            onUploadSuccess={(key, fileName) => handleUploadSuccess(key, fileName, lesson.id)}
                            onUploadStart={() => setUploadingLessonId(lesson.id)}
                            onUploadEnd={() => setUploadingLessonId(null)}
                          />
                          {lesson.url && <p className="text-xs text-green-600">Video enviado: {lesson.url}</p>}
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addLesson}
                      className="w-full bg-transparent"
                      disabled={submitting || uploadingLessonId !== null}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Aula
                    </Button>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4">
                  <Button type="button" variant="outline" asChild className="bg-transparent" disabled={submitting}>
                    <Link href="/dashboard">Cancelar</Link>
                  </Button>
                  <Button type="submit" disabled={submitting || uploadingLessonId !== null}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      "Publicar Curso"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
