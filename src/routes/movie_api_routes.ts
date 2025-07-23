import { Router, Request, Response } from 'express';
import { getAllActors, getAllMovies, getMovieById, getMoviesByActor } from '../controllers/movie.controller'; 

const router = Router();

router.get('', async (req: Request, res: Response) => {
 const data=await getAllMovies();
 if(data.length === 0) {
   return res.status(404).json({ message: 'No movies found' });
 }
  res.json(data);
});



router.get('/actors', async (req: Request, res: Response) => {
  const actors = await getAllActors();
  if (actors.length === 0) {
    return res.status(404).json({ message: 'No actors found' });
  }
  res.json(actors);
})

router.get('/actors/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  
 await getMoviesByActor(id).then((movies:any)=>{
  console.log('movies', movies);
  
    res.json(movies);
  });
})

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = await getMovieById(id);
  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  res.json(movie);
})

export default router;