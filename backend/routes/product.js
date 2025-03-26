const express = require('express');
const router = express.Router();
const { handleError } = require('../utils');
const { products } = require('../db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const allProducts = await products.find({});
        return res.status(200).json(allProducts);
    } catch (error) {
        return handleError(res, error);
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
        return res.status(200).json(product);
    } catch (error) {
        return handleError(res, error);
    }
});

// Search products
router.get('/search', async (req, res) => {
    try {
        const searchValue = req.query.value;
        const searchResults = await products.find({
            $or: [
                { name: { $regex: searchValue, $options: 'i' } },
                { category: { $regex: searchValue, $options: 'i' } }
            ]
        });
        return res.status(200).json(searchResults);
    } catch (error) {
        return handleError(res, error);
    }
});

module.exports = router;
