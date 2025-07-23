import { Router, Request, Response } from 'express';
import { getAllMovies, getMovieById } from '../controllers/movie.controller'; 

const router = Router();

router.get('', async (req: Request, res: Response) => {
 const data=await getAllMovies();
 if(data.length === 0) {
   return res.status(404).json({ message: 'No movies found' });
 }
  res.json(data);
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = await getMovieById(id);
  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  res.json(movie);
})

export default router;