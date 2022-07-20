//jshint esversion:6
require("dotenv").config()
const express = require("express")
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose")


const app = express();



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({

    secret: "our little secret.",
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize())
app.use(passport.session());



mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })
// mongoose.set("useCreateIndex", true);
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);


const secret = "Thisourlittlesecret."


const user = new mongoose.model("user", userSchema)
passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get("/logout",function(req,res){
    req.logout(()=>{
        res.redirect("/"); 
    })
  
})
app.get("/", function (req, res) {
    res.render("home")
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
})

app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets")
    }else{
        res.redirect("/login")
    }
    })

app.post("/register", function (req, res) {

    user.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets"); 0 
            })
        }
    })
})

app.post("/login", function (req, res) {

const uaer = new user({
    username : req.body.username,
    password: req.body.password

})
req.login(user,function(err){
if(err){
    console.log(err);

}else{
    passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
    })
}
})
})
app.listen("3000", function (req, res) {
    console.log("server is running on 3000");
})


















































































































































































































