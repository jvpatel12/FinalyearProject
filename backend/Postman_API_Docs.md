# E-Commerce API Documentation for Postman

Base URL: `http://localhost:5000` (or your configured `PORT`)

This document lists all available API endpoints, their HTTP methods, required authentication, and the expected request payload/data.

---

## 1. Authentication & Users (`/api/auth`)

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body** (JSON):
  ```json
  {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "customer" // Optional: 'customer', 'seller', 'admin'
  }
  ```

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body** (JSON):
  ```json
  {
      "email": "john@example.com",
      "password": "password123"
  }
  ```

### Logout User
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes (Cookie/Token)
- **Body**: None

### Get User Profile
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Body**: None

---

## 2. Products (`/api/products`)

### Get All Products (with Pagination & Search)
- **URL**: `/api/products`
- **Method**: `GET`
- **Auth Required**: No
- **Query Params** (Optional):
  - `?keyword=phone` (Search by name)
  - `?pageNumber=1` (Pagination)

### Get Single Product
- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Auth Required**: No

### Create Product
- **URL**: `/api/products`
- **Method**: `POST`
- **Auth Required**: Yes (Seller or Admin)
- **Body** (JSON):
  ```json
  {
      "name": "Sample Product",
      "price": 99.99,
      "originalPrice": 120.00,
      "discount": 20,
      "description": "This is a detailed product description.",
      "images": ["/images/sample1.jpg", "/images/sample2.jpg"],
      "category": "Electronics",
      "stock_quantity": 50
  }
  ```

### Update Product
- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Seller or Admin - must be product owner if seller)
- **Body** (JSON): Same structured fields as Create Product (only include fields you want to update).

### Delete Product
- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Seller or Admin)
- **Body**: None

---

## 3. Cart (`/api/cart`)

### Get User Cart
- **URL**: `/api/cart`
- **Method**: `GET`
- **Auth Required**: Yes
- **Body**: None

### Add Item to Cart
- **URL**: `/api/cart`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body** (JSON):
  ```json
  {
      "productId": "651a2b3c4d5e6f7g8h9i0j1k",
      "quantity": 2
  }
  ```

### Remove Item from Cart
- **URL**: `/api/cart/:productId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Body**: None

### Clear Cart
- **URL**: `/api/cart`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Body**: None

---

## 4. Orders (`/api/orders`)

### Create New Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Auth Required**: Yes
- **Note**: The API automatically calculates prices based on the user's cart in the database.
- **Body** (JSON):
  ```json
  {
      "shippingAddress": {
          "address": "123 Main St",
          "city": "Metropolis",
          "postalCode": "12345",
          "country": "USA"
      },
      "paymentMethod": "PayPal"
  }
  ```

### Get User's Orders
- **URL**: `/api/orders/myorders`
- **Method**: `GET`
- **Auth Required**: Yes

### Get Order by ID
- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Auth Required**: Yes

### Update Order to Paid
- **URL**: `/api/orders/:id/pay`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Body** (JSON - typically details coming from PayPal/Stripe response):
  ```json
  {
      "id": "PAYPAL_TRANSACTION_ID",
      "status": "COMPLETED",
      "update_time": "2023-10-01T12:00:00Z",
      "email_address": "buyer@example.com"
  }
  ```

### Update Order to Delivered
- **URL**: `/api/orders/:id/deliver`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin only)
- **Body**: None

---

## 5. Admin Dashboard (`/api/admin`)

*Note: All endpoints below require a valid Token from an Admin user.*

### Get All Users
- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

### Delete User
- **URL**: `/api/admin/user/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)

### Update User Role
- **URL**: `/api/admin/user/:id/role`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin)
- **Body** (JSON):
  ```json
  {
      "role": "admin" // 'customer', 'seller', 'admin'
  }
  ```

### Update User Status (Block/Unblock)
- **URL**: `/api/admin/user/:id/status`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin)
- **Body** (JSON):
  ```json
  {
      "status": "active" // e.g., 'active', 'blocked'
  }
  ```

### Get All Orders
- **URL**: `/api/admin/orders`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

### Get Dashboard Stats
- **URL**: `/api/admin/stats`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)
- **Returns**: User count, Product count, Order count, and Total Revenue.
