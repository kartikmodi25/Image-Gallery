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
    const imgs = req.files.map(f=>({url: f.path}))
    const imageUrls = req.files.map(file => ({ imageURL: file.path, userId: req.params.id }));
    const userData = await UserData.findById(req.params.id)
    for(let img of imageUrls){
        const newImage = new ImageData({userId: img.userId, imageURL: img.imageURL, username: userData.username})
        userData.image.push(newImage);
        await newImage.save()
    }
    await userData.save()
    res.redirect(`/welcome/${userData._id}/gallery`)
}
module.exports.editUser = async (req, res) => {
    if(req.file){
        req.body.userData.imageURL = req.file.path
    }
    const { id } = req.params;
    const userData = await UserData.findByIdAndUpdate(id, { ...req.body.userData });
    res.redirect(`/welcome/${userData._id}`)
}
