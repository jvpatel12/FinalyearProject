const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const products = [
  {
    name: "iPhone 15 Pro Max",
    description: "The most advanced iPhone with Pro camera system and titanium design",
    price: 159900,
    originalPrice: 169900,
    discount: 6,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&q=80"],
    stock_quantity: 25
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen and exceptional camera",
    price: 129999,
    originalPrice: 139999,
    discount: 7,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80"],
    stock_quantity: 15
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancelling wireless headphones",
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"],
    stock_quantity: 30
  }
];

async function seed() {
  try {
    console.log('Logging in as admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@logimart.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('Login successful. Seeding products...');

    for (const product of products) {
      await axios.post(`${API_URL}/products`, product, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Created: ${product.name}`);
    }
    
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error.response?.data || error.message);
  }
}

seed();
