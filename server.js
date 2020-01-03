const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./model/user');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const configurePassport = require('./passport-config');
const path = require('path');
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

//Middlewares
const sessionProperties = {
  secret: process.env.COOKIE_SIGNATURE,
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV == 'production') {
  sessionProperties.secure = true; //By default is false for dev enviorment
}
app.use(session(sessionProperties));
app.use(express.urlencoded({ extended: true }));
app.use(pass.initialize());
app.use(pass.session());
app.use(flash());

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
})

app.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  }
})

app.get('/login', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  }
})

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