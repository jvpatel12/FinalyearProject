# Data Dictionary

This document provides a detailed description of the data models used in the E-Commerce platform.

## 1. User Model
Stores information about customers, sellers, and administrators.

| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for the user. | Auto-generated |
| `name` | String | Full name of the user. | Required |
| `email` | String | Email address used for login and notifications. | Required, Unique, Email Regex |
| `password` | String | Hashed password for authentication. | Required, Min length: 6 |
| `role` | String | Role of the user in the system. | Enum: `customer`, `seller`, `admin`; Default: `customer` |
| `status` | String | Account status (e.g., active, suspended). | Enum: `active`, `pending`, `suspended`; Default: `active` |
| `avatar` | String | URL to the user's profile picture. | Optional |
| `wishlist` | [ObjectId] | List of products saved by the user. | Reference: `Product` |
| `cart` | [Object] | Items currently in the user's shopping cart. | See Cart Item structure below |
| `sellerProfile` | Object | Additional details for users with the `seller` role. | See Seller Profile structure below |
| `address` | Object | Default shipping address of the user. | See Address structure below |
| `createdAt` | Date | Timestamp when the user account was created. | Auto-generated |
| `updatedAt` | Date | Timestamp when the user account was last updated. | Auto-generated |

### 1.1 Cart Item Structure
| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `product` | ObjectId | Reference to the product in the cart. | Required, Reference: `Product` |
| `quantity` | Number | Quantity of the product. | Required, Default: 1 |
| `price` | Number | Snapshot of the product price at the time of adding. | Required |

### 1.2 Seller Profile Structure
| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `storeName` | String | Name of the seller's store. | Optional |
| `storeDescription`| String | Brief description of the store. | Optional |
| `bankDetails` | Object | Bank information for payouts. | `accountNumber`, `bankName` (All Optional) |

### 1.3 Address Structure
| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `street` | String | Street address. | Optional |
| `city` | String | City. | Optional |
| `state` | String | State or province. | Optional |
| `zipCode` | String | Postal or zip code. | Optional |
| `country` | String | Country. | Optional |

---

## 2. Product Model
Stores details about the items available for sale.

| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for the product. | Auto-generated |
| `seller` | ObjectId | Reference to the user who listed the product. | Required, Reference: `User` |
| `name` | String | Name of the product. | Required, Trimmed |
| `description` | String | Detailed product description. | Required |
| `price` | Number | Current selling price. | Required, Default: 0 |
| `originalPrice` | Number | Price before any discounts. | Default: 0 |
| `discount` | Number | Discount percentage or amount. | Default: 0 |
| `stock_quantity`| Number | Number of items available in stock. | Required, Default: 0 |
| `category` | String | Product classification category. | Required, Enum (see below) |
| `images` | [String] | Array of URLs to product images. | Required (At least one) |
| `averageRating` | Number | Calculated average of all review ratings. | Default: 0 |
| `numReviews` | Number | Total number of reviews for the product. | Default: 0 |
| `createdAt` | Date | Timestamp when the product was listed. | Auto-generated |
| `updatedAt` | Date | Timestamp when the product was last updated. | Auto-generated |

**Category Enums:** `Electronics`, `Clothing`, `Sports`, `Smartphones`, `Laptops`, `Headphones`, `Tablets`, `Accessories`, `Cameras`, `Gaming`, `Wearables`, `Other`.

---

## 3. Order Model
Stores records of customer purchases.

| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for the order. | Auto-generated |
| `user` | ObjectId | Reference to the user who placed the order. | Required, Reference: `User` |
| `orderItems` | [Object] | List of products in the order. | See Order Item structure below |
| `shippingAddress`| Object | Address where the order should be delivered. | Required, See Order Address below |
| `paymentMethod` | String | Method used for payment. | Required, Default: `Stripe` |
| `paymentResult` | Object | Data returned from the payment gateway. | `id`, `status`, `update_time`, `email_address` |
| `itemsPrice` | Number | Total price of all items in the order. | Required, Default: 0.0 |
| `taxPrice` | Number | Total tax amount applied to the order. | Required, Default: 0.0 |
| `shippingPrice` | Number | Cost of shipping the order. | Required, Default: 0.0 |
| `totalPrice` | Number | Final total price (Items + Tax + Shipping). | Required, Default: 0.0 |
| `isPaid` | Boolean | Whether the order has been paid for. | Required, Default: false |
| `paidAt` | Date | Timestamp when the payment was completed. | Optional |
| `status` | String | Current status of the order lifecycle. | Enum: `Pending`, `Confirmed`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`; Default: `Pending` |
| `deliveredAt` | Date | Timestamp when the order was delivered. | Optional |
| `createdAt` | Date | Timestamp when the order was placed. | Auto-generated |
| `updatedAt` | Date | Timestamp when the order was last updated. | Auto-generated |

### 3.1 Order Item Structure
| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `product` | ObjectId | Reference to the purchased product. | Required, Reference: `Product` |
| `name` | String | Name of the product at the time of purchase. | Required |
| `qty` | Number | Quantity purchased. | Required |
| `image` | String | Link to the product image. | Required |
| `price` | Number | Price of a single unit at time of purchase. | Required |

### 3.2 Order Address Structure
| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `address` | String | Street address. | Required |
| `city` | String | City. | Required |
| `postalCode` | String | Postal or zip code. | Required |
| `country` | String | Country. | Required |

---

## 4. Review Model
Stores customer feedback and ratings for products.

| Field Name | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for the review. | Auto-generated |
| `user` | ObjectId | Reference to the user who wrote the review. | Required, Reference: `User` |
| `product` | ObjectId | Reference to the product being reviewed. | Required, Reference: `Product` |
| `rating` | Number | Numeric rating given by the user. | Required, Range: 1-5 |
| `name` | String | Name of the reviewer. | Required |
| `comment` | String | Descriptive text feedback. | Required |
| `reply` | String | Optional response from the seller or admin. | Optional |
| `createdAt` | Date | Timestamp when the review was submitted. | Auto-generated |
| `updatedAt` | Date | Timestamp when the review was last updated. | Auto-generated |

---

## Model Relationships

- **User ↔ Product**: A User (Seller) can own many Products.
- **User ↔ Order**: A User (Customer) can place many Orders.
- **User ↔ Review**: A User (Customer) can write many Reviews.
- **Product ↔ Review**: A Product can have many Reviews.
- **Product ↔ Order**: An Order contains many Products (via `orderItems`).
