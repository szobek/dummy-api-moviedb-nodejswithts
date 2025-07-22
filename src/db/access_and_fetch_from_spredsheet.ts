import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

async function accessSpreadsheet(sheetId: string ,range: string): Promise<any> {
    let fetchedData: any=null;
  // 1. Hozza létre az authentikációs klienst
  const auth = new GoogleAuth({
    // Az útvonal a service account JSON kulcsfájljához
    keyFile: path.join(__dirname, './google_keys.json'), 
    // A szükséges jogosultsági kör(ök)
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // 2. Hozza létre a Google Sheets kliens példányt
  // Itt adjuk át a teljes `auth` objektumot. A `googleapis` tudni fogja,
  // hogyan kezelje a `GoogleAuth` típust.
  const sheets = google.sheets({
    version: 'v4',
    auth: auth, // <-- ITT A LÉNYEG
  });

  // Most már használhatja a `sheets` objektumot
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });
        fetchedData = response.data.values;
    
  } catch (err) {
    console.error('The API returned an error: ' + err);
  }
  return fetchedData
}

export default accessSpreadsheet;