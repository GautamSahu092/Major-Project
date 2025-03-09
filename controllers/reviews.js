const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.post=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Created a new review!");
    console.log("new review saved!");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.delete=async(req,res)=>{
    let {id,reviewId}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Deleted a review!");
    res.redirect(`/listings/${id}`);
  };