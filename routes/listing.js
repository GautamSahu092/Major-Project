const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {validateReview,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.create));
;


//New Route
router.get("/new",isLoggedIn,listingController.new);

router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.put))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit)) ;


module.exports=router;