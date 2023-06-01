const fs = require("fs");
const express = require("express");
const https = require("https");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

https
  .createServer(
    {
      key: fs.readFileSync("localhost.key"),
      cert: fs.readFileSync("localhost.crt"),
    },
    app,
  )
  .listen(3000, () => {
    console.log("server is runing at port 3000");
  });
