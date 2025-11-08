import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth'
import healthCheckRoutes from './routes/health'
import courseRoutes from './routes/courses'
import enrollmentRoutes from './routes/enrollments'
import profileRoutes from './routes/profile'
import uploadRoutes from './routes/upload'
import adminRoutes from './routes/admin'

const app = express()
const port = process.env.PORT || 3001

connectDB()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/health', healthCheckRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})