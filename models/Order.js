const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
          productId:{ 
            type: String,
            ref: "Cart",
          },
          title: {
            type: String,
          },
          quantity:{
            type: Number,
          },
          price:{
            type: Number,
          } 
        },
      ],
    subTotal:{
        type: Number,
    },
    name:{
        type: String,
        required: true
    },
    phoneno:{
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);