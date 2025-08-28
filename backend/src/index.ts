import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import healthRoutes from "./routes/health";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/health", healthRoutes);

// Conexão DB + Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
