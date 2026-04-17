const mongoose = require('mongoose');
const Product = require('./backend/models/Product');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({}).limit(5);
        console.log(JSON.stringify(products, null, 2));
        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkProducts();
