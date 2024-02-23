const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const ImageData = require('../models/imageData');
const UserData = require('../models/userData');
const { isLoggedIn } = require('../middleware')

const users = require('../controllers/users')

router.get('/:id', isLoggedIn, catchAsync(users.getUser))
router.get('/:id/edit', isLoggedIn, catchAsync(users.getEditUser))
router.get('/:id/gallery', isLoggedIn, catchAsync(users.getGallery))
router.get('/:id/gallery/add', isLoggedIn, catchAsync(users.getGalleryAdd))
router.post('/:id/gallery/add', isLoggedIn, catchAsync(users.addGalleryImage))
router.put('/:id/edit', isLoggedIn, catchAsync(users.editUser));

module.exports = router