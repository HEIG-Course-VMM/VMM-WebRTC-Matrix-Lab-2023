const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const https = require('https');
const fs = require('fs');

const app = express();
const httpsServer = https.createServer({
    key: fs.readFileSync('./certs/localhost.key'),
    cert: fs.readFileSync('./certs/localhost.crt')
}, app);
const port = 8080;

app.use(cors());
app.options("*", cors());
app.use(morgan('dev'));
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.sendFile('./static/index.html', {root: __dirname});
});

httpsServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});