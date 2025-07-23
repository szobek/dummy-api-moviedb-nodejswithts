import db from '../config/knex';
import { MovieInResponseDto } from '../dtos/movie_in_response';
import Movie from '../inerfaces/movie.interface';

const getAllMovies = async () => {
    let dtos: MovieInResponseDto[] = [];
    let id: number=0;
  try {
    const query =
      "SELECT m.id AS movie_id,  m.title,  m.year,  m.rating,  m.director,  m.description,  m.poster_url,  GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres,  GROUP_CONCAT(DISTINCT a.fullName ORDER BY a.fullName SEPARATOR ', ') AS actors FROM movies AS m LEFT JOIN `movie-genre` AS mg ON m.id = mg.movie_id LEFT JOIN   genres AS g ON mg.genre_id = g.id LEFT JOIN `movie-actors` AS ma ON m.id = ma.movie_id  LEFT JOIN  actors AS a ON ma.actor_id = a.id GROUP BY m.id, m.title, m.year, m.rating, m.director, m.description, m.poster_url;";
    const movies: any[] = await db.raw(query);
    dtos= movies[0].map(
      (movie: Movie) => {
        movie.id = id;
        id++
        return new MovieInResponseDto(movie);
      }
    );
  } catch (error) {
    console.error(error);
  }
    return dtos;
};
const getMovieById = async (id: string) => {
  const data = await getAllMovies();
  const movie = data.find((m:any) => m.id === parseInt(id));
 
  return movie;
}
export {
    getAllMovies,
    getMovieById
    };