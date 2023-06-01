FROM node:20.2-alpine3.16

WORKDIR /app

COPY ./clientApp/* ./
RUN npm install

CMD ["node", "server.js"]