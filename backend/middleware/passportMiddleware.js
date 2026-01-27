import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

const clientId = process.env.CLIENT_ID;
const googleSecret = process.env.GOOGLE_SECRET;
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

// google authorization middleware
passport.use(
  new GoogleStrategy(
    {
      clientID: clientId,
      clientSecret: googleSecret,
      callbackURL: `${backendUrl}/api/auth/loggedIn`,
    },
    (accessToken, refreshToken, profile, done) => {
      if (!accessToken) {
        return done(new Error('No access token received'), null);
      }

      done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
