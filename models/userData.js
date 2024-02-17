const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Image = require('./imageData')
const UserData = new Schema({
    name: String,
    imageURL: String,
    profileType: String,
    bio: String,
    skill1: String,
    skill2: String,
    skill3: String,
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