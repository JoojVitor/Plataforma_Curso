"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/lib/protected-route";
import { VideoUpload } from "@/components/video-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api-client";

interface Lesson {
  id: string;
  titulo: string;
  url: string;
}

interface CreateCoursePageProps {
  existingCourse?: any;
}

export default function CreateCoursePage({ existingCourse }: CreateCoursePageProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [courseData, setCourseData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    nivel: "",
  });

  const [lessons, setLessons] = useState<Lesson[]>([
    { id: "1", titulo: "", url: "" },
  ]);

  const [pendingUploads, setPendingUploads] = useState<Record<string, File>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingCourse) {
      const normalizedLessons = existingCourse.aulas.map((lesson: any) => ({
        ...lesson,
        id: lesson.id || lesson._id || String(Date.now() + Math.random()),
      }));

      setCourseData({
        titulo: existingCourse.titulo,
        descricao: existingCourse.descricao,
        categoria: existingCourse.categoria || "",
        nivel: existingCourse.nivel || "",
      });

      setLessons(normalizedLessons);
    }
  }, [existingCourse]);

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      titulo: "",
      url: "",
    };
    setLessons([...lessons, newLesson]);
  };

  const removeLesson = (id: string) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter(l => l.id !== id));
      setPendingUploads(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const updateLessonTitle = (id: string, titulo: string) => {
    setLessons(prev => prev.map(l => (l.id === id ? { ...l, titulo } : l)));
  };

  const handleFileSelected = (lessonId: string, file: File) => {
    setPendingUploads(prev => ({ ...prev, [lessonId]: file }));

    setLessons(prev =>
      prev.map(l => (l.id === lessonId ? { ...l, url: file.name } : l))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseData.titulo.trim() || !courseData.descricao.trim()) {
      toast("Campos obrigatórios", {
        description: "Preencha título e descrição",
      });
      return;
    }

    if (lessons.some(l => !l.titulo || !l.url)) {
      toast("Aulas incompletas", {
        description: "Todas as aulas precisam de título e vídeo",
      });
      return;
    }

    setSubmitting(true);

    try {
      const uploadedKeys: Record<string, string> = {};

      for (const lesson of lessons) {
        const file = pendingUploads[lesson.id];
        if (!file) continue;

        const { uploadUrl, key } = await ApiClient.uploadVideo(
          file.name,
          file.type
        );

        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        uploadedKeys[lesson.id] = key;
      }

      const aulasFinal = lessons.map(lesson => ({
        ...lesson,
        url: uploadedKeys[lesson.id] ?? lesson.url,
      }));

      if (existingCourse) {
        await ApiClient.updateCourse(existingCourse._id || existingCourse.id, {
          ...courseData,
          aulas: aulasFinal,
        });

        toast("Sucesso!", {
          description: "Curso atualizado com sucesso!",
        });

        return router.push("/my-courses");
      }

      await ApiClient.createCourse({
        ...courseData,
        aulas: aulasFinal,
      });

      toast("Sucesso!", {
        description: "Curso criado com sucesso!",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast("Erro", {
        description: "Não foi possível salvar o curso",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredRole={["instrutor", "admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 flex">
          <Sidebar userRole={user?.role === "admin" ? "admin" : "instrutor"} />

          <main className="flex-1 overflow-auto">
            <div className="container max-w-4xl mx-auto px-4 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {existingCourse ? "Editar Curso" : "Criar Novo Curso"}
                </h1>
                <p className="text-muted-foreground">
                  Preencha as informações abaixo
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                    <CardDescription>Dados principais do curso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Título */}
                    <div className="space-y-2">
                      <Label>Título *</Label>
                      <Input
                        value={courseData.titulo}
                        onChange={e =>
                          setCourseData({
                            ...courseData,
                            titulo: e.target.value,
                          })
                        }
                        disabled={submitting}
                      />
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                      <Label>Descrição *</Label>
                      <Textarea
                        rows={4}
                        value={courseData.descricao}
                        onChange={e =>
                          setCourseData({
                            ...courseData,
                            descricao: e.target.value,
                          })
                        }
                        disabled={submitting}
                      />
                    </div>

                    {/* Categoria & Nível */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select
                          value={courseData.categoria}
                          onValueChange={value =>
                            setCourseData({
                              ...courseData,
                              categoria: value,
                            })
                          }
                          disabled={submitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Categoria" />
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
                        <Label>Nível</Label>
                        <Select
                          value={courseData.nivel}
                          onValueChange={value =>
                            setCourseData({
                              ...courseData,
                              nivel: value,
                            })
                          }
                          disabled={submitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Nível" />
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
                    <CardTitle>Aulas</CardTitle>
                    <CardDescription>Adicione o conteúdo do curso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="p-4 border border-border rounded-lg space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Aula {index + 1}</span>
                          </div>

                          {lessons.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLesson(lesson.id)}
                              disabled={submitting}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* Título da aula */}
                        <div className="space-y-2">
                          <Label>Título da Aula *</Label>
                          <Input
                            value={lesson.titulo}
                            onChange={e =>
                              updateLessonTitle(lesson.id, e.target.value)
                            }
                            disabled={submitting}
                          />
                        </div>

                        {/* Vídeo */}
                        <div className="space-y-2">
                          <Label>Vídeo da Aula *</Label>

                          <VideoUpload
                            onFileSelected={(file: File) =>
                              handleFileSelected(lesson.id, file)
                            }
                            disabled={submitting}
                          />

                          {lesson.url && (
                            <p className="text-xs text-green-600">
                              Vídeo selecionado: {lesson.url}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addLesson}
                      disabled={submitting}
                      className="w-full bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Aula
                    </Button>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4">
                  <Button type="button" variant="outline" asChild disabled={submitting}>
                    <Link href="/dashboard">Cancelar</Link>
                  </Button>

                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : existingCourse ? (
                      "Salvar Alterações"
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
  );
}
