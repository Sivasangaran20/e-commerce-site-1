const express = require('express');
const session = require('express-session');
const Cart = require('../models/Cart')
const User = require('../models/User')
const router = express.Router();
const userSignUpValidationRules = require("../config/validator")

const { AuthController } = require('../controllers');

router.get("/",(req,res)=>{
    res.render("index");
});

router.get("/login",(req,res)=>{
    res.render("signin");
});

router.get("/register",(req,res)=>{
    res.render("signup")
});
router.get("/home",(req,res)=>{
    res.render("home")
});

router.post('/register',userSignUpValidationRules(),AuthController.create_user);
router.post('/login', AuthController.login_user,(req,res)=>{
    req.login_user = session().save;
});
router.get('/logout', AuthController.logout_user);


module.exports = router;