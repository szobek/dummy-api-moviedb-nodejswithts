import express, { Application } from 'express';
import dotenv from 'dotenv';
import val from './routes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Útvonalak beillesztése
app.use('/api/movies', val);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});