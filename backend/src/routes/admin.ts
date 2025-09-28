import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";

const router = Router();

// Middleware para garantir que é admin
function isAdmin(req: AuthRequest, res: any, next: any) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Apenas administradores têm acesso a esta rota" });
  }
  next();
}

// Listar todos os usuários
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-senha"); // não expõe senha
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar usuários", error });
  }
});

// Atualizar role de um usuário
router.put("/users/:id/role", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["aluno", "instrutor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role inválida" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-senha");

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({ message: "Role atualizada com sucesso", user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar role do usuário", error });
  }
});

export default router;
