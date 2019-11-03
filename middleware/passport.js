var localStrategy = require("passport-local").Strategy;

var jwtStrategy = require("passport-jwt").Strategy;
var extractJwt = require("passport-jwt").ExtractJwt;

var user = require("../orm/user");
var bcrypt = require("bcrypt");

module.exports = function(passport) {
    passport.serializeUser((userdata, done) => {
        user.getUser(userdata.username, (result) => {
            userdata.permission = result.Permission;
            return done(null, userdata);
        }, (error) => {
            res.status(500).send("Server internal error");
        });
    });
    passport.deserializeUser((userdata, done) => {
        user.getUser(userdata.username, (result) => {
            userdata.permission = result.Permission;
            return done(null, userdata);
        }, (error) => {
            res.status(500).send("Server internal error");
        });       
    });

    // passport.use(new jwtStrategy({
    //     jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    //     secretOrKey: "private key"
    // }, (jwtPayload, done) => {
    //     return user.getUser(jwtPayload.username, (userdata) => {
    //         if (userdata) {
    //             var valid = bcrypt.compareSync(jwtPayload.password, userdata.UserPassword);
    //             if (valid) {
    //                 done(null, {
    //                     username: userdata.Email,
    //                     password: userdata.UserPassword,
    //                     permission: userdata.Permission
    //                 });
    //             } else {
    //                 done(null, false);
    //             }
    //         } else {
    //             done(null, false);
    //         }
    //     }, (error) => {
    //         done(error);
    //     });
    // }));

    passport.use(new localStrategy({
        usernameField: "email",
        passwordField: "password"
    }, (username, password, done) => {
        user.getUser(username, (userdata) => {
            if (userdata) {
                var valid = bcrypt.compareSync(password, userdata.UserPassword);
                if (valid) {
                    done(null, {
                        username: userdata.Email,
                        password: userdata.UserPassword,
                        permission: userdata.Permission
                    });
                } else {
                    done(null, false);
                }
            } else {
                done(null, false);
            }
        }, (error) => {
            done(error);
        });
    }));
}