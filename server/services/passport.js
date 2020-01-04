const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

//user.id is the identifying piece of info i.e if we signIn with different social account id differs but user.id remains same provided by mongoose
//serialize ma hami unique identifying piece of info pass garxam
passport.serializeUser((user, done) => {
  //user,existingUser from below
  //make cookie by including userId  cookie i.e it says that you are user 123 basically identifies user.
  done(null, user.id);
});

//user le post req(magda) passport le cookie pani attach garera pathai dinxa & deserialize identifies cookies & match user
//It looks like this is user 123 they are coming back to us they are already authenticated lets give them list of post
passport.deserializeUser((id, done) => {
  //Identify user with attach cookie
  User.findById(id).then(user => done(null, user));
});
passport.use(
  new GoogleStrategy(
    {
      //param 1 i.e options for strategy
      //hey passport if anyone attempts to authenticate with string google use me i.e new GoogleStrategy
      clientID: process.env.GOOGLE_CLIENT_ID, //Identify our app to google server
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback", //user will be send to this URL after user grants permission on consent screen
      proxy: true //for https
    },
    (accessToken, refreshToken, profile, done) => {
      //oppurtuntiy to save all record we got back from google as code in param

      //console.log("Profile", profile);

      const email = profile.emails[0].value;
      console.log("emily", email);
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (!existingUser) {
          //u re same user that we already have so now i m gonna provide u token that identifies u when u make future req
          const user = new User({
            googleId: profile.id,
            email,
            name: profile.displayName
          });
          //new instances
          user
            .save() //saving to db
            .then(newUser => done(null, newUser))
            .catch(err => console.log(err));
        } else {
          done(null, existingUser);
        }
      });
    }
  )
);

//We need to find some unique identifying tokens in user Google Profile.
//Use that to decide if user is same
