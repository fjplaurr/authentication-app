const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./model/user');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const passportFunctions = require('./passport-config')
const initializePassport = passportFunctions.initializePassport;
const checkAuthentication = passportFunctions.checkAuthentication;
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
const passport = initializePassport();

//Middlewares
app.use(express.urlencoded());
app.use(session({
  secret: process.env.COOKIE_SIGNATURE,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Home route
app.use(express.static('client/build'));

//Login route
app.post('/login', passport.authenticate('local',
  { failureRedirect: '/login', successRedirect: '/', failureFlash: true }
));


app.get('/', checkAuthentication, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
})

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
        res.redirect('/');
      }
    }
  })
});

app.listen(process.env.PORT || 3000);