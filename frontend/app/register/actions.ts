"use server";
import { api } from "@/lib/api";

export async function registerUser(formData: FormData) {
  try {
    const response = await api.post("/auth/register", {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao registrar:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao registrar usuário.");
  }
}