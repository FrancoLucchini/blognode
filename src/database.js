const mongoose = require('mongoose');
const config = require('./config/config');

const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose.connect(config.DB.URI, opts);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Database is connected');
})

connection.on('error', (err) => {
    console.log(err);
})
