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

export default router;
