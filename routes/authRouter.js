const express = require('express');
const bodyParser = require('body-parser');
// const axios = require('axios');
const bcrypt = require('bcrypt');
// const passport = require('passport');
const pool = require('../pool');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');
const Cookies = require('universal-cookie');

const secret = 'Luc1f3rMyL0v3';

authRouter.use(bodyParser.json());

authRouter.post('/refresh', (req, response) => {
  const cookies = new Cookies(req.headers.cookie);
  console.log('cookies', cookies);
  var msg = null;
  if (cookies.cookies.refreshToken) {
    msg = 'there is a refresh token available!';
  } else {
    msg = 'there is no refresh token available';
  }
  console.log(msg);
  response.status(200).send(msg);
});

authRouter.post('/login', (req, response) => {
  // console.log('request headers', req.headers);
  // console.log('body', req.body);

  const { username, password } = req.query;
  // if (req.session.user === 'authenticated') {
  if (req.headers.accessToken) {
    response
      .status(201)
      .send({ status: 'warning', message: 'Already authenticated' });
  } else {
    pool.query(
      `SELECT * FROM auth WHERE username LIKE $1`,
      [username],
      (error, result) => {
        if (error) {
          response.status(400).send({
            status: 'error',
            message:
              'Authentication issue.  Please contact your administrator.',
          });
          console.log('error', error);
        }
        console.log('testing results', result);
        if (result.rows[0]) {
          bcrypt.compare(password, result.rows[0].hash, function (err, res) {
            if (res) {
              // log them in
              pool.query(
                `UPDATE auth SET updated_at = now() WHERE username LIKE $1`,
                [username]
              );
              console.log('match! userinfo', result.rows[0]);
              const { id } = result.rows[0];
              // I think this is where I need to replace with jwt code
              const accessToken = jwt.sign(
                { id },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: 30,
                }
              );
              const refreshToken = jwt.sign(
                { id },
                process.env.REFRESH_TOKEN_SECRET
              );
              // the refreshToken must be inserted into the database, to be blacklisted if necessary
              console.log('successful login');
              response.send({
                status: 'success',
                message: 'This is all of the important information',
                accessToken: `Bearer ${accessToken}`,
                refreshToken,
              });
            } else {
              response.status(400).send({
                status: 'error',
                message: 'Password entered does not match.',
              });
            }
          });
        } else {
          var msg = 'User does not exist';
          console.log(msg);
          response.status(400).send({status: 'warning', message: 'User does not exist.'});
        }
      }
    );
  }
});

authRouter.post('/register', (req, response) => {
  console.log('req', req);
  const { username, password, confirm, inputName } = req.query;

  var missingParameters = [];
  if (!username) {
    missingParameters.push('username');
  }
  if (!password) {
    console.log('password is missing...');
    missingParameters.push('password');
  }
  if (!confirm) {
    missingParameters.push('confirm');
  }

  if (missingParameters.length > 0) {
    response.send({
      status: 'error',
      message: 'Missing required parameters: ' + missingParameters.join(', '),
    });
  } else if (password !== confirm) {
    response.send({ status: 'error', message: 'Passwords do not match' });
  } else {
    pool.query(
      `SELECT EXISTS (SELECT * FROM auth WHERE username LIKE $1)`,
      [username],
      (error, results) => {
        if (error) {
          console.log('admin error', error);
          response.send({
            status: 'error',
            message: 'Registration failure.  Please contact administrator.',
          });
        }
        const { exists } = results.rows[0];
        if (exists) {
          response.status(200).send({
            status: 'warning',
            message: `Username ${username} already registered.`,
          });
        } else {
          // register the account
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              pool.query(
                `INSERT INTO auth (id, username, hash, created_at, updated_at) VALUES ($1, $2, $3, now(), now())`,
                [uuidv4(), username, hash],
                (err, rez) => {
                  if (err) {
                    response.send({
                      status: 'error',
                      message:
                        'Registration failure.  Please contact administrator.',
                    });
                  } else {
                    response.status(201).send({
                      status: 'success',
                      message: 'Registered Successfully',
                    });
                  }
                }
              );
            });
          });
        }
      }
    );
  }
});

authRouter.get('/logout', (req, res) => {
  if (req.session.email) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    res.status(401).send('You are not logged in');
  }
});

module.exports = authRouter;
