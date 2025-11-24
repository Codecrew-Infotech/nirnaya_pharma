const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    visible: {
        type: Boolean,
        default: true
    },
    // SEO fields
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    metaKeywords: {
        type: String,
        type: [String],
    },
    
    publishDate: {
        type: Date,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);