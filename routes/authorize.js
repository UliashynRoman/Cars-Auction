var express = require("express");
var user = require("../orm/user.js");
var bcrypt = require("bcrypt");
var router = express.Router();
var jwt = require("jsonwebtoken");

module.exports = function(passport) {
    router.post('/signup', function(req, res, next) {
        let email = req.body.email;
        let password = req.body.password;
        let firstName = req.body.name;
        let lastName = req.body.surname;

        user.getUser(email, (result) => {
            if (result) {
                res.status(200).send("User with such email already exists");
            } else {
                let newUser = new Object();
                newUser.email = email;
                newUser.passwordSalt = bcrypt.genSaltSync();
                newUser.userPassword = bcrypt.hashSync(password, newUser.passwordSalt);
                newUser.firstName = firstName;
                newUser.lastName = lastName;
                user.addUser(newUser, (result) => {
                    res.redirect("/account");
                }, (error) => {
                    console.error(error);
                    res.status(500).send("Server internal error");
                });
            }
        }, (error) => {
            console.error(error);
            res.status(500).send("Server internal error");
        });
    });

    router.post('/login', passport.authenticate('local', {
        successRedirect: "/account",
        failureRedirect: "/login"
    }), (req, res, next) => {
        res.send("1337");
    });

    // router.post('/login', function(req, res, next) {
    //     passport.authenticate('local', {
    //         session: false
    //     }, (error, user, info) => {
    //         console.log(user);

    //         if (!user) {
    //             return res.status(401).send("Authentication failure");
    //         }

    //         if (error) {
    //             return res.status(400).send("Bad request");
    //         }

    //         req.login(user, { 
    //             session: false 
    //         }, (error) => {
    //             if (error) {
    //                 res.status(400).send(error);
    //             }

    //             const token = jwt.sign("user", "private key");
    //             return res.json({ user, token });
    //         });
    //     })(req, res);
    // });
    
    return router;
}