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
    image_link: {
        type: String,
        
    },
    article_link: {
        type: String,
        
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        select: false
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
  
});

module.exports = mongoose.model('article', cardSchema);