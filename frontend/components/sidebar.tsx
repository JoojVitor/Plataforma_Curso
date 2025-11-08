"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Users, Settings } from "lucide-react"

interface SidebarProps {
  userRole?: "aluno" | "instrutor" | "admin" | string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/my-courses",
      label: "Meus Cursos",
      icon: BookOpen,
    },
    ...(userRole === "admin"
      ? [
          {
            href: "/students",
            label: "Alunos Inscritos",
            icon: Users,
          },
          {
            href: "/settings",
            label: "Configurações",
            icon: Settings,
          },
        ]
      : []),
  ]

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
      <div className="flex-1 overflow-auto py-6">
        <nav className="flex flex-col gap-1 px-4">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
