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

export default router;