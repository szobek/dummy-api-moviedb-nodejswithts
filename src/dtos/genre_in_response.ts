import Movie from "../interfaces/movie.interface";

export class GenreInResponseDto {
  id: number;
  name: string;
  description: string;
  movies:Movie[]=[];

  constructor(genre: any) {
    this.id = genre.id;
    this.name = genre.name;
    this.description = genre.description;
    this.movies = genre.movies;
  }
}