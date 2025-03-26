# QKart E-commerce Application

A full-stack e-commerce application built with React.js and Node.js.

## Features

- User authentication (Register/Login)
- Product browsing and search
- Shopping cart functionality
- Address management
- Checkout process
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/AyushJHANWAR03/Qkart-Project.git
cd Qkart-Project
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. MongoDB Setup:
```bash
# Start MongoDB service (MacOS)
brew services start mongodb-community

# For Windows, ensure MongoDB service is running
```

4. Start the application:
```bash
# Start backend server (from backend directory)
npm start

# Start frontend (from root directory in a new terminal)
npm start
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8082

## Environment Variables

The necessary environment variables are included in the repository for easy setup:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Backend server port

## API Endpoints

### Auth Routes
- POST /api/v1/auth/register - Register new user
- POST /api/v1/auth/login - Login user

### Product Routes
- GET /api/v1/products - Get all products
- GET /api/v1/products/:productId - Get single product

### Cart Routes
- GET /api/v1/cart - Get user's cart
- POST /api/v1/cart - Add to cart
- DELETE /api/v1/cart - Remove from cart

### User Routes
- GET /api/v1/user/addresses - Get user's addresses
- POST /api/v1/user/addresses - Add new address
- DELETE /api/v1/user/addresses/:id - Delete address

## Tech Stack

- Frontend: React.js, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT 