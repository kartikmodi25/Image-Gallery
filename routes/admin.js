const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const UserData = require('../models/userData');

router.get('/', catchAsync(async (req, res) => {
    const users = await User.find({});
    res.render('admin/admin', { users })
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await UserData.findByIdAndDelete(id)
    res.redirect('/admin');
}))

module.exports = router