require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authRouter = require('./routes/authRouter');
app.use('/auth', authRouter);

app.use('/test', () => {
  console.log('test test');
});

app.listen(process.env.SERVER_PORT_LOCAL, () =>
  console.log(`Godot-API listening on port ${process.env.SERVER_PORT_LOCAL}!`)
);

module.exports = app;
