const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('./model/user');
const bcryptjs = require('bcryptjs');

function configurePassport() {
  passport.use(new LocalStrategy({
    usernameField: 'name',
  },
    function (username, password, done) {
      User.findOne({ name: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
        bcryptjs.compare(password, user.password).then((res) => {
          if (res) {
            done(null, user)
          } else {
            done(null, false, { message: 'Incorrect password.' })
          }
        });
      });
    }
  ));
  return passport;
}

function checkAuthentication(req, res, next) {
  if (!req.isAuthenticated()) {
    console.log('menelao');
    res.redirect("/login");
  }
  next();
}

module.exports = {
  configurePassport,
  checkAuthentication,
}
