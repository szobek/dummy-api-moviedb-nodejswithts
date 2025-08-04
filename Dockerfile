FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build  # lefordítja a TS-t

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]
