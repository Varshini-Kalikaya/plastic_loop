const mongoose = require('mongoose');

const defaultUri = 'mongodb+srv://kalikayavarshini99_db_user:UDZYFbpBxPFvv9kD@cluster0.i7t7u52.mongodb.net/plasticloop?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || defaultUri;
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
  }
};

module.exports = connectDB;
