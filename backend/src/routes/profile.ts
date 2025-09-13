import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";

const router = Router();

// Rota protegida: obter dados do usuário logado
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user.id).select("-senha");
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar perfil", error });
  }
});

export default router;
