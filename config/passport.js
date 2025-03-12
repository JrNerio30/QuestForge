const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PORT_HTTPS } = process.env;


/*/////////////////////////////////////////////////////
                PASSPORT AND SESSION
////////////////////////////////////////////////////*/
// User database
const users = {};

// Passport configuration for Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `https://localhost:${PORT_HTTPS}/api/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
  const user = { 
    id: profile.id,
    username: profile.displayName,
    role: 'user'
  };
  users[profile.id] = user;
  return done(null, user);
}));

// Seralizing and Deserializing User
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Deserializing user:", id);
  done(null, users[id]); 
});

module.exports = passport;