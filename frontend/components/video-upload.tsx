"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

interface VideoUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function VideoUpload({ onFileSelected }: VideoUploadProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);
    setSelectedFileName(null);

    if (!file.type.startsWith("video/")) {
      const errorMsg = "Por favor, selecione um arquivo de vídeo válido";
      toast("Erro no vídeo", { description: errorMsg });
      setError(errorMsg);
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      const errorMsg = "O vídeo deve ter menos de 500MB";
      toast("Arquivo muito grande", { description: errorMsg });
      setError(errorMsg);
      return;
    }

    setProgress(50);
    setTimeout(() => setProgress(100), 300);

    setSelectedFileName(file.name);

    onFileSelected(file);

    toast("Vídeo selecionado", {
      description: `${file.name} foi preparado para envio`,
    });
  };

  const resetSelection = () => {
    setProgress(0);
    setSelectedFileName(null);
    setError(null);
  };

  if (selectedFileName && !error) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-900">
            {selectedFileName}
          </span>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={resetSelection} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-red-900">{error}</span>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={resetSelection} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" className="relative bg-transparent">
          <Upload className="h-4 w-4" />
        </Button>
      </div>

      {progress > 0 && progress < 100 && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">{progress}% preparado</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Formatos aceitos: MP4, MOV, AVI (máx. 500MB)
      </p>
    </div>
  );
}
