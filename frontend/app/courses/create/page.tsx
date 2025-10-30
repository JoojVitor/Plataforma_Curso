"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Upload, GripVertical } from "lucide-react"

interface Lesson {
  id: string
  title: string
  videoFile: File | null
  videoFileName: string
}

export default function CreateCoursePage() {
  const [lessons, setLessons] = useState<Lesson[]>([{ id: "1", title: "", videoFile: null, videoFileName: "" }])

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      videoFile: null,
      videoFileName: "",
    }
    setLessons([...lessons, newLesson])
  }

  const removeLesson = (id: string) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((lesson) => lesson.id !== id))
    }
  }

  const updateLessonTitle = (id: string, title: string) => {
    setLessons(lessons.map((lesson) => (lesson.id === id ? { ...lesson, title } : lesson)))
  }

  const updateLessonVideo = (id: string, file: File | null) => {
    setLessons(
      lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, videoFile: file, videoFileName: file?.name || "" } : lesson,
      ),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Course data:", { lessons })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={{ name: "Instrutor", role: "instrutor" }} />

      <div className="flex-1 flex">
        <Sidebar userRole="instrutor" />

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
                    <Label htmlFor="title">Título do Curso *</Label>
                    <Input id="title" placeholder="Ex: Desenvolvimento Web com React" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição Curta *</Label>
                    <Textarea
                      id="description"
                      placeholder="Uma breve descrição do curso (máximo 200 caracteres)"
                      rows={3}
                      maxLength={200}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="long-description">Descrição Completa *</Label>
                    <Textarea
                      id="long-description"
                      placeholder="Descreva detalhadamente o que os alunos aprenderão neste curso"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria *</Label>
                      <Select required>
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
                      <Label htmlFor="level">Nível *</Label>
                      <Select required>
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

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Imagem de Capa</Label>
                    <div className="flex items-center gap-4">
                      <Input id="thumbnail" type="file" accept="image/*" className="flex-1" />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recomendado: 1280x720px (16:9)</p>
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
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`lesson-title-${lesson.id}`}>Título da Aula *</Label>
                        <Input
                          id={`lesson-title-${lesson.id}`}
                          value={lesson.title}
                          onChange={(e) => updateLessonTitle(lesson.id, e.target.value)}
                          placeholder="Ex: Introdução ao React"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`lesson-video-${lesson.id}`}>Vídeo da Aula *</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id={`lesson-video-${lesson.id}`}
                            type="file"
                            accept="video/*"
                            onChange={(e) => updateLessonVideo(lesson.id, e.target.files?.[0] || null)}
                            className="flex-1"
                            required
                          />
                          {lesson.videoFileName && (
                            <span className="text-sm text-muted-foreground truncate max-w-xs">
                              {lesson.videoFileName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Formatos aceitos: MP4, MOV, AVI (máx. 500MB)</p>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addLesson} className="w-full bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Aula
                  </Button>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-between gap-4">
                <Button type="button" variant="outline" asChild className="bg-transparent">
                  <Link href="/dashboard">Cancelar</Link>
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="bg-transparent">
                    Salvar Rascunho
                  </Button>
                  <Button type="submit">Publicar Curso</Button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
