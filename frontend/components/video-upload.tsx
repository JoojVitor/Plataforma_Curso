"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react"
import { toast } from "sonner"

interface VideoUploadProps {
  onUploadSuccess: (key: string, fileName: string) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
}

export function VideoUpload({ onUploadSuccess, onUploadStart, onUploadEnd }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setError(null)
    setProgress(0)
    setUploadedFileName(null)

    // Validate file type and size
    if (!file.type.startsWith("video/")) {
      const errorMsg = "Por favor, selecione um arquivo de vídeo válido"
      setError(errorMsg)
      toast("Erro no upload", {
        description: errorMsg
      })
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      const errorMsg = "O vídeo deve ter menos de 500MB"
      setError(errorMsg)
      toast("Arquivo muito grande", {
        description: errorMsg
      })
      return
    }

    setUploading(true)
    onUploadStart?.()

    try {
      console.log("[v0] Requesting signed URL for file:", file.name)
      const uploadResponse = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.message || "Erro ao obter URL de upload")
      }

      const { uploadUrl, key } = await uploadResponse.json()
      console.log("[AWS] Received signed URL, uploading to S3")

      const uploadToS3 = new XMLHttpRequest()

      uploadToS3.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)
          setProgress(percentComplete)
          console.log("[AWS] Upload progress:", percentComplete + "%")
        }
      })

      uploadToS3.addEventListener("load", () => {
        if (uploadToS3.status >= 200 && uploadToS3.status < 300) {
          console.log("[AWS] Upload successful, saving key:", key)
          setUploadedFileName(file.name)
          setProgress(100)
          onUploadSuccess(key, file.name)

          toast("Vídeo enviado com sucesso", {
            description: `${file.name} foi enviado para o servidor`,
          })
        } else {
          throw new Error("Erro ao enviar vídeo para S3")
        }
      })

      uploadToS3.addEventListener("error", () => {
        throw new Error("Erro na conexão ao enviar vídeo")
      })

      uploadToS3.open("PUT", uploadUrl)
      uploadToS3.setRequestHeader("Content-Type", file.type)
      uploadToS3.send(file)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido no upload"
      console.error("[AWS] Upload error:", err)
      setError(errorMsg)
      setProgress(0)

      toast("Erro no upload", {
        description: errorMsg
      })
    } finally {
      setUploading(false)
      onUploadEnd?.()
    }
  }

  const resetUpload = () => {
    setProgress(0)
    setUploadedFileName(null)
    setError(null)
  }

  if (uploadedFileName && !error) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-900">{uploadedFileName}</span>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={resetUpload} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-red-900">{error}</span>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={resetUpload} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Input type="file" accept="video/*" onChange={handleFileSelect} disabled={uploading} className="flex-1" />
        <Button type="button" variant="outline" size="icon" disabled={uploading} className="relative bg-transparent">
          <Upload className="h-4 w-4" />
        </Button>
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">{progress}% enviado</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">Formatos aceitos: MP4, MOV, AVI (máx. 500MB)</p>
    </div>
  )
}
