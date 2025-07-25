import db from "../config/knex";
import { ActorInResponseDto } from "../dtos/actor_in_response";
import { MovieInResponseDto } from "../dtos/movie_in_response";
import Movie from "../inerfaces/movie.interface";
import { Request, Response } from 'express';

const getAllMovies = async () => {
  let dtos: MovieInResponseDto[] = [];
  let id: number = 0;
  try {
    const query =
      "SELECT m.id AS movie_id,  m.title,  m.year,  m.rating,  m.director,  m.description,  m.poster_url,  GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres,  GROUP_CONCAT(DISTINCT a.fullName ORDER BY a.fullName SEPARATOR ', ') AS actors FROM movies AS m LEFT JOIN `movie-genre` AS mg ON m.id = mg.movie_id LEFT JOIN   genres AS g ON mg.genre_id = g.id LEFT JOIN `movie-actors` AS ma ON m.id = ma.movie_id  LEFT JOIN  actors AS a ON ma.actor_id = a.id GROUP BY m.id, m.title, m.year, m.rating, m.director, m.description, m.poster_url;";
    const movies: any[] = await db.raw(query);
    dtos = movies[0].map((movie: Movie) => {
      movie.id = id;
      id++;
      return new MovieInResponseDto(movie);
    });
  } catch (error) {
    console.error(error);
  }
  return dtos;
};
const getMovieById = async (id: string) => {
  const data = await getAllMovies();
  const movie = data.find((m: any) => m.id === parseInt(id));

  return movie;
};
const getAllActors = async () => {
  let actors: ActorInResponseDto[] = [];
  try {
    await db("actors")
      .select("*")
      .then((rows: any) => {
        actors = rows.map((actor: any) => new ActorInResponseDto(actor));
      });
  } catch (error) {
    console.error(error);
  }
  return actors;
};

const getMoviesByActor = async (actorId: string) => {
  let movies: MovieInResponseDto[] = [];
  const query = `SELECT
    m.title ,
    m.id,
    m.description,
    m.rating ,
    m.year ,
    m.poster_url,
    m.director,
    GROUP_CONCAT(DISTINCT a.fullName SEPARATOR ', ') AS actors,
    GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres
FROM
    movies AS m
    LEFT JOIN \`movie-actors\` AS ma ON m.id = ma.movie_id
    LEFT JOIN actors AS a ON ma.actor_id = a.id
    LEFT JOIN \`movie-genre\` AS mg ON m.id = mg.movie_id
    LEFT JOIN genres AS g ON mg.genre_id = g.id
WHERE
    EXISTS (
        SELECT 1
        FROM \`movie-actors\` AS ma_szuro
        WHERE ma_szuro.movie_id = m.id
          AND ma_szuro.actor_id = ?
    )
GROUP BY
    m.id, m.title, m.description, m.rating, m.year
ORDER BY
    m.year DESC;`;
  try {
    const rows = await db.raw(query, [actorId]);
    movies = rows[0].map((movie: any) => new MovieInResponseDto(movie));
  } catch (error) {
    console.error(error);
  }
  return movies;
};

const getAllGenres = async () => {
  let genres: string[] = [];
  try {
    await db("genres")
      .select("*")
      .then((rows: any) => {
        genres = rows.map((genre: any) => {
          return {
            id: genre.id,
            name: genre.name,
          }
        });
      });
  } catch (error) {
    console.error(error);
  }
  return genres;
};

const getMoviesByGenre = async (genreId: string) => {
  let movies: MovieInResponseDto[] = [];
  const query = `
  SELECT
  m.title ,
    m.description,
    m.rating ,
    m.year ,
    GROUP_CONCAT(DISTINCT a.fullName SEPARATOR ', ') AS actors,
    GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres
    FROM
    movies AS m
    LEFT JOIN \`movie-genre\` AS mg ON m.id = mg.movie_id
    LEFT JOIN genres AS g ON mg.genre_id = g.id
    LEFT JOIN \`movie-actors\` AS ma ON m.id = ma.movie_id
    LEFT JOIN actors AS a ON ma.actor_id = a.id
    WHERE
    EXISTS (
      SELECT 1
      FROM \`movie-genre\` AS szuro_mg
      WHERE szuro_mg.movie_id = m.id
      AND szuro_mg.genre_id = ?
      )
      GROUP BY
      m.id, m.title, m.description, m.rating, m.year
      ORDER BY
      m.rating DESC;
      `
  await db.raw(query, [genreId]).then((rows: any) => {
    movies = rows[0].map((movie: any) => new MovieInResponseDto(movie));
  }).catch((error: any) => {
    console.error("Error fetching movies by genre:", error);
  });
  return movies;
}

interface SearchRequestBody {
  genre: string;
  title: string;
  actor: string;
  fromyear: string;
  toyear: string;
  rating: number;
  
}
const searchMovies = async (req: Request<{}, {}, SearchRequestBody>, res: Response) => {
  console.log("Search request body:", req.body);
  
  const query:string = `
  SELECT
    m.title ,
    m.description,
    m.rating ,
    m.year ,
    GROUP_CONCAT(DISTINCT a.fullName SEPARATOR ', ') AS actors,
    GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres
FROM
    movies AS m
    LEFT JOIN \`movie-actors\` AS ma ON m.id = ma.movie_id
    LEFT JOIN actors AS a ON ma.actor_id = a.id
    LEFT JOIN \`movie-genre\` AS mg ON m.id = mg.movie_id
    LEFT JOIN genres AS g ON mg.genre_id = g.id
WHERE
    m.title LIKE ?
AND m.year BETWEEN ? AND ?
AND m.rating >= ?
GROUP BY
    m.id, m.title, m.description, m.rating, m.year
HAVING
    SUM(CASE WHEN a.fullName LIKE ? THEN 1 ELSE 0 END) > 0 
    AND SUM(CASE WHEN g.id LIKE ? THEN 1 ELSE 0 END) > 0;`
  const searchTerm = req.body;
  let movies: MovieInResponseDto[] = [];

  searchTerm.genre=(searchTerm.genre === ""|| searchTerm.genre === undefined)?`%`:searchTerm.genre;
  if (searchTerm.title === ""|| searchTerm.title === undefined) {
    searchTerm.title = "%"
  }
  if (searchTerm.actor === ""|| searchTerm.actor === undefined) {
    searchTerm.actor = "%"
  }
  
  if (searchTerm.rating === undefined||searchTerm.rating <= 0) {
    searchTerm.rating = 1
  }
  const q = [
    `%${searchTerm.title}%`,
    searchTerm.fromyear || 1900,
    searchTerm.toyear || new Date().getFullYear(),
    searchTerm.rating,
    `%${searchTerm.actor}%`,
    searchTerm.genre
  ]
  await db.raw(query,q)
    .then((rows: any) => {
      movies = rows[0].map((movie: any) => new MovieInResponseDto(movie));
    }).catch((err) => {
      console.error(err);
    });
    return movies
}

export {
  getAllMovies,
  getMovieById,
  getAllActors,
  getMoviesByActor,
  getAllGenres,
  getMoviesByGenre,
  searchMovies
};
