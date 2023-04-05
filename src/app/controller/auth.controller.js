const passport = require("passport");
const User = require("../model/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();

class AuthController {
  constructor() {
    this.init();
  }
  init() {
    passport.use(
      new LocalStrategy(
        { usernameField: "email" },
        (email, password, done) => {
          User.findOne({ email: email }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            user.comparePassword(password, (err, isMatch) => {
              if (err) return done(err);
              if (isMatch) return done(null, user);
              return done(null, false);
            });
          });
        }
      )
    );
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "http://localhost:3000/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, done) {
          User.findOne({ email: profile.emails[0].value }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);
            const newUser = new User({
              email: profile.emails[0].value,
              password: "google",
            });
            newUser.save((err) => {
              if (err) return done(err);
              return done(null, newUser);
            });
          });
        }
      )
    );

    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: "/auth/facebook/callback",
          profileFields: ["id", "email", "name"],
        },
        function (accessToken, refreshToken, profile, done) {
          User.findOne({ email: profile.emails[0].value }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);
            const newUser = new User({
              email: profile.emails[0].value,
              password: "facebook",
            });
            newUser.save((err) => {
              if (err) return done(err);
              return done(null, newUser);
            });
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
  }
  login(req, res) {
    res.render("login",{success: req.flash('success'),error: req.flash('error')});
  }
  register(req, res) {
    res.render("register",{error: req.flash('error')});
  }
  postRegister(req, res) {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      birthday: req.body.birthday,
      SDT: req.body.sdt,
      name: req.body.name,
    });

    user.save((err) => {
      if (err)
        {req.flash('error', "Đăng ký không thành công vui lòng thử email khác");
        res.redirect("/auth/register");}
      else{
        req.flash('success','Đăng ký thành công')
        res.redirect("/auth/login")
      }
    });
  }
  postLogin(req, res, next) {
    passport
      .authenticate("local", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          res.json({ code: 0, message: "Đăng nhập không thành công" }),
            res.render("login", {
              error: "Invalid username or password",
            });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.redirect("/home");
        });
      })(req, res, next);
  }

  logout(req, res) {
    req.logout(() => {
      res.redirect("/");
    });
  }

  authGoogle(req, res, next) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  }
  authGoogleCallback(req, res, next) {
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
    })(req, res, next);
  }
  authFacebook(req, res, next) {
    passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
  }
  authFacebookCallback(req, res, next) {
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
    })(req, res, next);
  }

}

module.exports = new AuthController();
