const express = require('express');
const router = express.Router();
const { nanoid } = require("nanoid");
const { handleError, verifyAuth } = require("../utils");
const { users } = require("../db");

// Mock user data (replace with MongoDB models later)
const mockUsers = [];

router.get('/:id', (req, res) => {
    const user = mockUsers.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

router.put('/:id', (req, res) => {
    const userIndex = mockUsers.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...req.body };
    res.json(mockUsers[userIndex]);
});

// Get user addresses
router.get("/addresses", verifyAuth, async (req, res) => {
    try {
        // Refresh user data to get latest addresses
        const user = await users.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Initialize addresses array if it doesn't exist
        if (!Array.isArray(user.addresses)) {
            user.addresses = [];
            await user.save();
        }
        
        return res.status(200).json({
            success: true,
            addresses: user.addresses || []
        });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return handleError(res, error);
    }
});

// Add new address
router.post("/addresses", verifyAuth, async (req, res) => {
    try {
        const { address } = req.body;

        // Validate address
        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address is required"
            });
        }

        if (address.length < 20) {
            return res.status(400).json({
                success: false,
                message: "Address should be greater than 20 characters"
            });
        }

        if (address.length > 128) {
            return res.status(400).json({
                success: false,
                message: "Address should be less than 128 characters"
            });
        }

        // Get fresh user data
        const user = await users.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Initialize addresses array if it doesn't exist
        if (!Array.isArray(user.addresses)) {
            user.addresses = [];
        }

        // Create new address
        const newAddress = {
            _id: nanoid(),
            address: address
        };

        // Add address and save
        user.addresses.push(newAddress);
        await user.save();

        console.log(`Address "${address}" added to user ${user.username}'s address list`);
        return res.status(200).json({
            success: true,
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Error adding address:", error);
        return handleError(res, error);
    }
});

// Delete address
router.delete("/addresses/:id", verifyAuth, async (req, res) => {
    try {
        // Get fresh user data
        const user = await users.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Ensure addresses array exists
        if (!Array.isArray(user.addresses)) {
            return res.status(404).json({
                success: false,
                message: "No addresses found"
            });
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id === req.params.id);
        if (addressIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Address to delete was not found"
            });
        }

        // Remove address and save
        user.addresses.splice(addressIndex, 1);
        await user.save();

        console.log(`Address with id ${req.params.id} deleted from user ${user.username}'s address list`);
        return res.status(200).json({
            success: true,
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Error deleting address:", error);
        return handleError(res, error);
    }
});

module.exports = router;
