import { Knex } from "knex";
import accessSpreadsheet  from '../access_and_fetch_from_spredsheet'; 
import dotenv from 'dotenv';
dotenv.config();

interface Genre {
  id: number;
  name: string;
  description: string;
}

export async function seed(knex: Knex): Promise<void> {
   const data=await accessSpreadsheet(process.env.GOOGLE_SHEET_ID as string, process.env.GOOGLE_SHEET_RANGE_FOR_GENRES as string);
   // Ellenőrizzük, hogy van-e adat
   if (data) {
    await knex('genres').del();
    await knex('genres').insert(convert(data));
   }
};


const convert = (data:any) => {
  let id = 0
  let genres = []
  genres = data.map((row:any) => {
    const obj:Genre = {} as Genre;
    if (row[0] && row[0] !== undefined) {
      obj.id = ++id;
      obj.name = row[0].trim();
      obj.description = row[1].trim();
    }
    return obj;
  });
  return genres

}