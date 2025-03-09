const User=require("../models/user.js");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });

        const registeredUser = await User.register(user, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (error) {
        next(error);
    }
};


module.exports.login=(req,res)=>{
        req.flash("success","Welcome back to Wanderlust");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);``
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    });
};
module.exports.renderSignup=(req,res)=>{ 
    res.render("users/signup.ejs");
  };

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
};