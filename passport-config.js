const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('./model/user');
const bcryptjs = require('bcryptjs');

function initializePassport() {
  passport.use(new LocalStrategy({
    usernameField: 'name',
  },
    function (username, password, done) {
      User.findOne({ name: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
        bcryptjs.compare(password, user.password).then((res) => {
          return res ? done(null, user) : done(null, false, { message: 'Incorrect password.' })
        })
      });
    }
  ));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
  return passport;
}

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = {
  initializePassport,
  checkAuthentication,
}
