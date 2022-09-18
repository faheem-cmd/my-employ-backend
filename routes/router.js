const express = require("express");
var router = express();
const bodyparser = require("body-parser");
const auth = require("../middlewares/user.middleware");
router.use(bodyparser.json());

const user = require("../controllers/authentication");
const userProfile = require("../controllers/user.controller");

router.post("/signup", user.signup);
router.post("/login", user.login);
router.get("/profile", auth.accessToken, userProfile.getProfile);
router.put("/editProfile", auth.accessToken, userProfile.editProfile);

module.exports = router;
