if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const db = mongoose.connection;
const express = require('express')
const path = require('path');
const ejsMate = require('ejs-mate');
const User = require('./models/user');
const methodOverride = require('method-override');
const app = express();
const adminRoutes = require('./routes/admin')
const welcomeRoutes = require('./routes/user')
const authRoutes = require('./routes/login')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const Image = require('./models/imageData');
const catchAsync = require('./utils/catchAsync')
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/login-db"
const ExpressError = require('./utils/ExpressError')
const port = process.env.PORT || 3000

mongoose.connect(dbUrl);
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

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});

const sessionConfig = {
    store,
    name: 'session',
    secret: process.env.SECRET,
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

app.get('/welcome', catchAsync(async (req, res) => {
    const images = await Image.find({});
    res.render('gallery/home', { images })
}))

app.get('/', (req, res) => {
    if(res.locals.currentUser){
        return res.redirect(`/welcome/${res.locals.currentUser._id}`)
    }
    res.render('home')
})

app.use('/admin', adminRoutes)
app.use('/welcome/:id', welcomeRoutes)
app.use('', authRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found!", 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No! Something Went Wrong!!!!"
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})