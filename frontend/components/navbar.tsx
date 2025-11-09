"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, User, LogOut, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Plataforma Cursos</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Buscar cursos..." className="w-full pl-10" />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/courses" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Cursos
          </Link>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.nome} />
                    <AvatarFallback className="text-xs">{getInitials(user.nome)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">{user.nome}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="font-medium text-sm">{user.nome}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                {(user.role === "instrutor" || user.role === "admin") && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/courses/create" className="cursor-pointer">
                        Criar Curso
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/my-courses" className="cursor-pointer">
                    Meus Cursos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Registrar</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
