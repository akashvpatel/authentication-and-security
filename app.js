//jshint esversion:6
require("dotenv").config() 
const express = require("express")
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const secret = "Thisourlittlesecret."
userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFeilds: "password"});

  
const user = new mongoose.model("user", userSchema)



mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })
app.get("/", function (req, res) {
    res.render("home")
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
})

app.post("/register", function (req, res) {
    const newUser = new user({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets");
        }
    })
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    user.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);

        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    })

})
app.listen("3000", function (req, res) {
    console.log("server is running on 3000");
})

















































































































































































































