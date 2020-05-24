const User = require('../models/user');
const Post = require('../models/post');

const config = require('../config/config');

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUD,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
});

const fs = require('fs-extra');

const passport = require('passport');

userCtrl = {};

userCtrl.signUp = (req, res) => {
    res.render('signup', {errors: [], nick: '', email: ''});
}

userCtrl.signUpPost = async (req, res) => {
    const errors = [];
    const {nick, email, password, confirmPassword} = req.body;
    if(password != confirmPassword){
        errors.push({text: "Passwords do not match."});
    }
    if(password.length < 4 ){
        errors.push({text: 'Password must be at least 4 characters.'});
    }
    if(errors.length > 0){
        res.render('signup', {errors, nick, email});
    } else{
        
        const nickUser = await User.findOne({nick: nick});
        const emailUser = await User.findOne({email: email});
        console.log(emailUser);
        if(nickUser){
            req.flash('error', 'The nick already exists');
            res.redirect('/users/signup');    
        }
        if(emailUser){
            req.flash('error', 'The email already exists');
            res.redirect('/users/signup');  
        }
        else{
            user = new User();     
            user.nick = req.body.nick;   
            user.email = req.body.email;   
            user.password = req.body.password;
            if(req.file){
                const result = await cloudinary.v2.uploader.upload(req.file.path);     
                user.path = result.url;
                await fs.unlink(req.file.path);
            } else{
                user.path = '/img/uploads/Usuario.png'
            }
            await user.save();
            req.flash('success_msg', 'User created');
            res.redirect('/users/signin');
            }
    }
}


userCtrl.signIn = (req, res) => {
    res.render('signin', {errors: []});
}

userCtrl.signInPost = passport.authenticate('local', {
        failureRedirect: '/users/signin',
        successRedirect: '/',
        failureFlash: true
});

userCtrl.profile = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    const posts = await Post.find({userId: user.id}).sort({ created_at: -1 });
    if(!user){
        req.flash('error', "The user doesn't exist");
        res.redirect('/');
    }
    res.render('profile', {user, errors: [], posts});
}



userCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out now.');
    res.redirect('/users/signin');
}





module.exports = userCtrl;