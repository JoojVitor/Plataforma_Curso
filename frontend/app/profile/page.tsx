"use client"

import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/lib/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 py-12 px-4">
          <div className="container max-w-2xl mx-auto">
            <div className="mb-8">
              <Link href="/my-courses" className="text-sm text-primary hover:underline">
                ← Voltar
              </Link>
            </div>

            <div className="space-y-8">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Meu Perfil</CardTitle>
                  <CardDescription>Informações da sua conta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.nome} />
                      <AvatarFallback className="text-lg">{user?.nome ? getInitials(user.nome) : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{user?.nome}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" value={user?.nome || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" value={user?.email || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Tipo de Conta</Label>
                        <Input
                          id="role"
                          value={user?.role === "aluno" ? "Aluno" : user?.role === "instrutor" ? "Instrutor" : "Admin"}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                  <CardDescription>Gerencie suas preferências</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    Alterar Senha
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Configurações de Notificações
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Conectar Conta Social
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
