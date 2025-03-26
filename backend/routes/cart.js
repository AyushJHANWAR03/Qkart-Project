const express = require('express');
const router = express.Router();
const { handleError, verifyAuth, getProduct } = require("../utils");
const { users, products } = require("../db");

// Mock cart data (replace with MongoDB models later)
const carts = new Map();

// Get cart items
router.get('/', verifyAuth, (req, res) => {
    console.log(`GET request to "/cart" received`);
    return res.status(200).json(req.user.cart);
});

// Add/Update/Remove items from cart
router.post('/', verifyAuth, async (req, res) => {
    console.log(`POST request to "/cart" received`);
    
    try {
        const product = await getProduct(req.body.productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product doesn't exist" 
            });
        }

        const user = await users.findById(req.user._id);
        const index = user.cart.findIndex(
            (element) => element.productId === req.body.productId
        );

        if (index === -1) {
            // Add new item
            user.cart.push({
                productId: req.body.productId,
                qty: req.body.qty,
            });
        } else if (req.body.qty === 0) {
            // Remove item
            user.cart.splice(index, 1);
        } else {
            // Update quantity
            user.cart[index].qty = req.body.qty;
        }

        await users.findByIdAndUpdate(
            req.user._id,
            { $set: { cart: user.cart } }
        );

        console.log(`User ${user.username}'s cart updated to`, user.cart);
        return res.status(200).json(user.cart);
    } catch (error) {
        return handleError(res, error);
    }
});

// Checkout
router.post('/checkout', verifyAuth, async (req, res) => {
    console.log(`POST request received to "/cart/checkout": ${req.user.username}`);

    try {
        let total = 0;
        for (let element of req.user.cart) {
            const product = await getProduct(element.productId);
            if (!product) {
                throw new Error("Invalid product in cart.");
            }
            total += element.qty * product.cost;
        }

        if (total === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        if (req.user.balance < total) {
            return res.status(400).json({
                success: false,
                message: "Wallet balance not sufficient to place order",
            });
        }

        if (!req.body.addressId) {
            return res.status(400).json({
                success: false,
                message: "Address not set",
            });
        }

        const addressIndex = req.user.addresses.findIndex(
            (element) => element._id === req.body.addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: "Bad address specified" 
            });
        }

        // Update user balance and clear cart
        await users.findByIdAndUpdate(
            req.user._id,
            { 
                $set: { 
                    balance: req.user.balance - total,
                    cart: [] 
                } 
            }
        );

        console.log("Order placed successfully");
        console.log("Total cost:", total);
        console.log("Address:", req.user.addresses[addressIndex]);

        return res.status(200).json({
            success: true,
            message: "Order placed successfully"
        });
    } catch (error) {
        return handleError(res, error);
    }
});

module.exports = router;