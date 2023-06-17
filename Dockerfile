FROM node:20

WORKDIR /app

COPY ./clientApp/package*.json ./

RUN npm install

COPY ./clientApp/app .

EXPOSE 3000

CMD ["node", "server.js"]