import dotenv from "dotenv";
dotenv.config();

export function getRequiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variável de ambiente ${name} não definida`);
  return v;
}