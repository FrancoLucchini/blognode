const {Router} = require('express');
const router = Router();

const {getPosts, renderCreatePost, createPost, getPost, postComment, putPost, deletePost, putPostEdit, findPosts, findCategories} = require('../controllers/post.controller'); 
const {isAuthenticated} = require('../middleware/auth');

router.get('/', getPosts);
router.get('/post/:id', getPost);
router.post('/post/:id/comment', postComment);


router.get('/post', isAuthenticated, renderCreatePost);
router.post('/post', isAuthenticated, createPost);

router.get('/post/:id/edit', isAuthenticated, putPost);
router.put('/post/:id/edit', isAuthenticated, putPostEdit);

router.get('/post/:id/delete', isAuthenticated, deletePost);

router.get('/search', findPosts);
router.get('/categories/:category', findCategories);

module.exports = router;