const dotenv = require('dotenv');
dotenv.config();

const app = require('../app');
const connectDB = require('../config/db');

// Connect to MongoDBAtlas for Vercel Serverless Function
connectDB();

module.exports = app;
