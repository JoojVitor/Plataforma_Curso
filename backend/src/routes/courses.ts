import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import Course from "../models/Course";

const router = Router();

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== "instrutor") {
      return res.status(403).json({ message: "Apenas instrutores podem criar cursos" });
    }

    const { titulo, descricao, aulas } = req.body;

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

    await course.deleteOne();
    res.json({ message: "Curso removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir curso", error });
  }
});

export default router;
