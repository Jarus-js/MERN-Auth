//INCOMING REQ comes to route handler
const express = require("express");
const router = express.Router();
const passport = require("passport");

//Controllers
const {
  register,
  accountActivation,
  login,
  forgetPassword,
  resetPassword
} = require("../../controllers/auth");

//Validators
const {
  registerValidation,
  forgetPasswordValidation,
  resetPasswordValidation
} = require("../../validators/auth");
const { runValidation } = require("../../validators/index");

// => /api/auth/register
router.post("/register", registerValidation, runValidation, register);

// => /api/auth/account-activation
router.post("/account-activation", accountActivation);

// => /api/auth/login
router.post("/login", login);

//=> /api/auth/forget-password
router.post(
  "/forget-password",
  forgetPasswordValidation,
  runValidation,
  forgetPassword
);
//=> /api/auth/reset-password
router.post(
  "/reset-password",
  resetPasswordValidation,
  runValidation,
  resetPassword
);

//=> /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"] //scope i.e what user permissions we want from google server
  })
);

//=> /api/auth/google/callback
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("/dashboard");
});

module.exports = router;
