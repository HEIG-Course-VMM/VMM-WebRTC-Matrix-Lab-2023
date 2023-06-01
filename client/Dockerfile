FROM node:latest

WORKDIR /usr/src/app/frontend

COPY package*.json ./

ENV PATH /usr/src/app/frontend/node_modules/.bin:$PATH

RUN npm install
RUN npm install react-scripts@5.0.1 -g --silent

RUN npm install nodemon --save-dev

COPY . .

EXPOSE 3000

CMD ["nodemon", "start"]