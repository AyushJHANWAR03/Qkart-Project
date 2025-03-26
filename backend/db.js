const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);
        
        // Use the MongoDB connection string with the correct dbpath
        const mongoURI = 'mongodb://127.0.0.1:27017/qkart?authSource=admin';
        
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            family: 4 // Use IPv4, skip trying IPv6
        });
        console.log('Connected to MongoDB successfully');

        // Add sample products if none exist
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            await Product.insertMany([
                {
                    name: "OnePlus 6",
                    category: "Phones",
                    cost: 100,
                    rating: 5,
                    image: "https://i.imgur.com/lulqWzW.jpg"
                },
                {
                    name: "Toothbrush",
                    category: "Health",
                    cost: 100,
                    rating: 5,
                    image: "https://i.imgur.com/PtEGzdG.jpg"
                },
                {
                    name: "Toothpaste",
                    category: "Health",
                    cost: 100,
                    rating: 4,
                    image: "https://i.imgur.com/x2Lm7AR.jpg"
                }
            ]);
            console.log('Sample products added');
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Define schemas
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 5000 },
    cart: [{ productId: String, qty: Number }],
    addresses: [{ _id: String, address: String }]
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    cost: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    image: { type: String, required: true }
});

// Create models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

module.exports = {
    connectDB,
    users: User,
    products: Product
};