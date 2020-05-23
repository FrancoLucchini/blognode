const {Router} = require('express');
const router = Router();
const {signUp, signUpPost, signIn, signInPost, logout, profile} = require('../controllers/user.controller');

const {isAuthenticated} = require('../middleware/auth');

router.get('/signup', signUp);
router.post('/signup', signUpPost);
router.get('/signin', signIn);
router.post('/signin', signInPost);
router.get('/logout', logout);
router.get('/profile/:id', profile)


module.exports = router;