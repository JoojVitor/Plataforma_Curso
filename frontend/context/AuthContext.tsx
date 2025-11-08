"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// Interface para os dados do usuário
interface User {
  id: string;
  nome: string;
  email: string;
  role: "aluno" | "instrutor" | "admin";
}

// Interface para o valor do contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Componente Provedor
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Função para verificar a autenticação ao carregar
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // O cookie httpOnly é enviado automaticamente
      const response = await api.get('/auth/me'); 
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Executar a verificação de autenticação quando o app carregar
  useEffect(() => {
    checkAuth();
  }, []);

  // Função de Login
  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, senha });
      setUser(response.data.user); // Pega o usuário da resposta do login
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erro ao tentar fazer login.");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de Logout
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (err: any) {
      console.error("Erro ao fazer logout:", err);
      setError(err.response?.data?.message || "Erro ao tentar fazer logout.");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook customizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}