require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const registerRoute = require('./routes/register');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/register', registerRoute);

module.exports = app;
