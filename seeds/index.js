if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const User = require('../models/user');
const UserData = require('../models/userData');
const ImageData = require('../models/imageData')
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/login-db"
mongoose.connect(String(dbUrl));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await UserData.deleteMany({})
    await ImageData.deleteMany({})
    await User.deleteMany({})
    
}

seedDB().then(() => {
    mongoose.connection.close();
})