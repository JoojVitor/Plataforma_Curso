import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import Enrollment from "../models/Enrollment";
import Course from "../models/Course";

const router = Router();

// Inscrever-se em um curso (somente aluno)
router.post("/:courseId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== "aluno") {
      return res.status(403).json({ message: "Apenas alunos podem se inscrever" });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Curso não encontrado" });

    const enrollment = new Enrollment({
      aluno: req.user.id,
      curso: course._id
    });

    await enrollment.save();
    res.status(201).json({ message: "Inscrição realizada com sucesso", enrollment });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Você já está inscrito neste curso" });
    }
    res.status(500).json({ message: "Erro ao se inscrever no curso", error });
  }
});

// Listar cursos em que o aluno está inscrito
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== "aluno") {
      return res.status(403).json({ message: "Apenas alunos podem ver suas inscrições" });
    }

    const enrollments = await Enrollment.find({ aluno: req.user.id })
      .populate("curso", "titulo descricao");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar inscrições", error });
  }
});

// Listar alunos inscritos em um curso (somente instrutor dono do curso)
router.get("/course/:courseId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== "instrutor") {
      return res.status(403).json({ message: "Apenas instrutores podem ver os inscritos" });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Curso não encontrado" });

    if (course.instrutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Você não tem permissão para ver os inscritos deste curso" });
    }

    const enrollments = await Enrollment.find({ curso: course._id })
      .populate("aluno", "nome email");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar inscritos", error });
  }
});

// Cancelar inscrição em um curso (somente aluno)
router.delete("/:courseId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== "aluno") {
      return res.status(403).json({ message: "Apenas alunos podem cancelar inscrições" });
    }

    const enrollment = await Enrollment.findOneAndDelete({
      aluno: req.user.id,
      curso: req.params.courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Inscrição não encontrada" });
    }

    res.json({ message: "Inscrição cancelada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cancelar inscrição", error });
  }
});

export default router;
