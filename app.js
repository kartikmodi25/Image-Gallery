const mongoose = require('mongoose');
const db = mongoose.connection;
const express = require('express')
const path = require('path');
const ejsMate = require('ejs-mate');
const User = require('./models/user');
const methodOverride = require('method-override');
const UserData = require('./models/userData');
const ImageData = require('./models/imageData');
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
app.use('/css', express.static(__dirname + '/css', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

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

app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/welcome/:id', async (req, res) => {
    const dbUser = await UserData.findById(req.params.id)
    res.render('welcome', { dbUser })
})
app.get('/welcome/:id/edit', async (req, res) => {
    const userData = await UserData.findById(req.params.id)
    res.render('edit', { userData });
})
app.get('/welcome/:id/gallery', async (req, res) => {
    const userData = await UserData.findById(req.params.id)
    const userImages = await ImageData.find({userId: req.params.id})
    res.render('gallery', { userData, userImages});
})
app.get('/welcome/:id/gallery/add', async (req, res) => {
    const userData = await UserData.findById(req.params.id)
    res.render('addImage', { userData });
})
app.post('/welcome/:id/gallery/add', async (req, res) => {
    const newImage = new ImageData(req.body.ImageData);
    newImage.userId = req.params.id
    await newImage.save();
    const userImages = await ImageData.find({userId: req.params.id})
    const userData = await UserData.findById(req.params.id)
    res.redirect(`/welcome/${userData._id}/gallery`)
})
app.put('/welcome/:id/edit', async (req, res) => {
    const { id } = req.params;
    const userData = await UserData.findByIdAndUpdate(id, { ...req.body.userData });
    res.redirect(`/welcome/${userData._id}`)
});

app.get('/admin', async (req, res) => {
    const users = await User.find({});
    res.render('admin', { users })
})
app.post('/register', async (req, res) => {
    const user = new User(req.body.user);
    await user.save();
    const userData = new UserData({
        _id: user._id,
        name: user.email,
        imageURL: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
        profileType: "N/A",
        bio: "N/A",
        skill1: "N/A",
        skill2: "N/A",
        skill3: "N/A",
    })
    await userData.save();
    res.redirect(`/welcome/${user._id}`)
})
app.post('/login', authChecker, async (req, res) => {
    const dbUser = await User.findOne({ ...req.body.user });
    if (dbUser.permission === "admin") {
        res.redirect('/admin');
    } else {

        res.redirect(`/welcome/${dbUser._id}`);
    }
});
app.delete('/admin/:id', async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/admin');
})
app.get('/', (req, res) => {
    res.render('home')
})
app.listen(3000, () => {
    console.log('Serving on port 3000')
})