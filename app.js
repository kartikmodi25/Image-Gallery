const mongoose = require('mongoose');
const db = mongoose.connection;
const express = require('express')
const path = require('path');
const ejsMate = require('ejs-mate');
const User = require('./models/user');
const methodOverride = require('method-override');

const app = express();

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

async function authChecker(req, res, next) {
    try {
        const dbUser = await User.findOne({ ...req.body.user });
        if (!dbUser) {
            return res.status(401).send('Invalid email or password');
        }
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

app.get('/login' , (req, res)=>{
    res.render('login')
})
app.get('/register', (req, res)=>{
    res.render('register')
})
app.get('/welcome', (req, res)=>{
    res.render('welcome')
})
app.get('/admin', async (req, res)=>{
    const users = await User.find({});
    res.render('admin', {users})
})
app.post('/register', async (req, res)=>{
    const user = new User(req.body.user);
    await user.save();
    res.redirect('/welcome')
})
app.post('/login', authChecker, async (req, res)=>{
    const dbUser = await User.findOne({ ...req.body.user });
    if(dbUser.permission === "admin"){
        res.redirect('/admin')
    }
    else{
        res.redirect('/welcome')
    }
    
})
app.get('/', (req, res)=>{
    res.render('home')
})
app.listen(3000, () => {
    console.log('Serving on port 3000')
})