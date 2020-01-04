//CONTROLLERS SENDS the response

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//Model
const User = require("../models/User");

exports.register = (req, res) => {
  //console.log("Form Input", req.body);
  const { name, email, password } = req.body;

  //Check if the email is already registered in db that new user wants to use
  User.findOne({ email }).then(userEmail => {
    if (userEmail) {
       res.status(400).json({ error: "Email is in use" });
    }
  });

  const token = jwt.sign(
    { name, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: "50m"
    }
  );

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Account Activation Link`,
    html: `
        <h1>Please use following Link to Activate your Account</h1>
        <a href='${process.env.CLIENT_URL}/activate/${token}'>Link</a>
        <hr />
        <p>This Email may contain sensetive information</p>
      `
  };

  sgMail
    .send(emailData)
    .then(sent => {
      // console.log("Email sent", sent);
      // console.log("Tokyo", token);
       res.json({
        message: `Email has been sent to ${email}`
      });
    })
    .catch(err => {
      res.json({
        error: err
      });
    });
  };

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(
      //secret match hunuparxa
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Expired link sign in again"
        });
      }
      // token decode garera nikaleko info nai new user create garna lai use garne
      const { name, email, password } = jwt.decode(token);
      const user = new User({ name, email, password });

      //Hashing Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          user
            .save()
            .then(user => {
              console.log("Activated", user);
              res.json({ message: "Signup success please proceed to Login" });
            })
            .catch(err => {
              res.json(err);
            });
        }); //hash
      }); //genSalt
    }); //verify
  } else {
    res.json({ message: "Something went wrong" });
  }
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    return res.status(400).json({ error: "Fields are required" });
  }
  //Check if user exist
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res
          .status(400)
          .json({ error: "User with that email don't exist" });
      }
      //Comparing password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.json(err);
        }
        if (!isMatch) {
          res.status(400).json({ error: "Password not match" });
        } else {
          //generate token
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
          });
          const { _id, name, email, role } = user;
          res.json({
            token,//my proof provided be server that i logged in this app before some time before day week
            user: { _id, name, email, role }
          });
        }
      }); //bcrypt
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

//Auth user middleware
exports.requireLogin = expressJwt({
  //it not only validate token but also provide user in req.user
  secret: process.env.JWT_SECRET
});

//Admin middleware
exports.adminMiddleware = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(400).json({ error: "Admin page.access denied" });
      }

      req.profile = user;
      next();
    })
    .catch(err => res.status(400).json({ error: err }));
};

exports.forgetPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const token = jwt.sign(
        { _id: user._id, name: user.name },
        process.env.JWT_SECRET
      );

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password Reset Link`,
        html: `
                <h1>Please use following Link to reset your password</h1>
                <a href='${process.env.CLIENT_URL}/resetPassword/${token}'>Link</a>
              `
      };

      return user.updateOne({ resetPasswordLink: token }).then(success => {
        //console.log('Success',success)
        sgMail
          .send(emailData)
          .then(sent => {
            // console.log("Email sent", sent);
            // console.log("Tokyo", token);
            res.json({
              message: `Email has been sent to ${email}`
            });
          })
          .catch(err => {
            console.log("sending email error", err);
            return res.json({
              error: err.message
            });
          });
      }); //updateOne
    }) //findOne
    .catch(err => {
      res.json({
        error: err.message
      });
    });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink } = req.body;
  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_SECRET, function(err) {
      if (err) {
        return res.status(401).json({
          error: "Expired link."
        });
      }
      User.findOne({ resetPasswordLink }).then(user => {
        //console.log("tokenUser", user);
        user.password = req.body.newPassword;
        //Hashing Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            user.resetPasswordLink = "";
            user
              .save()
              .then(result => {
                return res
                  .status(200)
                  .json({ message: "Password Successfully Changed" });
              })
              .catch(err => {
                console.log("error", err);
              });
          }); //hash
        }); //genSalt
      }); //findOne
    }); //verify func
  } //if(resetpasswordLink)
}; //req,res
