const express = require('express');
const cors = require('cors');
const multer = require('multer');
const passport = require('passport');
const morgan = require('morgan');
const path = require('path');
const uuidv4 = require('uuid/v4');
const {format} = require('timeago.js');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');
const methodOverride = require('method-override');
const MemoryStore = require('memorystore')(session);


// import routes
const userRoutes = require('./routes/user.routes.js');
const postRoutes = require('./routes/post.routes.js');
require('./middleware/passport');

//config
const config = require('./config/config');


//initalizations
const app = express();

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error');
  res.locals.errors = [];
  res.locals.user = req.user || null;
  next();
});

app.use((req, res, next) => {
    app.locals.format = format;
    app.locals.moment = moment;
    next();
});



const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

app.use(multer({storage: storage}).single('image'))

//statics
app.use(express.static(path.join(__dirname, 'public')));



//routes
app.use('/users', userRoutes);
app.use('/', postRoutes);

module.exports = app;