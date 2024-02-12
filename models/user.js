const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    password: String,
    permission: {type: String, default: "user"},
});

module.exports = mongoose.model('user', UserSchema);