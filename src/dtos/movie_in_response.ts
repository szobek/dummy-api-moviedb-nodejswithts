export class MovieInResponseDto {
  id: number;
  title: string;
  description: string;
  year: number;
  rating: number;
  director: string;
  genres: string[];
  actors: string[];
  posterUrl: string;
  showingsCount: number;
  comments?: string[];


  constructor(movie: any) {
    this.id = movie.id;
    this.title = movie.title;
    this.description = movie.description;
    this.year = movie.year;
    this.rating = movie.rating;
    this.director = movie.director;
    this.genres = (movie.genres) ? movie.genres.split(',') : [];
    this.actors = (movie.actors) ? movie.actors.split(',') : [];
    this.posterUrl = movie.poster_url;
    this.showingsCount = movie.showings_count;
    this.comments = movie.comments ? movie.comments.split(' ||| ') : [];
    }
  
}