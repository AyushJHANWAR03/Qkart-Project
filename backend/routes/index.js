const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const productRouter = require('./product');
const cartRouter = require('./cart');
const userRouter = require('./user');

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/cart', cartRouter);
router.use('/user', userRouter);

module.exports = router; 