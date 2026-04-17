const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const productSchema = new mongoose.Schema({
    name: String,
    brand: String,
    category: String,
    price: Number,
    stock_quantity: Number,
    averageRating: Number
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const checkProducts = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        console.log('Total products:', products.length);
        console.log(JSON.stringify(products, null, 2));
        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkProducts();
