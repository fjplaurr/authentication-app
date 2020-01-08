const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('./model/user');
const bcryptjs = require('bcryptjs');

function configurePassport() {
  passport.use(new LocalStrategy({
    usernameField: 'email',
  },
    function (username, password, done) {
      User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Incorrect email.' }); }
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

module.exports = configurePassport;

