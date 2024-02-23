const User = require('../models/user');
const UserData = require('../models/userData');
const ImageData = require('../models/imageData');
module.exports.getUser = async (req, res) => {
    const dbUser = await UserData.findById(req.params.id)
    res.render('userdata/profile', { dbUser })
}

module.exports.getEditUser = async (req, res) => {
    const userData = await UserData.findById(req.params.id)
    res.render('userdata/profileEdit', { userData });
}

module.exports.getGallery = async (req, res) => {
    const userData = await UserData.findById(req.params.id)
    const userImages = await ImageData.find({ userId: req.params.id })
    res.render('gallery/userImage', { userData, userImages });
}

module.exports.getGalleryAdd = async (req, res) => {
    const userData = await UserData.findById(req.params.id)
    res.render('gallery/addImage', { userData });
}

module.exports.addGalleryImage = async (req, res) => {
    const newImage = new ImageData(req.body.ImageData);
    newImage.userId = req.params.id
    const userData = await UserData.findById(req.params.id)
    userData.image.push(newImage);
    await userData.save()
    await newImage.save();
    res.redirect(`/welcome/${userData._id}/gallery`)
}

module.exports.editUser = async (req, res) => {
    const { id } = req.params;
    const userData = await UserData.findByIdAndUpdate(id, { ...req.body.userData });
    res.redirect(`/welcome/${userData._id}`)
}
