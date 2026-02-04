# Three-Panel E-Commerce System - Complete Guide

## 🎯 Overview

This is a complete React.js e-commerce website with **THREE SEPARATE PANELS**:
1. **Customer Panel** - Shopping experience
2. **Admin Panel** - Full system management
3. **Seller Panel** - Vendor product and order management

All panels use **dummy/static data only** - no backend, no API calls, no authentication server.

---

## 🔐 Authentication & Login

### Login Credentials

The system uses a **single login page** (`/login`) that redirects users based on their role:

#### Customer Accounts
- **Email:** `customer@example.com`
- **Password:** `customer123`
- **Redirects to:** `/` (Home page)

- **Email:** `jane@example.com`
- **Password:** `customer123`
- **Redirects to:** `/` (Home page)

#### Admin Account
- **Email:** `admin@logimart.com`
- **Password:** `admin123`
- **Redirects to:** `/admin` (Admin Dashboard)

#### Seller Accounts
- **Email:** `seller@techstore.com`
- **Password:** `seller123`
- **Redirects to:** `/seller` (Seller Dashboard)
- **Seller ID:** 1

- **Email:** `seller@gadgethub.com`
- **Password:** `seller123`
- **Redirects to:** `/seller` (Seller Dashboard)
- **Seller ID:** 2

- **Email:** `seller@dell.com`
- **Password:** `seller123`
- **Redirects to:** `/seller` (Seller Dashboard)
- **Seller ID:** 3

- **Email:** `seller@google.com`
- **Password:** `seller123`
- **Redirects to:** `/seller` (Seller Dashboard)
- **Seller ID:** 4

### How Authentication Works

1. **Login Page** (`/login`):
   - Validates email and password against `src/data/users.js`
   - Uses `AuthContext` for state management
   - Redirects based on user role after successful login

2. **Route Protection**:
   - `ProtectedRoute` component protects routes based on authentication
   - Admin routes require `role: 'admin'`
   - Seller routes require `role: 'seller'`
   - Customer routes require any authenticated user

3. **AuthContext** (`src/context/AuthContext.jsx`):
   - Manages user authentication state
   - Provides `login()`, `logout()`, `isAuthenticated()`, `hasRole()` methods
   - Stores user data in localStorage

---

## 📁 Project Structure

```
src/
├── auth/                    # (Not used - auth logic in context/)
├── components/              # Shared components
│   ├── Navbar.jsx          # Main navigation with cart icon
│   ├── ProductCard.jsx     # Product display card
│   ├── ProtectedRoute.jsx  # Route protection component
│   └── ...
├── context/                 # Context API providers
│   └── AuthContext.jsx     # Authentication context
├── data/                   # Static dummy data
│   ├── dummyData.js        # Products, orders, categories, users
│   └── users.js            # Login credentials
├── hooks/                  # Custom hooks
│   ├── CartProvider.jsx    # Cart context provider
│   └── useCart.jsx         # Cart hook
├── layouts/                # Layout components
│   ├── AdminLayout.jsx     # Admin panel layout with sidebar
│   └── SellerLayout.jsx    # Seller panel layout with sidebar
├── Pages/                  # Page components
│   ├── Admin/              # Admin panel pages
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminCategories.jsx
│   │   ├── AdminUsers.jsx
│   │   └── AdminOrders.jsx
│   ├── Seller/             # Seller panel pages
│   │   ├── SellerDashboard.jsx
│   │   ├── SellerProducts.jsx
│   │   ├── AddProduct.jsx
│   │   ├── SellerOrders.jsx
│   │   └── SellerEarnings.jsx
│   ├── LoginPage.jsx       # Single login page for all roles
│   ├── Home.jsx            # Customer home page
│   ├── Shop.jsx            # Product listing
│   ├── ProductDetailPage.jsx
│   ├── ShoppingCartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── Orders.jsx          # Customer orders
│   └── UserProfilePage.jsx
└── App.jsx                 # Main app with routing
```

---

## 🛍️ Customer Panel (Route: `/`)

### Pages:
- **Home** (`/`) - Landing page with featured products
- **Shop** (`/shop`) - Product listing with search
- **Product Details** (`/product/:id`) - Individual product view
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Order placement (protected)
- **Orders** (`/orders`) - Order history (protected)
- **Profile** (`/profile`) - User profile (protected)

### Features:
- ✅ Navbar with logo, search, cart icon with item count
- ✅ Product grid with images, prices, discounts
- ✅ Add to cart functionality
- ✅ Cart management (add/remove, quantity increase/decrease)
- ✅ Checkout form (name, address, phone)
- ✅ Order history with status badges
- ✅ User profile page

---

## 👨‍💼 Admin Panel (Route: `/admin/*`)

