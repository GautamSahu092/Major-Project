if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash"); 
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const mongoStore=require("connect-mongo");

app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

const dbUrl=process.env.ATLASDB_URL;
console.log(dbUrl);
mongoose.set('debug', true);  // Enable debug mode

async function main() {
  
  
  
  try {
    await mongoose.connect(dbUrl, {
        dbName: "yourDatabaseName",
        useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,    // Replace with your actual database name
    });
    console.log("✅ MongoDB Connected Successfully!");
} catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);  // Exit process on failure
}
 
}
main().catch(err => console.log(err));


const store=mongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,
});


store.on("error",function(e){
  console.log("session store error",e);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,resave:false,saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true
  },
};



//Root
// app.get("/",(req,res)=>{
//   res.send("hello world");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  // console.log(res.locals.success);
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
});
app.get("/demoUser",async(req,res)=>{
   let fakeUser=new User({
    email:"student@gmail.com",
    username:"delta-student",
   });
   const newUser=await User.register(fakeUser,"helloWorld");
   res.send(newUser);
});
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
  next(new ExpressError("Page Not Found",404));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  // console.error(err.stack);
  let {message="Something Went Wrong!",statusCode=500}=err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message); 
});

app.listen(8080,()=>{
    console.log("server is running on port 8080");
});