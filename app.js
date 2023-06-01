import { readFileSync } from "fs";
import express from "express";
import { createServer } from "https";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

createServer(
    {
      key: readFileSync("localhost.key"),
      cert: readFileSync("localhost.crt"),
    },
    app,
  )
  .listen(3000, () => {
    console.log("server is runing at port 3000");
  });
