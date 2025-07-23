import { Knex } from "knex";
import accessSpreadsheet from "../access_and_fetch_from_spredsheet";
import dotenv from "dotenv";
dotenv.config();

export async function seed(knex: Knex): Promise<void> {
  let movieId = 0;
  const objects: any = [];
  const data = await accessSpreadsheet(
    process.env.GOOGLE_SHEET_ID as string,
    process.env.GOOGLE_SHEET_RANGE_FOR_MOVIES as string
  );
  try {
    if (data) {
      await knex("genres")
        .select("id", "name")
        .then((res) => {
          data.forEach((row: any) => {
            movieId++;
            if (row[4]) {
              const movieGenresArray = row[4].split(",");
              movieGenresArray.forEach((genre: string) => {
                res.forEach(async (dbgenre) => {
                  if (genre.trim() === dbgenre.name) {
                    const obj = {
                      movie_id: movieId,
                      genre_id: dbgenre.id,
                    };
                    objects.push(obj);
                  }
                });
              });
            }
          });
        });
    } else {
      console.log("No data found in Google Sheets.");
    }
    await knex("movie-genre").insert(objects);
  } catch (error) {
    console.error("Error inserting movie genres:", error);
  }
}
