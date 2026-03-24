// Dummy data for the e-commerce application
export const products = [];

export const categories = [
  { id: 1, name: "Smartphones", slug: "smartphones", count: 5 },
  { id: 2, name: "Laptops", slug: "laptops", count: 4 },
  { id: 3, name: "Headphones", slug: "headphones", count: 4 },
  { id: 4, name: "Tablets", slug: "tablets", count: 4 },
  { id: 5, name: "Accessories", slug: "accessories", count: 5 }
];

export const users = [
  {
    id: 1,
    name: "Jeel Patel",
    email: "jeel@example.com",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    joinDate: "2024-01-15",
    ordersCount: 3,
    totalSpent: 259780,
    status: "active"
  },
  {
    id: 2,
    name: "Amit Kumar",
    email: "amit@example.com",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80",
    joinDate: "2024-01-20",
    ordersCount: 1,
    totalSpent: 29990,
    status: "active"
  },
  {
    id: 3,
    name: "Ayush Electronics",
    email: "seller@ayush.com",
    role: "seller",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    joinDate: "2023-12-01",
    productsCount: 2,
    totalEarnings: 189890,
    status: "active"
  },
  {
    id: 4,
    name: "Patel Gadgets",
    email: "seller@patel.com",
    role: "seller",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    joinDate: "2023-11-15",
    productsCount: 1,
    totalEarnings: 106999,
    status: "active"
  },
  {
    id: 5,
    name: "Admin User",
    email: "admin@logimart.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    joinDate: "2023-01-01",
    status: "active"
  }
];

export const orders = [
  {
    id: "ORD001",
    userId: 1,
    userName: "Jeel Patel",
    userEmail: "jeel@example.com",
    items: [
      { productId: 1, name: "iPhone 15 Pro Max", quantity: 1, price: 159900, sellerId: 1 },
      { productId: 5, name: "Sony WH-1000XM5", quantity: 1, price: 29990, sellerId: 2 }
    ],
    total: 189890,
    status: "delivered",
    date: "2024-01-15",
    shippingAddress: {
      name: "Jeel Patel",
      address: "123 Main St, Mumbai, Maharashtra 400001",
      phone: "+91 9876543210"
    },
    paymentMethod: "card"
  },
  {
    id: "ORD002",
    userId: 2,
    userName: "Amit Kumar",
    userEmail: "amit@example.com",
    items: [
      { productId: 5, name: "Sony WH-1000XM5", quantity: 1, price: 29990, sellerId: 2 }
    ],
    total: 29990,
    status: "shipped",
    date: "2024-01-20",
    shippingAddress: {
      name: "Amit Kumar",
      address: "456 Oak Ave, Delhi, Delhi 110001",
      phone: "+91 9876543211"
    },
    paymentMethod: "upi"
  },
  {
    id: "ORD003",
    userId: 1,
    userName: "Jeel Patel",
    userEmail: "jeel@example.com",
    items: [
      { productId: 3, name: "MacBook Pro 16-inch M3", quantity: 1, price: 249900, sellerId: 1 }
    ],
    total: 249900,
    status: "processing",
    date: "2024-01-25",
    shippingAddress: {
      name: "Jeel Patel",
      address: "123 Main St, Mumbai, Maharashtra 400001",
      phone: "+91 9876543210"
    },
    paymentMethod: "card"
  },
  {
    id: "ORD004",
    userId: 3,
    userName: "Ayush Electronics",
    userEmail: "seller@ayush.com",
    items: [
      { productId: 6, name: "Google Pixel 8 Pro", quantity: 1, price: 106999, sellerId: 4 }
    ],
    total: 106999,
    status: "placed",
    date: "2024-01-28",
    shippingAddress: {
      name: "Ayush Electronics",
      address: "789 Business Park, Bangalore, Karnataka 560001",
      phone: "+91 9876543212"
    },
    paymentMethod: "cod"
  }
];

export const earnings = [
  {
    id: 1,
    sellerId: 1,
    amount: 189890,
    status: "paid",
    date: "2024-01-20",
    orderId: "ORD001"
  },
  {
    id: 2,
    sellerId: 2,
    amount: 29990,
    status: "paid",
    date: "2024-01-25",
    orderId: "ORD002"
  },
  {
    id: 3,
    sellerId: 1,
    amount: 249900,
    status: "pending",
    date: "2024-01-30",
    orderId: "ORD003"
  }
];