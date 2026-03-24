# Complete Backend Architecture & API Integration Guide (Node.js + Express + MongoDB)

## 1. Folder Structure (MVC Pattern)
```text
backend/
├── config/
│   ├── db.js            # MongoDB Connection (Mongoose)
│   └── payment.js       # Stripe/Razorpay config
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── adminController.js
│   └── sampleControllers.js # Provided Sample Code
├── middleware/
│   ├── authMiddleware.js # JWT verification
│   ├── roleMiddleware.js # Admin/Seller authorization
│   ├── errorMiddleware.js# Global error handling
│   └── validation.js    # Express-validator schemas
├── models/              # Mongoose Schemas (Relational mapping via References)
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Review.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── generateToken.js # JWT generation
│   └── hashPassword.js  # bcrypt utils
├── server.js            # Entry point
└── .env                 # Environment variables
```

## 2. Database Schema (MongoDB / Mongoose - Relational Design)

### Core Collections Setup
Using MongoDB `$lookup` (Populate in Mongoose) to simulate relational mapping, ensuring proper normalization while maintaining NoSQL flexibility.

1. **User Schema (`users` collection)**
   - `_id` (ObjectId)
   - `name` (String)
   - `email` (String, Unique)
   - `password` (String, Hashed)
   - `role` (Enum: 'customer', 'seller', 'admin') DEFAULT 'customer'
   - `cart` (Array of nested objects: `[{ product: ObjectId(ref:Product), quantity: Number }]`)
   - `wishlist` (Array of ObjectId(ref:Product))
   - `createdAt` / `updatedAt` (Timestamps)

2. **Product Schema (`products` collection)**
   - `_id` (ObjectId)
   - `seller` (ObjectId, ref: 'User') - *Relational Link*
   - `name` (String)
   - `description` (String)
   - `price` (Number)
   - `stock_quantity` (Number)
   - `category` (String)
   - `images` (Array of Strings/URLs)
   - `reviews` (Array of ObjectId, ref: 'Review')
   - `averageRating` (Number)

3. **Order Schema (`orders` collection)**
   - `_id` (ObjectId)
   - `user` (ObjectId, ref: 'User') - *Relational Link*
   - `orderItems` (Array: `[{ product: ObjectId(ref:Product), quantity: Number, price: Number }]`) - *Snapshot of prices at purchase time*
   - `totalPrice` (Number)
   - `shippingAddress` (Object)
   - `paymentStatus` (Enum: 'pending', 'completed', 'failed')
   - `orderStatus` (Enum: 'processing', 'shipped', 'delivered', 'cancelled')
   - `paymentResult` (Object containing Gateway specific IDs)

4. **Review Schema (`reviews` collection)**
   - `_id` (ObjectId)
   - `product` (ObjectId, ref: 'Product') - *Relational Link*
   - `user` (ObjectId, ref: 'User') - *Relational Link*
   - `rating` (Number 1-5)
   - `comment` (String)

### ER Diagram Logic (Mongoose `ref`)
- A **User** has an embedded **Cart** and **Wishlist** Arrays pointing to Products (1:N embedded references).
- A **User** (Seller) creates MANY **Products** (`Product.seller` points to `User._id`). (1:N)
- A **User** has MANY **Orders** (`Order.user` points to `User._id`). (1:N)
- An **Order** has MANY **OrderItems** (Embedded directly into the Order document to prevent price changes affecting past orders).
- A **Product** has MANY **Reviews** (`Review.product` points to `Product._id`). (1:N)

---

## 3. Authentication Flow (JWT)

1. **User Login**: User submits email/password.
2. **Server Validation**: Controller uses `user.matchPassword()` (bcrypt).
3. **Token Generation**: Generates an Access Token (e.g., 15m) and Refresh Token (e.g., 7d).
4. **Token Storage**:
   - Access Token sent in JSON response (frontend stores in memory or variable).
   - Refresh Token sent as an HTTP-Only Secure Cookie `res.cookie('jwt', ...)`.
