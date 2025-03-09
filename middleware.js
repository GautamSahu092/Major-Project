const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be signed in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    console.log("User:", req.user);

    let list=await Listing.findById(id);
    if(! list.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing= (req,res,next)=>{
    let result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
      let errMsg=result.error.details.map(el=>el.message).join(",");
      throw new ExpressError(errMsg,400);
    }
    else{
      next();
    }
    
    };
module.exports.validateReview= (req,res,next)=>{
    let result=reviewSchema.validate(req.body);
        console.log(result);
        if(result.error){
          let errMsg=result.error.details.map(el=>el.message).join(",");
          throw new ExpressError(errMsg,400);
        }
        else{
          next();
        }
    
  };

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}