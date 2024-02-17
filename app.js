const mongoose = require('mongoose');
const db = mongoose.connection;
const express = require('express')
const path = require('path');
const ejsMate = require('ejs-mate');
const User = require('./models/user');
const methodOverride = require('method-override');
const app = express();
const adminRoutes = require('./routes/admin')
const welcomeRoutes = require('./routes/welcome')
const authRoutes = require('./routes/auth')

mongoose.connect('mongodb://127.0.0.1:27017/login-db');
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use('/welcome', welcomeRoutes)
app.use('/', authRoutes)

app.get('/', (req, res) => {
    res.render('home')
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No! Something Went Wrong!!!!"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})