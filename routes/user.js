const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");
const user = require("../models/user.js");
router.route("/register")
.get(userController.renderSignup)
.post(wrapAsync(userController.register));

router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),userController.login);

router.get("/logout",userController.logout);

module.exports=router;
