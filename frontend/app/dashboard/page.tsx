"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Efeito para proteger a rota:
  // Se não estiver carregando e não estiver autenticado,
  // redireciona para a página de login.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Estado de Loading:
  // Mostra um esqueleto da interface enquanto
  // o AuthContext verifica se o usuário está logado.
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        {/* CORREÇÃO 1: Passando user?.role (será undefined, o que é esperado) */}
        <Sidebar userRole={user?.role} />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Estado Autenticado:
  // Se o usuário estiver autenticado, mostra o conteúdo da dashboard.
  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen w-full">
        {/* CORREÇÃO 1: Passando o user.role real */}
        <Sidebar userRole={user.role} />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo, {user.nome}!</CardTitle>
                <CardDescription>
                  Este é o seu painel de controle.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Aqui você pode gerenciar seus cursos e seu perfil.</p>
                <p>Seu e-mail: {user.email}</p>
                <p>Sua função: {user.role}</p>
              </CardContent>
            </Card>
          </main>
          S     </div>
      </div>
    );
  }

  // Retorna null para evitar "piscar" a tela
  // enquanto o redirecionamento acontece.
  return null;
}