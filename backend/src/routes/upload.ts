import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getRequiredEnv } from "../utils/env";

const router = Router();

const s3 = new S3Client({
  region: getRequiredEnv("AWS_REGION"),
  credentials: {
    accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
  },
});

// Rota para gerar URL de upload
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== "instrutor") {
      return res.status(403).json({ message: "Apenas instrutores podem enviar vídeos" });
    }

    const { fileName, contentType } = req.body;
    if (!fileName || !contentType) {
      return res.status(400).json({ message: "Nome do arquivo e contentType são obrigatórios" });
    }

    // Exemplo: aulas/video123.mp4
    const key = `aulas/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: getRequiredEnv("AWS_S3_BUCKET"),
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1h

    res.json({
      uploadUrl,
      key, // guardamos no banco como "url" da aula
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao gerar URL de upload", error });
  }
});

export default router;
