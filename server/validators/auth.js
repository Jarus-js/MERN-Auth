//Just Array of checks & if it produces any error it will be passed to validationResult
const { check } = require("express-validator");

exports.registerValidation = [
  //name
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name is required"),
  //email
  check("email")
    .isEmail()
    .withMessage("Email must be valid"),
  //password
  check("password")
    .isLength({ min: 4 })
    .withMessage("Password must be atleast 4 char long")
];

exports.loginValidation = [
  //email
  check("email")
    .isEmail()
    .withMessage("Email must be valid"),
  //password
  check("password")
    .isLength({ min: 4 })
    .withMessage("Password must be atleast 4 char long")
];
exports.forgetPasswordValidation = [
  //email
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email must be valid")
];

exports.resetPasswordValidation = [
  //password
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: 4 })
    .withMessage("Password must be atleast 4 char long")
];
