const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("./models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      let user = await User.findOne({ email: profile._json.email });
      if (user && !user.oauthId) {
        user.oauthId = profile.id;
        await user.save();
      }
      if (!user) {
        user = new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          oauthId: profile.id,
          profilePic: profile.photos[0].value,
        });
        const result = await user.save();
        console.log(result);
      }
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
