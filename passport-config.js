const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcryptjs = require("bcryptjs");
const User = require("./model/user");

function configurePassport() {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      (username, password, done) => {
        User.findOne({ email: username }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }
          bcryptjs.compare(password, user.password).then((res) => {
            if (res) {
              done(null, user);
            } else {
              done(null, false, { message: "Incorrect password." });
            }
          });
          return null;
        });
      }
    )
  );

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
