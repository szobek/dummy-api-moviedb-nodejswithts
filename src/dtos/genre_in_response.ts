export class GenreInResponseDto {
  id: number;
  name: string;
  description: string;

  constructor(genre: any) {
    this.id = genre.id;
    this.name = genre.name;
    this.description = genre.description;
  }
}