const express = require("express");
const { updateProfile, loginUser, getAllUser } = require("./userController");
const { UserProtect } = require("../../middlewere/TokenMiddlewere");
const router = express.Router();

router.post("/login", loginUser); //9977
router.put("/update", UserProtect, updateProfile);
router.get("/getAllUser", UserProtect, getAllUser);

router.get("/", (req, res) => {
  res.send("/login  /update /getAllUser");
});
// router.post('/login' , loginUser)

module.exports = router;