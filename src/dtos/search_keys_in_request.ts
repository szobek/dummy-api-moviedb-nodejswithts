export default class SearcKeysInRequestDto {
  title?: string;
  from_year?: number;
  to_year?: number;
  rating?: number;
  actor?: string;
  genre?: number;

  constructor(params: any) {
    this.title = (params.title || "%").trim();
    this.from_year = params.fromyear
      ? parseInt(params.from_year)
      : 1950;
    this.to_year =
      params.toyear? parseInt(params.to_year) :
      parseInt(new Date().getFullYear().toString());
    this.rating = params.rating ? parseInt(params.rating) : 1;
    this.actor = (params.actor || "%").trim()
    this.genre = params.genre ? parseInt(params.genre) : 4;
  }
}
