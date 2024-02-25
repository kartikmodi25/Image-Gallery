const express = require('express')
const router = express.Router({})
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isImageAuthor } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const users = require('../controllers/users')

router.get('/gallery', isLoggedIn, catchAsync(users.getGallery))
router.get('/', isLoggedIn, catchAsync(users.getUser))

router.route('/gallery/add')
.get(isLoggedIn, catchAsync(users.getGalleryAdd))
.post(isLoggedIn, upload.array('image'), catchAsync(users.addGalleryImage))

router.route('/edit')
.get(isLoggedIn, catchAsync(users.getEditUser))
.put(isLoggedIn, upload.single('image'), catchAsync(users.editUser))

router.route('/gallery/:imageId')
.get(isLoggedIn, isImageAuthor, catchAsync(users.getEditImage))
.put(isLoggedIn, isImageAuthor, upload.single('image'), catchAsync(users.editImage))
.delete(isLoggedIn, catchAsync(users.deleteImage))

module.exports = router


