# DUMMY API for movie frontend wit express+mysql in TS

### the datas in a google spredsheet  
### for install
create a google service account,download JSON File and copy it to src/db directory with google_keys.json name  
create an env file  
example:  
  
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=ushaeW3.
DB_DATABASE=movie_db

GOOGLE_SHEET_ID=1sisaxth3T1qmjzxq7hSeZKEC25YyaxWy_01gxO7gtBc
GOOGLE_SHEET_RANGE_FOR_MOVIES=filmek!A2:H1000
GOOGLE_SHEET_RANGE_FOR_GENRES=mufajok!A2:B1000
GOOGLE_SHEET_RANGE_FOR_ACTORS=szineszek!A2:D1000
```
```shell
npm i
npx knex migrate:latest
npx knex seed:run

```
the seeder work with a sheet data  

in the root has a request.http ( i use REST Client: https://marketplace.visualstudio.com/items?itemName=humao.rest-client) file for testing and read the endpoints