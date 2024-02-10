const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    password: String,
    permission: String,
});

module.exports = mongoose.model('user', UserSchema);