"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface User {
    id: string;
    nome: string;
    email: string;
    role: "aluno" | "instrutor" | "admin";
}

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

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const checkAuth = async () => {
        setIsLoading(true);
        try {
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

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, senha: string) => {
        // Usamos o setIsLoading GLOBAL aqui para o caso de
        // querermos mostrar um spinner global, mas o local
        // da página de login é mais importante.
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, senha });
            setUser(response.data.user);
            setIsAuthenticated(true);
            router.push('/dashboard');
            // O finally não será chamado porque estamos redirecionando
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Erro ao tentar fazer login.";
            setError(errorMessage);
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false); // Defina como false em caso de erro

            // CORREÇÃO: Relance o erro para a página de login
            throw new Error(errorMessage);
        }
        // Removemos o finally daqui, pois o estado de loading
        // deve ser tratado nos blocos try (com redirecionamento) ou catch
    };

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

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}