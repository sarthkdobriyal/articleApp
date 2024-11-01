import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import articleRoutes from './routes/articles';

dotenv.config();

const app = express();
const prisma = new PrismaClient();


app.use(cors({origin: `${process.env.FRONT_URL}`, credentials: true}))
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { prisma };