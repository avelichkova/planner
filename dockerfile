FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "node", "index.js" ]
