import { Router, Request, Response } from "express";
import {
  deleteMovieById,
  getAllActors,
  getAllGenres,
  getAllMovies,
  getMovieById,
  getMoviesByActor,
  getMoviesByGenre,
  searchMovies,
} from "../controllers/movie.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("", async (req: Request, res: Response) => {
  const data = await getAllMovies();
  if (data.length === 0) {
    return res.status(404).json({ message: "No movies found" });
  }
  res.json(data);
});

router.get("/actors", async (req: Request, res: Response) => {
  const actors = await getAllActors();
  if (actors.length === 0) {
    return res.status(404).json({ message: "No actors found" });
  }
  res.json(actors);
});

router.get("/actors/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  await getMoviesByActor(id).then((movies: any) => {
    res.json(movies);
  });
});

router.get("/genres", async (req: Request, res: Response) => {
  const genres = await getAllGenres();
  if (genres.length === 0) {
    return res.status(404).json({ message: "No genres found" });
  }
  res.json(genres);
});
router.get("/genres/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const movies = await getMoviesByGenre(id);
  if (movies.length === 0) {
    return res.status(404).json({ message: "No movies found for this genre" });
  }
  res.json(movies);
});

router.get("/search", async (req, res) => {
  const movies = await searchMovies(req);
  res.json(movies);
});




router.get("/movie-showings", async (req: Request, res: Response) => {
  const movies = await getAllMovies();
  return res.json(movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    showingsCount: movie.showingsCount
  })));
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = await getMovieById(id);
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }
  res.json(movie);
});

router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedRow = await deleteMovieById(id);
  res.json({"message": deletedRow === 1 ? "Movie deleted successfully" : "Movie not found"});
});


export default router;