### Pages:
- **Dashboard** (`/admin`) - Overview with stats
- **Products** (`/admin/products`) - All products management
- **Categories** (`/admin/categories`) - Category management
- **Users** (`/admin/users`) - User management
- **Orders** (`/admin/orders`) - All orders management

### Features:
- ✅ Sidebar navigation
- ✅ Dashboard cards: Total Sales, Orders, Users, Products
- ✅ Products table with edit/delete actions
- ✅ Users table with role badges
- ✅ Orders table with status management
- ✅ All data from `dummyData.js`

### Access:
- Requires `role: 'admin'`
- Login with: `admin@logimart.com` / `admin123`

---

## 🏪 Seller Panel (Route: `/seller/*`)

### Pages:
- **Dashboard** (`/seller`) - Seller overview
- **My Products** (`/seller/products`) - Seller's products only
- **Add Product** (`/seller/add-product`) - Add new product
- **Edit Product** (`/seller/edit-product/:id`) - Edit product
- **Orders** (`/seller/orders`) - Orders containing seller's products
- **Earnings** (`/seller/earnings`) - Earnings and payouts

### Features:
- ✅ Sidebar navigation
- ✅ Products filtered by `sellerId` from logged-in user
- ✅ Orders filtered to show only orders with seller's products
- ✅ Earnings dashboard with payout information
- ✅ Add/Edit product forms (UI only)

### Access:
- Requires `role: 'seller'`
- Login with any seller email (see credentials above)
- Products and orders automatically filtered by `sellerId`

---

## 🔧 Key Implementation Details

### Authentication Flow:
1. User enters credentials on `/login`
2. `AuthContext.login()` validates against `users.js`
3. User data stored in localStorage and context state
4. Redirect based on role:
   - `customer` → `/`
   - `admin` → `/admin`
   - `seller` → `/seller`

### Route Protection:
```jsx
<ProtectedRoute requiredRole="admin">
  <AdminLayout />
</ProtectedRoute>
```

### Data Filtering:
- **Customer Orders**: Filtered by `userId` from `AuthContext`
- **Seller Products**: Filtered by `sellerId` from `AuthContext`
- **Seller Orders**: Filtered to show orders containing seller's products

### Cart Management:
- Uses `CartContext` for state management
- Persisted in localStorage
- Cart icon shows item count in navbar

---

## 🚀 Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Open `http://localhost:5173` (or port shown in terminal)
   - Click "Login" in navbar
   - Use credentials from above
   - System will redirect based on role

---

## 📝 Important Notes

1. **No Backend**: All data is static JSON in `src/data/dummyData.js` and `src/data/users.js`
2. **No API Calls**: Everything works with local state and localStorage
3. **Dummy Authentication**: Login just validates against static user list
4. **Local State Only**: Product edits, order status changes are local only (not persisted)
5. **Image URLs**: Products use Unsplash placeholder images

---

## 🎨 UI/UX Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tailwind CSS for styling
- ✅ Clean, modern interface
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Status badges with colors
- ✅ Search functionality
- ✅ Filter and sort options

---

## 🔄 Data Flow

### Customer Flow:
1. Browse products → Add to cart → Checkout → Place order → View orders

### Admin Flow:
1. Login → Dashboard → Manage products/users/orders

### Seller Flow:
1. Login → Dashboard → Manage products → View orders → Check earnings

---

## 📦 Dependencies

- `react` - UI library
- `react-router-dom` - Routing
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `react-icons` - Additional icons

---

## ✨ Features Summary

✅ Three separate panels (Customer, Admin, Seller)
✅ Role-based authentication and routing
✅ Protected routes
✅ Cart management with Context API
✅ Product listing and details
✅ Order management
✅ User profile pages
✅ Responsive design
✅ Clean, modular code structure
✅ Beginner-friendly with comments

---

## 🐛 Testing the System

1. **Test Customer Panel:**
   - Login: `customer@example.com` / `customer123`
   - Browse products, add to cart, checkout

2. **Test Admin Panel:**
   - Login: `admin@logimart.com` / `admin123`
   - View dashboard, manage products/users/orders

3. **Test Seller Panel:**
   - Login: `seller@techstore.com` / `seller123`
   - View only products with `sellerId: 1`
   - View orders containing those products

---

## 📚 File Locations

- **Login Credentials**: `src/data/users.js`
- **Product/Order Data**: `src/data/dummyData.js`
- **Auth Context**: `src/context/AuthContext.jsx`
- **Cart Context**: `src/hooks/CartProvider.jsx`
- **Route Protection**: `src/components/ProtectedRoute.jsx`
- **Main Routing**: `src/App.jsx`

---

**System is fully functional and ready to use!** 🎉
