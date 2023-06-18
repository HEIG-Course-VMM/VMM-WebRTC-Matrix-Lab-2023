const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();
const httpsServer = https.createServer({
    key: fs.readFileSync('./cert/localhost.key'),
    cert: fs.readFileSync('./cert/localhost.crt')
}, app);
const port = 8080;

app.use(cors());
app.options("*", cors());
app.use(express.static('static-content'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

httpsServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});