const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI
// console.log('mongodburl ', MONGODB_URI);
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to mongodb database')
    })
    .catch((err) => {
        console.log('error while connecting to mongodb ', err);
})