const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Image = require('./imageData')
const User = require('./user')
const UserData = new Schema({
    username: String,
    name: String,
    imageURL: {type: String, default: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"},
    profileType: {type: String, default: "Software Engineer"},
    bio: {type: String, default: "Building the future one line of code at a time."},
    skills: {type: String, default: "NodeJS, GoLang, HTML, CSS, C++, Python"},
    email: String,
    image: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Image'
        }
    ]
});
UserData.post('findOneAndDelete', async function(doc){
    if(doc){
        await Image.deleteMany({
            _id: {
                $in: doc.image
            }
        })
    }
})
module.exports = mongoose.model('userData', UserData);