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
    path: String,
});

module.exports = model('Post', post);