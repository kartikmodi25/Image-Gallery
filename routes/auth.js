const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const UserData = require('../models/userData');

async function authChecker(req, res, next) {
    try {
        const dbUser = await User.findOne({ ...req.body.user });
        if (!dbUser) {
            return res.render('error')
        }
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).send('Internal Server Error');
    }
}
router.get('/login', (req, res) => {
    res.render('users/login')
})
router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
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
}))
router.post('/login', authChecker, catchAsync(async (req, res) => {
    const dbUser = await User.findOne({ ...req.body.user });
    if (dbUser.permission === "admin") {
        res.redirect('/admin');
    } else {

        res.redirect(`/welcome/${dbUser._id}`);
    }
}));

module.exports = router