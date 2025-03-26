const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const { handleError } = require('../utils');
const { users } = require('../db');
const config = require('../config.json');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        const existingUser = await users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username already exists' 
            });
        }

        // Create new user
        const user = new users({
            username,
            password, // In production, hash this password
            balance: 5000,
            cart: [],
            addresses: []
        });

        await user.save();
        
        // Generate token after registration
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username 
            }, 
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            success: true,
            token,
            username: user.username,
            balance: user.balance
        });
    } catch (error) {
        return handleError(res, error);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await users.findOne({ username });
        if (!user || user.password !== password) { // In production, use proper password comparison
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username 
            }, 
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true,
            token,
            username: user.username,
            balance: user.balance
        });
    } catch (error) {
        return handleError(res, error);
    }
});

module.exports = router;
