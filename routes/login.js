const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const UserData = require('../models/userData');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('users/login')
})
router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ username, email })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, async err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Image Gallery!')

            const userData = new UserData({
                _id: user._id,
                name: user.username,
                email: user.email,
            })
            await userData.save();
            res.redirect(`/welcome/${user._id}`)
        })

    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {
    const dbUser = await UserData.findOne({name:req.body.username});
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || `/welcome/${dbUser._id}`
    res.redirect(redirectUrl);

}));
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
});
module.exports = router