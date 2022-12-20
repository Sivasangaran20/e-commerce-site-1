const User = require('../models/User');
const Cart = require('../models/Cart');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require("express");
const session = require("express-session");


const AuthController = {

    /* create new user */
    async create_user(req, res, next) {

        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).send('That user already exisits!');
            } else{
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10)
            });
            await newUser.save();
            }
            res.status(201).render("index");
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Try to use another username and emailId",
                err
            })
        }
    },

    /* login existing user */
    async login_user(req, res) {

        const user = await User.findOne({ username: req.body.username });

        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            res.status(500).json({
                type: "error",
                message: "User not exists or invalid credentials",
            })
        }
        else {
            const token = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );
            req.session.user = user;
            res.status(200).cookie("token", token, { httpOnly: true })
                .redirect("/home");
        }
    },
    async logout_user(req, res) {
        req.session.destroy();
        return res
            .clearCookie("token")
            .status(200)
            .redirect("/")
    }
};

module.exports = AuthController;