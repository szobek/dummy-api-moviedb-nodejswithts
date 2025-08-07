import { Knex } from "knex";
import accessSpreadsheet  from '../access_and_fetch_from_spredsheet'; 
import dotenv from 'dotenv';
dotenv.config();

export async function seed(knex: Knex): Promise<void> {
   const data=await accessSpreadsheet(process.env.GOOGLE_SHEET_ID as string, process.env.GOOGLE_SHEET_RANGE_FOR_MOVIES as string);
   // Ellenőrizzük, hogy van-e adat
   if (data) {
    await knex('movies').del();
    await knex('movies').insert(convert(data));
   }
   
};


const convert = (data:any) => {
  return data.map((row:any,index:number) => {
    const mid=index+1;
    return {
      id:mid,
      title: row[0],
      description: row[1],
      year: parseInt(row[2]),
      rating: parseFloat(row[3]),
      director: row[7],
      // genres: (row[4]&&row[4]!==undefined&&row[4].includes(','))?row[4].split(','):"",
      // actors: (row[5]&&row[5]!==undefined&&row[5].includes(','))?row[5].split(','):"",
      // poster_url: row[6],
    }
  })
}
