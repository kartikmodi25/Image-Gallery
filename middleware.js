const ImageData = require('./models/imageData');
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in!!')
        return res.redirect('/login')
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.isImageAuthor = async (req, res, next) => {
    const { id, imageId } = req.params;
    const img = await ImageData.findById(imageId);
    if (img.userId != res.locals.currentUser._id) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/welcome`);
    }
    next();
}