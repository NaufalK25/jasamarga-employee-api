const path = require('path');
const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(routes);

app.listen(port, () => {
    console.log(`Express listening on port ${port}`);
})