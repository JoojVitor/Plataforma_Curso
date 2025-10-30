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
import adminRoutes from "./routes/admin";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.100.69:3000",
    ],
  })
);

app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("api/admin", adminRoutes);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
