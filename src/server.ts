import express, { Application } from 'express';
import dotenv from 'dotenv';
import movieApiRoutes from '../src/routes/movie_api_routes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Útvonalak beillesztése
app.use('/api/movies', movieApiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});