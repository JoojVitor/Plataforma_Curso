import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Users } from "lucide-react"

interface CourseCardProps {
  id: string
  title: string
  description: string
  instructor: string
  thumbnail?: string
  duration?: string
  students?: number
}

export function CourseCard({ id, title, description, instructor, thumbnail, duration, students }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {thumbnail ? (
          <img src={thumbnail || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-balance">{title}</h3>
        <p className="text-sm text-muted-foreground">{instructor}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{description}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{duration}</span>
            </div>
          )}
          {students !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{students} alunos</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/courses/${id}`}>Ver Curso</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
