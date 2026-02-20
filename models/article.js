const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
    keyword: {
    type: String,    
    },
    title: {
    type: String,    
    },
    description: {
        type: String,
        
    },
    urlToImage: {
        type: String,
        
    },
    owner: {
        ref: 'user',
        type: mongoose.Schema.Types.ObjectId,
        select: false
    },
    publishedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  
});

module.exports = mongoose.model('article', cardSchema);