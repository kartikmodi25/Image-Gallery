const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Image = new Schema({
    userId: String,
    imageURL: String,
    username: String,
});

module.exports = mongoose.model('image', Image);