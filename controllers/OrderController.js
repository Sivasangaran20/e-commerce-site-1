const express = require('express');
const app = express();

const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

app.use(express.json());


const OrderController = {

    /* get all orders (only admin) */
    async get_orders(req, res) {
        try {
            const orders = await Order.find();
            res.status(200).json({
                type: "success",
                orders
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* get monthly income (only admin)*/
    async get_income(req, res) {
        const date = new Date();
        const lastMonth =  new Date(date.setMonth(date.getMonth()-1));
        const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

        try {
            const income = await Order.aggregate([
                { $match: { 
                    createdAt: { 
                            $gte: previousMonth
                        },
                    },
                },
                { 
                    $project:{ 
                        month: { $month: "$createdAt" },
                        sales: "$amount",
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: "$sales" }
                    }
                },  
            ]);
            res.status(200).json({
                type: "success",
                income
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* get user's orders */
    async get_order(req, res) {
        try {
            const cart = await Cart.findOne({ userId: req.session.user });
            if (!cart) {
                res.status(404).json({
                    type: "error",
                    message: "User doesn't exists"
                })
            } else {
                res.status(200).render("order",{cart: cart})
            }
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* add order */
    async create_order (req, res) {
        const userId = req.session.user;
        
        // const user = await User.findById(req.session.userId)
        const { productId,quantity, price, title} = req.body;
        try {
          let order = await Order.findOne({userId:userId});
      
          if (order) {
            const cart = await Cart.findOne({userId});
            let itemIndex = order.products.findIndex(p => p.productId == productId);
          if (itemIndex > -1) {
            let productItem = order.products[itemIndex];
            productItem.quantity =  quantity;
            order.products[itemIndex] = productItem;
            order.subTotal = order.products.map(item => item.price).reduce((acc, next) => acc + next);
          } else {
            const obj = cart.products;
            for(let i=0;i<obj.length;i++){
            order.products.push({ productId: obj[i].productId,
                quantity: obj[i].quantity,
                price: obj[i].price,
                title: obj[i].title 
            });
            order.subTotal = order.products.map(item => item.price).reduce((acc, next) => acc + next);
        }
          }
          order = await order.save();
        } else {
            const cart = await Cart.findOne({userId:userId});
            const obj = cart.products;
            // console.log(obj)
            for(let i=0;i<obj.length;i++){
            // console.log('prodcuts '+obj[i].productId)
            const newOrder = await Order.create({
                
              userId : req.session.user,
              products: [
                { 
                    productId: obj[i].productId,
                    title: obj[i].title,
                    quantity: obj[i].quantity,
                    price: obj[i].price
                    
                },
            ],
                subTotal:cart.subTotal,
                name: req.body.username,
                phoneno:req.body.phoneno,
                address: req.body.address
            });
        }
          }
          return res.status(201).render("checkout")            
        } catch (err) {
          console.log(err);
          res.status(500).send("Something went wrong");
        }
      },


    /* update order */
    async update_order(req, res) {
        try {
            const updatedOrder = await Cart.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true }
            );
            res.status(200).json({
                type: "success",
                message: "Cart updated successfully",
                updatedOrder
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* delete order */
    async delete_order(req, res) {
        try {
            await Order.findOneAndDelete(req.params.id);
            res.status(200).json({
                type: "success",
                message: "Order has been deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    }
};

module.exports = OrderController;