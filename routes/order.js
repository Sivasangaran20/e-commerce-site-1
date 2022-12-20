const express = require('express');
const router = express.Router();
const path = require('path')

const { OrderController } = require('../controllers');
const { authenticationVerifier, accessLevelVerifier, isAdminVerifier } = require('../middlewares/verifyToken');
const Product = require('../models/Product');

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

router.get("/checkout/<%=product._id%>",(req,res)=>{
    const product = Product.findById(req.params.id)
    res.render("order",{cart: product})
});

router.get('/all', isAdminVerifier, OrderController.get_orders);
router.get('/income', isAdminVerifier, OrderController.get_income);
router.get('/user', accessLevelVerifier, OrderController.get_order);
router.post('/checkout', authenticationVerifier, OrderController.create_order);
router.put('/:id', isAdminVerifier, OrderController.update_order);
router.delete('/:id', isAdminVerifier, OrderController.delete_order);

module.exports = router;