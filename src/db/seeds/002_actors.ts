import { Knex } from "knex";
import accessSpreadsheet  from '../access_and_fetch_from_spredsheet'; 
import dotenv from 'dotenv';
dotenv.config();

// A Knex seed fájl, amely feltölti az 'actors' táblát a Google Sheets-ből származó adatokkal
// A Google Sheets API használatával lekéri az adatokat, majd a 'actors' táblába illeszti be őket.

interface Actor {
    id: number;
    fullName: string;
    bio: string;
    sex: string;
    date_of_birth: string;
}

export async function seed(knex: Knex): Promise<void> {
   const data=await accessSpreadsheet(process.env.GOOGLE_SHEET_ID as string, process.env.GOOGLE_SHEET_RANGE_FOR_ACTORS as string);
   if (data) {
    await knex('actors').del();
    await knex('actors').insert(convert(data));
   }
   
};


const convert = (data:any) => {
  let id:number = 0
  let actors: Actor[] = []
  actors = data.map((row:any, index:number) => {
    const obj:Actor={} as Actor;
    if (row[0] && row[0] !== undefined) {
      obj.id = ++id;
      obj.fullName = row[0].trim();
      obj.bio = row[1].trim();
      obj.sex = row[2].trim();
      obj.date_of_birth = row[3].trim();
    }
    return obj;
  });
  return actors

}