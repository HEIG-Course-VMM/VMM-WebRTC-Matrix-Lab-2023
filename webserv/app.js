const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 8080;

app.use(cors());
app.options("*", cors());
app.use(morgan('dev'));
app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.sendFile('./static/index.html', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});