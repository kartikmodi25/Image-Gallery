const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const auth = require('../controllers/auth')
const {validateRegister} = require('../middleware')
router.route('/login')
    .get(auth.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(auth.loginUser))

router.route('/register')
    .get(auth.renderRegister)
    .post(validateRegister, catchAsync(auth.registerUser))

router.route('/logout')
    .get(auth.logoutUser)

module.exports = router