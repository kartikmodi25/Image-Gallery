const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.connect('mongodb://localhost:27017/login-db', {
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await User.deleteMany({});
    const camp = new User({
        email: "admin@admin.com",
        password: "hardpassword",
        permission: "super_admin"
    })
    await camp.save();

}

seedDB().then(() => {
    mongoose.connection.close();
})