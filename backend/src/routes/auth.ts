import { authMiddleware } from '../middleware/authMiddleware';
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

// Registrar usuário
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "E-mail já cadastrado" });

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = new User({
      nome,
      email,
      senha: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro no registro", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ message: "Senha inválida" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        nome: user.nome // <-- ADICIONE ISSO
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/',
    });

    res.status(200).json({
      message: "Login bem-sucedido",
      // Envie os dados do usuário na resposta do login
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Erro no login", error });
  }
});

// Rota "Quem sou eu"
router.get("/me", authMiddleware, (req: any, res) => {
  // O authMiddleware já validou o token e anexou o usuário (req.user)
  if (!req.user) {
    return res.status(401).json({ message: "Não autorizado" });
  }
  // Retorna os dados do usuário do payload do token
  res.status(200).json(req.user);
});

export default router;
