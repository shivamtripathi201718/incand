//Requiring all the 3rd party modules
var express     = require("express")
var bodyParser  = require("body-parser")
var passport    = require("passport")
var LocalStrategy=require("passport-local")
var mongoose = require('mongoose')
var flash = require('express-flash');
//Requiring Local Modules
var User = require('./models/user')
var Event = require('./models/event')
//Using Express
var app = express();
//Connecting To Database
mongoose.connect("mongodb://localhost:27017/Incand",{useNewUrlParser: true})

//Using Middlewares
app.use(bodyParser.urlencoded({extended: true}))
app.use(flash());
app.use(require("express-session")({
	secret:"incand",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Using View Engines
app.set("view engine", "ejs");

//Functions
var isLoggedIn = (req,res,next)=>{
	if(req.isAuthenticated()){
	return next();
}
req.flash("error","Please Login First")
res.redirect("/login");
}

//Routes

//Register Admin

app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
	if(err){
	res.render(err);
	res.redirect('/register');
}
passport.authenticate("local")(req,res,()=>{
	res.redirect("/register");
})
})
});

//register Inacnd teams

app.get('/registerIncand',(req,res)=>{
    res.render('registerIncand',{message: req.flash('success')})
})

app.post('/registerIncand',(req,res)=>{
    console.log(req.body)
    var event = req.body.event;
    var details = req.body.details;

    Event.create({
        eventName: event,
        details: details
    },(err,data)=>{
        if(err)
        {
            return res.status(400).send()
        }
        req.flash("success","Registered Successfully ")
        res.redirect('/registerIncand')
    })

})

//queries
app.get('/queriesIncand',(req,res)=>{
    
    res.render('queriesIncand',{message: req.flash('success')})
})

app.post('/queriesIncand',(req,res)=>{
    console.log(req.body)
    var eventName = req.body.event;
    var query = req.body.query;

    Event.create({
        eventName: eventName,
        query: query
    },(err,data)=>{
        if(err)
        {
            return res.status(400).send()
        }
        req.flash("success","Query submitted")
        res.redirect('/queriesIncand')
    })

})
//contactUS
app.get('/contactUsIncand',(req,res)=>{
    
    res.render('contactUsIncand',{message: req.flash('success')})
})

app.post('/contactUsIncand',(req,res)=>{
    console.log(req.body)
    var teamName = req.body.teamname;
    var details = req.body.details;

    Event.create({
        teamName: teamName,
        details: details
    },(err,data)=>{
        if(err)
        {
            return res.status(400).send()
        }
        res.redirect('/contactUsIncand');
         
    
})
})

//admin data
app.get('/data', isLoggedIn ,(req,res)=>{
    Event.find({},(err, data)=>{
        if(err)
        {
            return res.status(404).send()
        }
        res.render('data', {data})
    })
})

app.get("/login",(req,res)=>{
    res.render("login",{message: req.flash('error')});
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/data",
    failureRedirect:"/login",
    failureFlash : true
}));

//Logout User

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});


app.listen(process.env.PORT, ()=>{
    console.log("The YelpCamp Server Has Started!");
 });

