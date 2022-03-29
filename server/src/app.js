const express = require('express');
const path = require('path');

const cors = require('cors');
const morgan = require('morgan');

const v1Api = require('./routes/versions/v1.route');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(morgan('combined'));

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', v1Api);

app.get('/*', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app;