5. **Protected Access**: Frontend attaches Access Token to `Authorization: Bearer <token>` header.

---

## 4. REST API List (Method + Route + Description)

### AUTH
- `POST   /api/auth/register` : Register user
- `POST   /api/auth/login` : Login user & return tokens
- `GET    /api/auth/profile` : Get logged-in user profile (Protected)
- `PUT    /api/auth/profile/:id` : Update user details (Protected)

### PRODUCT
- `GET    /api/products` : Get all products (With Pagination & Search Queries)
- `GET    /api/products/:id` : Get single product
- `POST   /api/products` : Create product (Protected: Seller)
- `PUT    /api/products/:id` : Update product (Protected: Seller)
- `DELETE /api/products/:id` : Delete product (Protected: Seller/Admin)

### CART
- `GET    /api/cart` : Get user's cart (via User Schema reference mapping) (Protected)
- `POST   /api/cart` : Add item to embedded cart (Protected)
- `DELETE /api/cart/:productId` : Remove item from embedded cart (Protected)

### ORDER
- `POST   /api/orders` : Place new order & start payment logic (Protected)
- `GET    /api/orders` : Get logged-in user's orders (Protected)
- `GET    /api/orders/seller` : Get all orders corresponding to Seller's products (Protected: Seller)
- `GET    /api/orders/:id` : Get specific order details (Protected)

### ADMIN 
- `GET    /api/admin/users` : Get all users (Protected: Admin)
- `DELETE /api/admin/user/:id` : Delete a user (Protected: Admin)
- `GET    /api/admin/orders` : Get all site-wide orders (Protected: Admin)

---

## 5. Security & Error Handling Strategy
- **Validation**: Use `express-validator` to validate incoming requests.
- **Mongoose Validation**: Strict Schema validations (e.g., `maxLength`, matching regex for emails).
- **Helmet**: Set secure HTTP headers against XSS.
- **CORS**: Strictly whitelist frontend origin (`http://localhost:5173`) with `credentials: true`.
- **AsyncHandler Middleware**: Wrapping controllers to catch unhandled Promise rejections and funnel them to the global Express error middleware without needing `try/catch` everywhere.

---

## 6. Payment Integration Structure (Stripe/Razorpay Mock)
1. **Initiate Payment**: When `POST /api/orders` runs, Backend calculates the strict total cost using DB prices (Not trusting the frontend payload).
2. **Create Intent**: Backend hits the Stripe/Razorpay API to generate a `Payment Intent ID` or `Order ID`.
3. **Frontend Confirmation**: Returns the intent key to the React frontend. React handles the CC securely.
4. **Webhook**: Gateway sends a webhook on success to `/api/orders/webhook`. Backend updates `paymentStatus` to 'completed'.

---

## 7. Frontend Integration Strategy (React + Axios)

### Axios Setup
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true // Mandatory for Refresh Tokens in HTTP-Only Cookies
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Inject JWT into every protected request
    }
    return config;
});
```

### Request-Response Lifecycle Example (Placing an Order)
1. **Frontend**: User clicks "Place Order".
2. **Axios Call**: `api.post('/orders', { shippingAddress })`. Header includes `Bearer <Token>`.
3. **Backend Middleware**:
   - `authMiddleware` intercepts.
   - Decodes JWT. Finds User ID.
   - Attaches `req.user = await User.findById(decoded.id)`.
4. **Controller Logic (`placeOrder`)**:
   - Fetches the user's `cart` from `req.user`.
   - Populates product details to get *current* prices from the DB.
   - Calculates total price cleanly.
   - Creates a new `Order` document.
   - Clears the user's embedded `cart` array.
   - Sends success response `res.status(201).json({ order })`.
5. **Frontend Reaction**: Axios Promise resolves. User is redirected to `/orders`.
