const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async (req, res, next) => {
  
    let lists = await Listing.find({});
    // console.log("Fetched Listings:", lists); // Debugging: Log fetched data
    res.render("listings/index.ejs", { lists });

};
module.exports.new=(req,res)=>{
    res.render("listings/new.ejs");
  }
module.exports.show=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!list){
      req.flash("error","Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list,mapToken:process.env.MAP_TOKEN});
  };

module.exports.create=async (req, res, next) => {
 let response= await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send();
  //  console.log("Response:", ); 
   
    // console.log("Received Data:", req.body.listing); // Log the incoming data
   
    let newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url:req.file.path,filename:req.file.filename};
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","Created a new listing!");
    // console.log("Listing saved successfully:", newListing);
    res.redirect("/listings");

};
module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    if(!list){
      req.flash("error","Listing not found!");
      return res.redirect("/listings");
    }
    let orgImage=list.image.url;
    orgImage=orgImage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{list,orgImage});
  };
  module.exports.put=async(req,res)=>{
    // console.log(req.body);
    let {id}=req.params;
    console.log(id);
    let list=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
      list.image={url:req.file.path,filename:req.file.filename};
      await list.save();
    }
    
    // console.log(list);
    let currUser=req.user._id;
    req.flash("success","Updated listing!");
    res.redirect(`/listings/${id}`);
  };
module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
  };