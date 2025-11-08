"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateCoursePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Efeito para proteger a rota
  useEffect(() => {
    if (isLoading) {
      return; // Aguarda o carregamento
    }
    // Se não estiver autenticado OU não for instrutor/admin, redireciona
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "instrutor" && user?.role !== "admin") {
      router.push("/dashboard"); // Redireciona para o dashboard se não tiver permissão
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Estado de Loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <Sidebar userRole={user?.role} />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <Skeleton className="h-96 w-full" />
          </main>
        </div>
      </div>
    );
  }

  // Estado Autenticado e Autorizado
  // (O useEffect cuidará do redirecionamento se não estiver)
  if (isAuthenticated && (user?.role === "instrutor" || user?.role === "admin")) {
    return (
      <div className="flex min-h-screen w-full">
        <Sidebar userRole={user.role} />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Curso</CardTitle>
                <CardDescription>
                  Preencha as informações abaixo para criar um novo curso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Curso</Label>
                    <Input id="title" placeholder="Ex: React do Zero ao Avançado" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o que os alunos aprenderão..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programacao">Programação</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Capa do Curso (Thumbnail)</Label>
                    <Input id="thumbnail" type="file" />
                  </div>
                  <Button type="submit">Criar Curso</Button>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Retorna null enquanto carrega ou redireciona
  return null;
}