const {Schema, model} = require('mongoose');

const post = new Schema({
    title: String,
    description: String,
    content: String,
    category: String,
    user: {
        type:String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    views: {type: Number, default: 0},
    created_at: {type: Date, default: Date.now()},
    filename: String,
    originalname: String,
    mimetype: String,
    path: String,
    size: Number,
});

module.exports = model('Post', post);