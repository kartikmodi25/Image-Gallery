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
const authRoutes = require('./routes/user')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const Image = require('./models/imageData');
const catchAsync = require('./utils/catchAsync')

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

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    // res.locals.userId = req.user._id
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
})


app.use('/admin', adminRoutes)
app.use('/welcome', welcomeRoutes)
app.use('', authRoutes)

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/welcome', catchAsync(async (req, res) => {
    const images = await Image.find({});
    res.render('gallery/index', { images })
}))
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No! Something Went Wrong!!!!"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})