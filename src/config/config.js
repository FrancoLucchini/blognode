const config = {
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb+srv://franco:12345@blog-database-ci3gh.mongodb.net/test?retryWrites=true&w=majority',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
    }
}

module.exports = config;