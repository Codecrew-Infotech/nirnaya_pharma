const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
    ownerDetail: {
        image: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: true
        },
        educationInfo: {
            type: String,
            required: false
        }
    },
    sections: [
        {
            title: {
                type: String,
                required: true
            },
            subTitle: {
                type: String,
                required: false
            },
            content: {
                type: String,
                required: false
            }
        }
    ],
    visible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('AboutUs', aboutUsSchema);
