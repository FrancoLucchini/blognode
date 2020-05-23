const {Schema, model} = require('mongoose');
const {ObjectId} = Schema;

const comment = new Schema({
    post_id: {type: ObjectId},
    nick: {type: String},
    nickId: {type: String},
    comment: {type: String},
    timestamp: {type: Date, default: Date.now},
    avatar: {type: String}
});

module.exports = model('Comment', comment)