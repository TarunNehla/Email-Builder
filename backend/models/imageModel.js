const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type : String,
    },
    uploadedAt: { 
        type: Date, 
        default: Date.now 
    },
})

const imageModel = mongoose.model('image',imageSchema);
module.exports = imageModel;