FROM node:14-alpine

WORKDIR /app

COPY ./clientApp/package.json ./clientApp/package-lock.json ./
RUN npm install --production

COPY ./clientApp/client.js .

CMD ["node", "client.js"]