"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface VideoPlayerProps {
  videoUrl: string
  titulo: string
}

export function VideoPlayer({ videoUrl, titulo }: VideoPlayerProps) {
  const [isError, setIsError] = useState(false)

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-black">
        {isError ? (
          <div className="flex h-full w-full items-center justify-center bg-black">
            <div className="text-center text-white">
              <p className="font-semibold">Erro ao carregar o vídeo</p>
              <p className="text-sm text-muted-foreground">Tente recarregar a página</p>
            </div>
          </div>
        ) : (
          <video key={videoUrl} controls className="h-full w-full" onError={() => setIsError(true)}>
            <source src={videoUrl} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <h3 className="font-semibold text-sm text-muted-foreground">AULA ATUAL</h3>
        <p className="text-lg font-semibold mt-1 line-clamp-2 text-pretty">{titulo}</p>
      </div>
    </Card>
  )
}
