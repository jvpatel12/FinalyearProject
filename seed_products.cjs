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
  const email = `seed-admin-${Date.now()}@example.com`;
  const password = 'password123';

  try {
    console.log('Registering a new seller user...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Seed Admin',
      email: email,
      password: password,
      role: 'seller'
    });

    const token = registerRes.data.token;
    console.log(`Registered as ${email}. Seeding products...`);

    for (const product of products) {
      const res = await axios.post(`${API_URL}/products`, product, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Created: ${product.name} (ID: ${res.data._id})`);
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error.response?.data || error.message);
  }
}

seed();
