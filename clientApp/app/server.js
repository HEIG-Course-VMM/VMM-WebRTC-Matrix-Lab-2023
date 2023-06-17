const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');

const httpsServer = https.createServer({
  key: fs.readFileSync('./certs/localhost.key'),
  cert: fs.readFileSync('./certs/localhost.crt')
}, app);

app.use('/lib', express.static('lib'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/lib/index.html');
});

const port = 3000;

httpsServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});