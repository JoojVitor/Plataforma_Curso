"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GraduationCap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("aluno")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não correspondem")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      await register(email, password, name, role)
      router.push("/courses")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Plataforma Cursos</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">Preencha os dados abaixo para criar sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-3">
                <Label>Tipo de Conta</Label>
                <RadioGroup value={role} onValueChange={setRole} disabled={isLoading}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aluno" id="aluno" />
                    <Label htmlFor="aluno" className="font-normal cursor-pointer">
                      Aluno - Quero aprender
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="instrutor" id="instrutor" />
                    <Label htmlFor="instrutor" className="font-normal cursor-pointer">
                      Instrutor - Quero ensinar
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-center text-muted-foreground w-full">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
