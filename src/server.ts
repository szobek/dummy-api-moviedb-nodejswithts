import express, { Application } from 'express';
import dotenv from 'dotenv';
import movieApiRoutes from './routes/movie_api.routes';
import seedRoutes from './routes/seed.routes';
import authRoutes from './routes/auth.routes';
import cors from 'cors';
import { authenticateToken } from './middlewares/auth.middleware';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
// Útvonalak beillesztése
app.use('/api/movies', movieApiRoutes);
app.use('/api/seed',authenticateToken, seedRoutes);
app.use('/api/auth', authRoutes);




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});