import { Router, Request, Response } from 'express';
import db from '../config/knex'; // Importáljuk a Knex példányt

const router = Router();
interface Movie{
  id: number;
  title: string;
  description: string;
  year: number;
  rating: number;
  director: string;
  genres: string;
  actors: string;
  poster_url: string;
}
// GET /api/users - Összes felhasználó lekérdezése
router.get('/movies', async (req: Request, res: Response) => {
  try {
    const movies: Movie[] = await db<Movie>('movies').select('*');
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hiba történt a filmeklekérdezése során.' });
  }
});




export default router;