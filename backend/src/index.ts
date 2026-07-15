import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import latexRoutes from './routes/latex';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/latex', latexRoutes);
app.use('/api/ai', aiRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
