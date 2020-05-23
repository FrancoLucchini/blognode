const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

const user = new Schema({
    nick: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    postsAccountant: {type: Number, default: 0},
    registeredFrom: {type: Date, default: Date.now()},
    logged: {type: Date, default: Date.now()},
    filename: String,
    originalname: String,
    mimetype: String,
    path: String,
    size: Number,
});

user.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

user.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = model('User', user);