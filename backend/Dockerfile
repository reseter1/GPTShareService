FROM node:20.19.0 as gptshare-be

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY src/.env .env

EXPOSE 3000

CMD ["node", "src/index.js"] 