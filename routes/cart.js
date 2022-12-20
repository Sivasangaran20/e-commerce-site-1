const express = require('express');
const router = express.Router();

const { CartController } = require('../controllers');
const { authenticationVerifier, accessLevelVerifier, isAdminVerifier } = require('../middlewares/verifyToken');

router.get('/', isAdminVerifier, CartController.get_carts);
router.get('/user', accessLevelVerifier, CartController.get_cart)
router.post('/add-to-cart/:id', authenticationVerifier, CartController.create_cart);
router.put('/:id', accessLevelVerifier, CartController.update_cart);
router.post('/delete/', accessLevelVerifier, CartController.delete_cart);

module.exports = router;