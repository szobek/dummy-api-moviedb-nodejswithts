import { Knex } from "knex";
import accessSpreadsheet from "../access_and_fetch_from_spredsheet";
import dotenv from "dotenv";
dotenv.config();

export async function seed(knex: Knex): Promise<void> {
  const data = await accessSpreadsheet(
    process.env.GOOGLE_SHEET_ID as string,
    process.env.GOOGLE_SHEET_RANGE_FOR_MOVIES as string
  );
  let movieId = 0;
  const objects: any = [];
  try {
    if (data) {
      await knex("actors")
        .select("id", "fullName")
        .then((res) => {
          data.forEach((row: any) => {
            movieId++;
            if (row[5] && row[5].includes(",")) {
              const movieActorArray = row[5].split(",");
              movieActorArray.forEach((actor: string) => {
                res.forEach(async (dbactor) => {
                  if (actor.trim() === dbactor.fullName) {
                    const obj = {
                      movie_id: movieId,
                      actor_id: dbactor.id,
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

    await knex("movie-actors").insert(objects);
  } catch (error) {
    console.error('Error inserting movie actors:', error);
  }
}
