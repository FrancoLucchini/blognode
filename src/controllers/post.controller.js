const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

postCtrl = {}


postCtrl.getPosts = async(req, res) => {
        const posts = await Post.find()
        .sort({ created_at: -1 });
        res.render('home', {posts, errors: []});
}

postCtrl.renderCreatePost = (req, res) => {
    res.render('post', {errors: [], title: '', description: '', category: '', content: ''});
}

postCtrl.createPost = async (req, res) => {
    const errors = [];
    const {title, description, category, content} = req.body;
    if(!title || title.length < 10 || title.length > 20){
        errors.push({text: 'Insert a title of more than 10 words and less than 20'});
    }
    if(!description || description.length < 10 || description.length > 20){
        errors.push({text: 'Insert a description of more than 10 words and less than 20 '});
    }
    if(!category){
        errors.push({text: 'Insert a category'});
    }
    if(category != 'Technology'){
        if(category != 'Sports'){
            if(category != 'News'){
                errors.push({text: 'Insert a correct category'});
            }
        }
    }
    if(!content || content.length < 10){
        errors.push({text: 'Insert content'});
    }
    if(errors.length > 0){
        res.render('post', {errors, title, description, category, content});
    }
    else{
        const user = await User.findById(req.user.id);
        const post = new Post();
        post.title = req.body.title;
        post.content = req.body.content;
        post.description = req.body.description;
        post.category = req.body.category;
        post.userId = user.id;
        post.user = user.nick;
        user.postsAccountant = user.postsAccountant + 1;
        if(req.file){
            post.filename = req.file.filename;     
            post.originalname = req.file.originalname;      
            post.mimetype = req.file.mimetype;      
            post.path = '/img/uploads/' + req.file.filename;
            post.size = req.file.size;
        } else{
            post.path = '/img/uploads/Usuario.png'
        }
        await post.save();
        await user.save();
        req.flash('success_msg', 'Post created');
        res.redirect('/');
    }
}

postCtrl.getPost = async(req, res) => {
    
    const idPost = req.params.id;
    const post = await Post.findById(idPost);
    const comments = await Comment.find({post_id: post.id}).sort({ timestamp: -1 });
    
    if(!post){
        req.flash('error', 'Not found post');
        res.redirect('/');
    }else{
        const {nick, path, postsAccountant, registeredFrom, logged, id} = await User.findById(post.userId);
            post.views = post.views + 1;
            await post.save();
            res.render('postview', {post, errors: [], comments, nick, path, postsAccountant, registeredFrom, logged, id});
        }
    }

postCtrl.postComment = async(req, res) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    if(!req.user){
        req.flash('error', 'To comment you have to be registered');
        res.redirect(`/post/${id}`);
    }
    if(req.body.comment < 10){
        req.flash('error', 'The comment must contain at least 15 letters');
        res.redirect(`/post/${id}`);
    }
    else if(post){
        try{
        const newComment = new Comment(req.body);
        newComment.post_id = id;
        newComment.nickId = req.user.id;
        newComment.nick = req.user.nick;
        newComment.avatar = req.user.path;
        await newComment.save();
        req.flash('success_msg', 'the comment was added');
        res.redirect(`/post/${id}`);
        }catch(err){
            console.log(err);
        }
    } 
}

postCtrl.deletePost = async(req, res) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    const user = await User.findById(post.userId);
    const userId = user.id;
    
    if(req.user.id == userId){
        await Post.findByIdAndRemove(id);
        req.flash('success_msg', 'The post was deleted');
        res.redirect('/');
    } else{
        req.flash('error', 'Not authorized');
        res.redirect('/');
    }
}

postCtrl.putPost = async(req, res) => {
    const errors = [];
    const {id} = req.params;
    const post = await Post.findById(id);
    if(post){
    if(post.userId == req.user.id){
        if(post){
            res.render('editpost', {post, errors: []});
        } else{
            req.flash('error', 'The post not exists');
            res.redirect(`/`);
        }
    } else{
        req.flash('error', 'Not authorized');
        res.redirect('/');
    }
}
}



postCtrl.putPostEdit = async(req, res) => {
    const errors = [];
    const post = await Post.findById(req.params.id);
    if(post.userId == req.user.id){
        const {title, description, content, category} = req.body;

        if(!title || title.length < 5 || title.length > 20){
            errors.push({text: 'Insert a title of more than 5 letters and less than 20'});
        }
        if(!description || description.length < 5 || description.length > 20){
            errors.push({text: 'Insert a description of more than 5 letters and less than 20 '});
        }
        if(!content || content == "" || content.length < 5){
            errors.push({text: 'Insert a title of more than 5 letters and less than 20'});
        }
        if(!category){
            errors.push({text: 'Insert a category'});
        }
        if(errors.length > 0){
            res.render('editpost', {errors, title, description, category, content, post});
        }
        else if (req.file){
                const post = {
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    category: req.body.category,
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    path: '/img/uploads/' + req.file.filename,
                    size: req.file.size
                }
                await Post.findByIdAndUpdate(req.params.id, {$set: post});
            }else{
                await Post.findByIdAndUpdate(req.params.id, {title, description, content, category});
        }

        req.flash('success_msg', 'Post updated');
        res.redirect(`/post/${req.params.id}`);
    } else{
        req.flash('error', 'Not authorized')
        res.redirect('/');
    }
}

postCtrl.findPosts = async (req, res) => {
    const query = new RegExp(req.query.search);
    const posts = await Post.find({title: {$regex: query, $options: 'is'}});
    res.render('search', {query, posts});
}

postCtrl.findCategories = async(req, res) => {
    const _category = req.params.category;
    const posts = await Post.find({category: {$regex: _category, $options: 'is'}});
    res.render('category', {_category, posts});
}




module.exports = postCtrl;
