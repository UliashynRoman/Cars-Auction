var mail = require('../middleware/mail');
var express = require('express');
var router = express.Router();

/* GET home page. */ 
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('indexForUser.html');
  } else {
    res.render('indexForAll.html');
  }
});

/* GET account page. */
router.get('/account', function(req, res, next) {
  if (req.isAuthenticated()) {
    let permission = req.session.passport.user.permission;
    if (permission == "Administrator") {
      res.render('administrator.html');
    } else if (permission == "Customer") {
      res.render('account.html');
    } else {
      res.redirect("/");  
    }
  } else {
    res.redirect("login");
  }
});

/* GET password restore page. */
router.get('/forgotPassword', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render('forgotPassword.html');
  }
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render('login.html');
  }
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render('register.html');
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.get('/getUsername', function(req, res, next) {
  if(req.isAuthenticated()) {
    let message = JSON.stringify({
      username: req.session.passport.user.username
    });
    res.send(message);
  } else {
    res.send("unauthorized");
  }
});

router.post("/email", (req, res, next) => {
  const { subject , email , text } = req.body;

  mail(email, subject, text, function(err, data) {
    if (err) {
      console.error(err);
      res.status(500).json({message: 'Internal error'});
    } else {
      res.json({message: 'Email sent!'});
    }
  });
});

module.exports = router;
