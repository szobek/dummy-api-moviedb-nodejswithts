import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

async function accessSpreadsheet(sheetId: string ,range: string): Promise<any> {
    let fetchedData: any=null;
  const auth = new GoogleAuth({
    keyFile: path.join(__dirname, './google_keys.json'), 
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

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