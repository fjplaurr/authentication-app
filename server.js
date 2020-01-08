const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./model/user');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const configurePassport = require('./passport-config');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to mongoose'));

//Initialize Passport
const pass = configurePassport();

//Express-session Properties
const sessionProperties = {
  secret: process.env.COOKIE_SIGNATURE,
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV == 'production') {
  sessionProperties.secure = true; //By default is false for dev enviornment
}

//Middlewares
app.use(session(sessionProperties));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(pass.initialize());
app.use(pass.session());
app.use(flash());
app.use(cors());

//Login route
app.post('/login', function (req, res, next) {
  pass.authenticate('local', function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) { return res.redirect('/login'); }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  }
});

app.get('/resetpassword/:passwordToken', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  }
});

app.get('/logout', (req, res) => {
  if (req.isAuthenticated) {
    req.logout();
  }
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  }
});

app.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  }
});

app.post('/resetpassword', async (req, res) => {
  const hashNewPass = await bcryptjs.hash(req.body.newPass, 10);
  User.findOneAndUpdate({ passwordToken: req.body.passwordToken },
    { password: hashNewPass },
    (err, user) => {
      if (user) {
        res.status(200).send('Password succesfully changed')
      } else {
        res.status(400).send('There was an error and the password could not be change');
      }
    })
})

app.post('/forgotpassword', (req, res) => {
  User.findOneAndUpdate({ email: req.body.email },
    { passwordToken: crypto.randomBytes(10).toString('hex') },
    { new: true },
    (err, user) => {
      if (user) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASS}`,
          }
        });
        // Message object
        let message = {
          from: `${process.env.EMAIL_ADDRESS}`,
          to: 'fjplaurr@gmail.com',
          subject: 'Link to reset password',
          text:
            `We are sending you this email because we received a request to change your password. To introduce a new password, click the next link or paste it in your browser.
            http://localhost:3000/resetpassword/${user.passwordToken}

            If you have not requested a password change, please ignore this email and the password will remain the same.`,
        };
        transporter.sendMail(message, (err, response) => {
          if (err) {
            console.log('Error occurred. ' + err.message);
          } else {
            res.status(200).send('Recovery email sent');
          }
        });
      } else {
        res.status(404).send('Email is not registered.');
      }
    });
});

//Home route
app.use(express.static('client/build'));

//Register route
app.post('/register', async (req, res) => {
  //Hash password
  const hashPassw = await bcryptjs.hash(req.body.password, 10);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassw,
  });
  //Save in mongo database
  user.save((err, user) => {
    //Check error 11000 (duplicate index)
    if (err && err.code == 11000) {
      res.status(400).send('The email already exists.');
    } else {
      if (err) {
        res.status(400).send(err);
      } else {
        res.redirect('/login');
      }
    }
  })
});

app.listen(process.env.PORT || 3000);