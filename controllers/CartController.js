const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User')
const Cart = require('../models/Cart');

const app = express()

app.set('view engine', 'ejs');


const CartController = {

    /* get all carts (only admin) */
    async get_carts(req, res) {
        try {
            const carts = await Cart.find();
            res.status(200).json({
                type: "success",
                carts
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* get user cart */
    async get_cart(req, res) {
        try {
            const cart = await Cart.findOne({ userId: req.session.user });
            res.status(200).render("cart", { cart: cart })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    async create_cart(req, res) {

        const { productId, quantity, price, title } = req.body;

        try {
            const productId = req.params.id;
            const userId = req.session.user;
            let cart = await Cart.findOne({ userId: userId });

            if (cart) {
                const product = await Product.findById(productId);
                let itemIndex = cart.products.findIndex(p => p.productId == productId);
                if (itemIndex > -1) {
                    let productItem = cart.products[itemIndex];
                    productItem.quantity = quantity ;
                    productItem.price = quantity * product.price,
                    cart.products[itemIndex] = productItem;
                    cart.subTotal = cart.products.map(item => item.price).reduce((acc, next) => acc + next);
                } else {
                    cart.products.push({
                        productId: productId,
                        quantity: req.body.quantity,
                        price: quantity * product.price,
                        title: product.title,
                    });
                    cart.subTotal = cart.products.map(item => item.price).reduce((acc, next) => acc + next);
                }
                await cart.save();
            } else {
                var totalPrice = 0 ;
                const product = await Product.findById(productId);
                const newCart = await Cart.create({
                    userId: req.session.user,
                    products: [
                        {
                            productId: productId,
                            quantity: req.body.quantity,
                            price: quantity * product.price,
                            title: product.title,
                        },
                    ],
                    subTotal: product.price * quantity
                });
            }
            return res.status(201).redirect("/products")
        } catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    },

 
    /* update product */
    async update_cart(req, res) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true }
            );
            res.status(200).json({
                type: "success",
                message: "Cart updated successfully",
                updatedCart
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* delete cart */
    async delete_cart(req, res) {
        try {
            const productId = req.body.productId;
            const userId = req.session.user;
            const cart = await Cart.findOne({ userId: userId });
            const obj = cart.products;
            let itemIndex = obj.findIndex((p) => p.productId == productId);
            if (itemIndex > -1) {
                cart.products.splice(itemIndex, 1);
                if(cart.products.length > 0)
                cart.subTotal = cart.products.map(item => item.price).reduce((acc, next) => acc + next);
                else
                {
                    cart.subTotal = 0;
                }               
                await cart.save();
            }
            else {
                return res.send(err)
            }
            return res.status(200).redirect("/carts/user");
        } catch (err) {
            res.status(500).send("Something went wrong");
        }
    }
};

// async function productsFromCart(cart) {
//     let products = []; // array of objects
//     for (const item of cart.products) {
//         let foundProduct = (
//             await Product.findById(item.productId).populate("categories")
//         ).toObject();
//         foundProduct["title"] = item.title;
//         foundProduct["qty"] = item.quantity;
//         foundProduct["price"] = item.price;
//         products.push(foundProduct);
//     }
//     return products;
// }

module.exports = CartController;