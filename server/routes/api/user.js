const router = require("express").Router();

//Controllers
const { userById, updateUser } = require("../../controllers/user");
const { requireLogin } = require("../../controllers/auth");

// => /api/user/:userId
router.get("/:userId", requireLogin, userById);

// => /api/user/update
router.post("/update", requireLogin, updateUser);

module.exports = router;
