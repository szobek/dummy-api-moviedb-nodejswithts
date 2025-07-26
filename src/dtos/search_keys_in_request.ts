export default class SearcKeysInRequestDto {
  title?: string;
  fromyear?: number;
  toyear?: number;
  rating?: number;
  actor?: string;
  genre?: number;

  constructor(params: any) {
    this.title = (params.title || "%").trim();
    this.fromyear = params.fromyear
      ? parseInt(params.fromyear)
      : 1950;
    this.toyear =
      params.toyear? parseInt(params.toyear) :
      parseInt(new Date().getFullYear().toString());
    this.rating = params.rating ? parseInt(params.rating) : 1;
    this.actor = (params.actor || "%").trim()
    this.genre = params.genre ? parseInt(params.genre) : 4;
  }
}
