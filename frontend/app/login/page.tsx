"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  // 2. Usar o contexto
  const { login, isLoading, error } = useAuth(); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 3. Chamar a função de login do contexto
    await login(email, password); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md">
        {/* ... (Logo/Título) ... */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              {/* ... (Título e Descrição do Card) ... */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                />
              </div>
              {/* 4. Usar o erro e loading do contexto */}
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              {/* ... (Link de Criar Conta) ... */}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}