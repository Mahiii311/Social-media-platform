const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const md5 = require('md5');

module.exports = {
    commonMiddleware: function (req, res, next) {
        if (req.user) {
            res.locals.userLogIn = req.user;
        }
        console.log(req.user);
        // console.log("user log in",req.user);     //use deserializeUser data
        // console.log("user log in passport",req.session.passport.user);   // use serializeUser data
        let error = req.flash('error');
        let success = req.flash('success');
        if (success.length > 0) {
            res.locals.flash = {
                type: 'success',
                message: success
            };
        }
        if (error.length > 0) {
            res.locals.flash = {
                type: 'error',
                message: error
            };
        }
        return next();
    },
    login: function (app) {

        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            /**function for login user
            * @param {string} username
            * @param {string} password
            * @param {Function} done
            * @return {[type]}
            */
            function (req, username, password, done) {
                console.log("username--------passport func---------");
                // console.log(req);
                console.log(username);
                console.log(password);
                userModel.findOne({
                    email: {
                        $regex: '^' + username + '$',
                        $options: 'i'
                    },
                    // password: md5(password)
                    password: password
                }, {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    fullName: 1,
                    password: 1,
                    email: 1,
                    profilephoto: 1
                }).then(async function (user) {
                    // if user not found
                    if (!user) {
                        console.log("=====================error================");
                        return done(null, false, {
                            message: 'Please enter valid login details'
                        });
                    } else {
                        console.log("========================success=============");
                        console.log(user);
                        return done(null, user);
                    }
                    // handle catch 
                }).catch(function (err) {
                    console.log("function error", err);
                    return done(null, false, {
                        message: 'Please enter valid login details'
                    });
                });
            }
        ));

        passport.serializeUser(function (user, done) {
            console.log("serializeUser");
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            try {
                console.log("deserializeUser");
                // console.log(user);
                done(null, user);
            } catch (error) {
                console.log(error);
            }
        });
    },
    chackAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/")
    }
}