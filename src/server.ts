import express, { Application } from 'express';
import dotenv from 'dotenv';
import movieApiRoutes from './routes/movie_api_routes';
import seedRoutes from './routes/seed.routes';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
// Útvonalak beillesztése
app.use('/api/movies', movieApiRoutes);
app.use('/api/seed', seedRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});