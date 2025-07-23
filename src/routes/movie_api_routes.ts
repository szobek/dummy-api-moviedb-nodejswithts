import { Router, Request, Response } from 'express';
import { getAllMovies } from '../controllers/movie.controller'; 

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
  const data = await getAllMovies();

  const movie = data.find((m:any) => m.id === parseInt(id));
  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  res.json(movie);
})

export default router;