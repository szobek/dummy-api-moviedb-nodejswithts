import db from "../config/knex";
import { ActorInResponseDto } from "../dtos/actor_in_response";
import { GenreInResponseDto } from "../dtos/genre_in_response";
import { MovieInResponseDto } from "../dtos/movie_in_response";
import SearcKeysInRequestDto from "../dtos/search_keys_in_request";
import Movie from "../interfaces/movie.interface";
import { Request } from "express";

const getAllMovies = async () => {
  let dtos: MovieInResponseDto[] = [];
  let id: number = 0;
  try {
    const query = `SELECT 
    m.id AS movie_id,
    m.showings_count,
    m.title,
    m.year,
    m.rating,
    m.director,
    m.description,
    m.poster_url,
    genres_agg.genres,
    actors_agg.actors,
    comments_agg.comments
FROM 
    movies AS m
LEFT JOIN (
    SELECT 
        mg.movie_id, 
        GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ', ') AS genres
    FROM \`movie-genre\` AS mg
    JOIN genres AS g ON mg.genre_id = g.id
    GROUP BY mg.movie_id
) AS genres_agg ON m.id = genres_agg.movie_id
LEFT JOIN (
    SELECT 
        ma.movie_id, 
        GROUP_CONCAT(DISTINCT a.fullName ORDER BY a.fullName SEPARATOR ', ') AS actors
    FROM \`movie-actors\` AS ma
    JOIN actors AS a ON ma.actor_id = a.id
    GROUP BY ma.movie_id
) AS actors_agg ON m.id = actors_agg.movie_id
LEFT JOIN (
    SELECT 
        mc.movie_id, 
        GROUP_CONCAT(mc.comment SEPARATOR ' ||| ') AS comments
    FROM \`movie-comment\` AS mc
    GROUP BY mc.movie_id
) AS comments_agg ON m.id = comments_agg.movie_id;`;
    const movies: any[] = await db.raw(query);
    dtos = movies[0].map((movie: Movie) => {
      movie.id = ++id;
      return new MovieInResponseDto(movie);
    });
  } catch (error) {
    console.error(error);
  }
  return dtos;
};
const getMovieById = async (id: string) => {
  await db("movies").where({ id }).increment("showings_count", 1);
  const data = await getAllMovies();
  const movie = data.find((m: any) => m.id === parseInt(id));
  if (!movie) {
    return null;
  }

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
    const query = `
    SELECT 
    g.name AS genre_name,
    MAX(g.description) AS description,
    GROUP_CONCAT(
        DISTINCT CONCAT(
        'id: ', m.id,
            ' | Title: ', m.title,
            ' | Year: ', m.year,
            ' | Rating: ', m.rating,
            ' | Director: ', m.director,
            ' | Description: ', m.description,
            ' | Actors: ', (
                SELECT GROUP_CONCAT(DISTINCT a.fullName ORDER BY a.fullName SEPARATOR ', ')
                FROM \`movie-actors\` ma2
                JOIN actors a ON a.id = ma2.actor_id
                WHERE ma2.movie_id = m.id
            )
        ) SEPARATOR ' ||| '
    ) AS movies
FROM genres g
JOIN \`movie-genre\` mg ON g.id = mg.genre_id
JOIN movies m ON m.id = mg.movie_id
GROUP BY g.name
ORDER BY g.name;`;
    await db.raw(query).then((rows: any) => {
      const data = rows[0].map((r: any) => {
        const moviesArray = r.movies.split("|||");
        return {
          name: r.genre_name,

          description: r.description,
          movies: moviesArray.map((movie: string) => {
            const movieParts = movie.split("|");
            if (movieParts.length < 7) {
              return null;
            }
            const movieObj = {
              id: parseInt(movieParts[0].replace("id: ", "").trim()),
              title: movieParts[1].replace("Title: ", ""),
              year: parseInt(movieParts[2].replace(" Year: ", "").trim()),
              rating: parseFloat(movieParts[3].replace(" Rating: ", "").trim()),
              director: movieParts[4].replace(" Director: ", ""),
              description: movieParts[5].replace(" Description: ", ""),
              actors: movieParts[6].replace(" Actors: ", ""),
              poster_url: "", // Poster URL is not included in the concatenated string
              showings_count: 0, // Showings count is not included in the concatenated string
            };
            return new MovieInResponseDto(movieObj);
          }),
        };
      });
      console.log(new GenreInResponseDto(data[0]));
    });
    return genres;
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
    m.id,
    m.poster_url,
    m.director,
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
      `;
  await db
    .raw(query, [genreId])
    .then((rows: any) => {
      movies = rows[0].map((movie: any) => new MovieInResponseDto(movie));
    })
    .catch((error: any) => {
      console.error("Error fetching movies by genre:", error);
    });
  return movies;
};

const searchMovies = async (req: Request) => {
  const searchTerm = new SearcKeysInRequestDto(req.query);

  const query: string = `
  SELECT
    m.title ,
    m.description,
    m.rating ,
    m.year ,
    m.id,
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
  m.title LIKE ?
AND 
  m.year BETWEEN ? AND ?
AND 
  m.rating >= ?
GROUP BY
    m.id, m.title, m.description, m.rating, m.year
HAVING
    SUM(CASE WHEN a.fullName LIKE ? THEN 1 ELSE 0 END) > 0 
    AND SUM(CASE WHEN g.id LIKE ? THEN 1 ELSE 0 END) > 0;`;

  let movies: MovieInResponseDto[] = [];
  const paramsOfQuery = Object.values(searchTerm);
  await db
    .raw(query, paramsOfQuery)
    .then((rows: any) => {
      movies = rows[0].map((movie: any) => new MovieInResponseDto(movie));
    })
    .catch((err) => {
      console.error(err);
    });
  return movies;
};
const deleteMovieById = async (id: string) => {
  let deletedRow;
  try {
    await db("movies")
      .where("id", id)
      .del()
      .then((res) => {
        deletedRow = res;
      });
  } catch (error) {
    console.log(error);
  }
  return deletedRow;
};

const saveCommentToMovie = async (movieId: string, comment: string) => {
  let response = { success: false, message: "" };
  try {
    await db("movie-comment")
      .insert({ movie_id: movieId, comment })
      .then((res) => {
        response = { success: true, message: "Comment added successfully" };
      });
  } catch (error) {
    console.log(error);
    response = { success: false, message: "Error adding comment" };
  }
  return response;
};

export {
  getAllMovies,
  getMovieById,
  getAllActors,
  getMoviesByActor,
  getAllGenres,
  getMoviesByGenre,
  searchMovies,
  deleteMovieById,
  saveCommentToMovie,
};
