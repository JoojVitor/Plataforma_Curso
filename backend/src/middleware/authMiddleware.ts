// backend/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendemos a interface Request para incluir 'user' e 'cookies'
interface AuthRequest extends Request {
  user?: any;
  cookies: {
    authToken?: string; // Definimos o cookie que esperamos
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Obter o token do cookie
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado: Token não fornecido' });
  }

  try {
    // 2. Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Não autorizado: Token inválido' });
  }
};