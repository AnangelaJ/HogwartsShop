let user = require('./User');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(function(username, password, done){
    user.getUserByEmail(username, password).then((User)=>{
        if(User.error){
            return done(null, false);
        }else{
            return done(null, User);
        }
        user.comparePassword(passwordL, User.password).then((isMatch)=>{
            if(isMatch)
                return done(null, User);
            else    
                return done(null, false);
        }).catch((err)=>{
            throw err;
        });
    }).catch((err)=>{
        throw err;
    });
});