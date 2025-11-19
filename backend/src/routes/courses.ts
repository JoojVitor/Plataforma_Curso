import { Router } from "express";
import { deleteFromS3, getSignedVideoUrl } from "../utils/s3";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";

const router = Router();

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== "instrutor") {
      return res.status(403).json({ message: "Apenas instrutores podem criar cursos" });
    }

    const { titulo, descricao, aulas } = req.body;

    if (!titulo || titulo.trim().length < 3) {
      return res.status(400).json({ message: "Título é obrigatório e deve ter pelo menos 3 caracteres" });
    }

    if (!descricao || descricao.trim().length < 10) {
      return res.status(400).json({ message: "Descrição é obrigatória e deve ter pelo menos 10 caracteres" });
    }

    if (!aulas || !Array.isArray(aulas) || aulas.length === 0) {
      return res.status(400).json({ message: "Curso deve conter ao menos uma aula" });
    }

    for (const aula of aulas) {
      if (!aula.titulo || aula.titulo.trim().length < 3) {
        return res.status(400).json({ message: "Cada aula precisa ter um título válido" });
      }
      if (!aula.url || typeof aula.url !== "string") {
        return res.status(400).json({ message: "Cada aula precisa ter uma URL válida (chave no S3)" });
      }
    }

    const course = new Course({
      titulo,
      descricao,
      aulas,
      instrutor: req.user.id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar curso", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("instrutor", "nome email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cursos", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instrutor", "nome email");
    if (!course) return res.status(404).json({ message: "Curso não encontrado" });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar curso", error });
  }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Curso não encontrado" });

    if (course.instrutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Você não tem permissão para editar este curso" });
    }

    const { titulo, descricao, aulas } = req.body;

    course.titulo = titulo || course.titulo;
    course.descricao = descricao || course.descricao;
    course.aulas = aulas || course.aulas;

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar curso", error });
  }
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Curso não encontrado" });

    if (course.instrutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Você não tem permissão para excluir este curso" });
    }

    for (const aula of course.aulas) {
      try {
        await deleteFromS3(aula.url);
      } catch (err) {
        console.error("Erro ao deletar vídeo do S3:", err);
      }
    }

    await course.deleteOne();

    res.json({ message: "Curso removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir curso", error });
  }
});

router.get("/:id/lessons", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Curso não encontrado" });

    if (course.instrutor.toString() === req.user.id) {
      const aulasComLinks = await Promise.all(
        course.aulas.map(async (aula) => ({
          titulo: aula.titulo,
          url: await getSignedVideoUrl(aula.url)
        }))
      );
      return res.json({ aulas: aulasComLinks });
    }

    if (req.user.role === "aluno") {
      const isEnrolled = await Enrollment.findOne({ aluno: req.user.id, curso: courseId });
      if (!isEnrolled) {
        return res.status(403).json({ message: "Você não está inscrito neste curso" });
      }

      const aulasComLinks = await Promise.all(
        course.aulas.map(async (aula) => ({
          titulo: aula.titulo,
          url: await getSignedVideoUrl(aula.url)
        }))
      );
      return res.json({ aulas: aulasComLinks });
    }

    res.status(403).json({ message: "Acesso negado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao acessar aulas", error });
  }
});

export default router;
