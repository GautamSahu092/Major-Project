const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {validateReview,validateListing,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
const review = require("../models/review.js");

 
//Reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.post));

//Delete Reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.delete));

module.exports=router;