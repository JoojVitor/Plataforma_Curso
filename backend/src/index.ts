import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import courseRoutes from "./routes/courses";
import enrollmentRoutes from "./routes/enrollments";
import uploadRoutes from "./routes/upload";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
