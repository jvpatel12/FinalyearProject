const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser, useUnifiedTopology are no longer needed in Mongoose 6+
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error.message.includes('ECONNREFUSED')) {
            console.error(`Error: Could not connect to MongoDB. Is the service running?`);
            console.error(`Try running 'net start MongoDB' in an Administrator terminal.`);
        } else {
            console.error(`Error: ${error.message}`);
        }
        process.exit(1);
    }
};

module.exports = connectDB;
