const bcrypt = require('bcryptjs');
//model
const User = require("../models/User");
//a file by default contain exports imports
exports.userById = (req, res) => {
  console.log("currentLogin", req.user);
  User.findById(req.params.userId).then(user => {
    // console.log("userId", user);
    if (!user) {
      return res.status(400).json({
        error: "User Not Found"
      });
    }
    res.json(user);
  });
};

exports.updateUser = (req, res) => {
  const { name, password } = req.body;
  User.findOne({ _id: req.user._id })
    .then(user => {
      if (name === "" && password === "") {
        return res.status(400).json({ message: "Fields are required" });
      }
      if (name) {user.name = name; }
      if (password) { user.password = password; }
      //Hashing Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          
      user
      .save()
      .then(updatedUser => {
        console.log("updatedUser", updatedUser);
        return res.status(200).json({ message: "Update Successful" });
      })
      .catch(err => res.status(400).json({ error: err }));
        })//hash
      })//genSalt
    })//findOne
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: err });
    });
};
