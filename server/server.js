//npm packages
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
//file import

//Passport - Second
const configPassport = require("./services/passport");

//Initializing app
const app = express();

//Db setup
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to db..."))
  .catch(err => console.log("Connection to db fail", err));

//Middlewares - Incoming req to Server are passed to middleware
// parse application/x-www-form-urlencoded
app.use(express.json({ extended: false }));
app.use(morgan("dev"));
app.use(passport.initialize());
if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: `http://localhost:3000` }));
}

//Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/user"));

//SERVER SETUP
const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`Server started on port ${PORT}- ${process.env.NODE_ENV}`);
});
