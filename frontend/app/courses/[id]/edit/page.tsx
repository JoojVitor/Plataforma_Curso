"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, redirect } from "next/navigation";
import { ApiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import CreateCoursePage from "../../create/page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface Lesson {
  id?: string;
  _id?: string;
  titulo: string;
  url: string;
}

export interface Instructor {
  _id: string;
  nome: string;
  email: string;
}

export interface Course {
  _id?: string;
  id?: string;
  titulo: string;
  descricao: string;
  categoria?: string;
  nivel?: string;
  instrutor?: Instructor | string;
  aulas: Lesson[];
  criadoEm?: string | Date;
}


export default function EditCoursePage() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [existingCourse, setExistingCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "instrutor" && user.role !== "admin") {
      redirect("/dashboard");
      return;
    }

    ApiClient.getCourseById<Course>(id as string)
      .then((course) => {
        const normalizedLessons = course.aulas.map((a: any) => ({
          id: a._id || a.id,
          titulo: a.titulo,
          url: a.url,
        }));

        course.aulas = normalizedLessons;
        course.id = course._id;

        setExistingCourse(course);
      })
      .catch((err) => {
        if (err.message.includes("403")) redirect("/my-courses");
        if (err.message.includes("404")) redirect("/not-found");
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleDeleteCourse = async () => {
    if (!existingCourse) return;

    try {
      setDeleting(true);

      await ApiClient.deleteCourse(existingCourse.id || existingCourse._id);

      toast("Curso excluído", {
        description: "O curso foi removido permanentemente."
      });

      router.push("/my-courses");
    } catch (err) {
      toast("Erro ao excluir curso", {
        description: "Não foi possível excluir o curso."
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;
  if (!existingCourse) return <p className="p-6">Curso não encontrado.</p>;

  const isOwner = existingCourse?.instrutor?._id === user?.id;

  return (
    <div className="space-y-12">
      <CreateCoursePage existingCourse={existingCourse} />

      {isOwner && (
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="border border-red-500/40">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                A exclusão de um curso é permanente e não pode ser desfeita.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm">
                Para excluir este curso, digite o nome dele abaixo para confirmar.
              </p>

              <Input
                placeholder={`Digite: ${existingCourse.titulo}`}
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                className="border-red-500/50 focus-visible:ring-red-500"
              />

              <Button
                variant="destructive"
                disabled={confirmName !== existingCourse.titulo || deleting}
                onClick={handleDeleteCourse}
                className="w-full"
              >
                {deleting ? "Excluindo..." : "Excluir Curso Permanentemente"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
