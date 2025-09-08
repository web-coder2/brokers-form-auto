const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));

app.listen(3000, () => {
    console.log('server app running >>> http://localhost:5000');
});
