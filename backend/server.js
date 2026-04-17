const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const bulkProductRoutes = require('./routes/bulkProductRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');
const addressRoutes = require('./routes/addressRoutes');

// Load env vars
const envPath = path.join(__dirname, '.env');
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
    console.error('Error loading .env file from:', envPath, envResult.error);
} else {
    console.log('.env file loaded successfully from:', envPath);
    console.log('RAZORPAY_KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID);
}

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

// Make io accessible in controllers
app.set('io', io);

io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Clients can join rooms based on their user ID or role
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// CORS configuration - MUST allow credentials and specific origin for HttpOnly Cookies
app.use(cors({
    origin: 'http://localhost:5173', // Vite default Frontend URL
    credentials: true
}));

// Serve images from the root image directory
app.use('/images', express.static(path.join(__dirname, '../image')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/bulk', bulkProductRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/addresses', addressRoutes);

// Custom Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
