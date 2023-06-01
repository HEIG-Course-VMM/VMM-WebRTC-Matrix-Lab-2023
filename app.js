import { readFileSync } from "fs";
import express from "express";
import { createServer } from "https";
const app = express();
const port = 3000;

app.use(express.static("static-content"));

createServer(
    {
      key: readFileSync("localhost.key"),
      cert: readFileSync("localhost.crt"),
    },
    app
  )
  .listen(3000, () => {
    console.log("server is runing at port 3000");
  });
