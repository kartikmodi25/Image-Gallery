const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserData = new Schema({
    name: String,
    imageURL: String,
    profileType: String,
    bio: String,
    skill1: String,
    skill2: String,
    skill3: String,
});

module.exports = mongoose.model('userData', UserData);