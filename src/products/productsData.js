// Dummy data for the e-commerce application
export const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    description: "The most advanced iPhone with Pro camera system and titanium design",
    price: 159900,
    originalPrice: 169900,
    discount: 6,
    category: "smartphones",
    brand: "Apple",
    stock: 25,
    image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&q=80",
    rating: 4.8,
    reviews: 1247,
    sellerId: 1,
    status: "active",
    features: ["5G", "Face ID", "Wireless Charging", "Titanium Design"]
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen and exceptional camera",
    price: 129999,
    originalPrice: 139999,
    discount: 7,
    category: "smartphones",
    brand: "Samsung",
    stock: 15,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
    rating: 4.6,
    reviews: 892,
    sellerId: 2,
    status: "active",
    features: ["5G", "S Pen", "120Hz Display", "AI Features"]
  },
  {
    id: 3,
    name: "MacBook Pro 16-inch M3",
    description: "Powerful laptop with M3 chip and stunning Liquid Retina XDR display",
    price: 249900,
    originalPrice: 269900,
    discount: 7,
    category: "laptops",
    brand: "Apple",
    stock: 0,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    rating: 4.9,
    reviews: 423,
    sellerId: 1,
    status: "out_of_stock",
    features: ["M3 Chip", "16-inch Display", "18GB RAM", "1TB SSD"]
  },
  {
    id: 4,
    name: "Dell XPS 13 Plus",
    description: "Ultra-portable laptop with stunning OLED display and Intel i7",
    price: 149900,
    originalPrice: 159900,
    discount: 6,
    category: "laptops",
    brand: "Dell",
    stock: 12,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80",
    rating: 4.3,
    reviews: 234,
    sellerId: 3,
    status: "active",
    features: ["Intel i7", "13.4-inch OLED", "16GB RAM", "512GB SSD"]
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancelling wireless headphones",
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    category: "headphones",
    brand: "Sony",
    stock: 30,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    rating: 4.7,
    reviews: 1567,
    sellerId: 2,
    status: "active",
    features: ["Noise Cancelling", "30hr Battery", "Wireless", "Hi-Res Audio"]
  },
  {
    id: 6,
    name: "Google Pixel 8 Pro",
    description: "AI-powered smartphone with exceptional camera and 7 years updates",
    price: 106999,
    originalPrice: 116999,
    discount: 8,
    category: "smartphones",
    brand: "Google",
    stock: 18,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    rating: 4.4,
    reviews: 567,
    sellerId: 4,
    status: "active",
    features: ["5G", "AI Features", "7 Years Updates", "Magic Eraser"]
  }
];

export const categories = [
  { id: 1, name: "Smartphones", slug: "smartphones", count: 3 },
  { id: 2, name: "Laptops", slug: "laptops", count: 2 },
  { id: 3, name: "Headphones", slug: "headphones", count: 1 },
  { id: 4, name: "Tablets", slug: "tablets", count: 0 },
  { id: 5, name: "Accessories", slug: "accessories", count: 0 }
];

export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    joinDate: "2024-01-15",
    ordersCount: 3,
    totalSpent: 259780,
    status: "active"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80",
    joinDate: "2024-01-20",
    ordersCount: 1,
    totalSpent: 29990,
    status: "active"
  },
  {
    id: 3,
    name: "TechStore Pro",
    email: "seller@techstore.com",
    role: "seller",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    joinDate: "2023-12-01",
    productsCount: 2,
    totalEarnings: 189890,
    status: "active"
  },
  {
    id: 4,
    name: "GadgetHub",
    email: "seller@gadgethub.com",
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
    userName: "John Doe",
    userEmail: "john@example.com",
    items: [
      { productId: 1, name: "iPhone 15 Pro Max", quantity: 1, price: 159900, sellerId: 1 },
      { productId: 5, name: "Sony WH-1000XM5", quantity: 1, price: 29990, sellerId: 2 }
    ],
    total: 189890,
    status: "delivered",
    date: "2024-01-15",
    shippingAddress: {
      name: "John Doe",
      address: "123 Main St, Mumbai, Maharashtra 400001",
      phone: "+91 9876543210"
    },
    paymentMethod: "card"
  },
  {
    id: "ORD002",
    userId: 2,
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    items: [
      { productId: 5, name: "Sony WH-1000XM5", quantity: 1, price: 29990, sellerId: 2 }
    ],
    total: 29990,
    status: "shipped",
    date: "2024-01-20",
    shippingAddress: {
      name: "Jane Smith",
      address: "456 Oak Ave, Delhi, Delhi 110001",
      phone: "+91 9876543211"
    },
    paymentMethod: "upi"
  },
  {
    id: "ORD003",
    userId: 1,
    userName: "John Doe",
    userEmail: "john@example.com",
    items: [
      { productId: 3, name: "MacBook Pro 16-inch M3", quantity: 1, price: 249900, sellerId: 1 }
    ],
    total: 249900,
    status: "processing",
    date: "2024-01-25",
    shippingAddress: {
      name: "John Doe",
      address: "123 Main St, Mumbai, Maharashtra 400001",
      phone: "+91 9876543210"
    },
    paymentMethod: "card"
  },
  {
    id: "ORD004",
    userId: 3,
    userName: "TechStore Pro",
    userEmail: "seller@techstore.com",
    items: [
      { productId: 6, name: "Google Pixel 8 Pro", quantity: 1, price: 106999, sellerId: 4 }
    ],
    total: 106999,
    status: "placed",
    date: "2024-01-28",
    shippingAddress: {
      name: "TechStore Pro",
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