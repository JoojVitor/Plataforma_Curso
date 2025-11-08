"use client";

import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { CourseCard } from "@/components/course-card";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesPage() {
  const { user, isLoading } = useAuth();

  // Dados fictícios dos cursos
  const courses = [
    {
      id: "1",
      title: "Curso de React Completo",
      description: "Aprenda React do zero ao avançado.",
      instructor: "João Silva",
      imageUrl: "/placeholder-course.jpg",
    },
    {
      id: "2",
      title: "Next.js para E-commerce",
      description: "Crie um e-commerce moderno com Next.js.",
      instructor: "Maria Costa",
      imageUrl: "/placeholder-course.jpg",
    },
    {
      id: "3",
      title: "Design UI/UX com Figma",
      description: "Domine o Figma e crie interfaces incríveis.",
      instructor: "Ana Pereira",
      imageUrl: "/placeholder-course.jpg",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <Sidebar userRole={user?.role} />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6">Todos os Cursos</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-64 w-full" />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar userRole={user?.role} />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">Todos os Cursos</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                thumbnail={course.imageUrl}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}