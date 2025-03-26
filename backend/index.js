const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

// Connect to MongoDB
db.connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', require('./routes'));

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

