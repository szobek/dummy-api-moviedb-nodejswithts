FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y default-mysql-client

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build  

COPY /src/db/google_keys.json /app/dist/src/db/google_keys.json

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
