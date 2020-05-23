const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.use(new localStrategy({
    usernameField: 'nick'
}, async (nick, password, done) => {
    //MATCH EMAIL's user
    const user = await User.findOne({nick});
    if(!user){
        return done(null, false, {message: 'Not user found'});
    } else{
        user.logged = Date.now();
        await user.save();
        const match = await user.comparePassword(password);
        if(match){
            return done(null, user);
        } else{
            return done(null, false, {message: "Incorrect password"});
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});