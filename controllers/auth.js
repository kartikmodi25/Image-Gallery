const User = require('../models/user');
const UserData = require('../models/userData');

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ username, email })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, async err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Image Gallery!')

            const userData = new UserData({
                _id: user._id,
                username: user.username,
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
}

module.exports.loginUser = async (req, res) => {
    const dbUser = await UserData.findOne({username:req.body.username});
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || `/welcome/${dbUser._id}`
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}