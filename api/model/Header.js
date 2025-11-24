const mongoose = require("mongoose");

const HeaderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    headerlogo: { type: String, default: null },
    topbar: {
        openingHours: {
            label: { type: String, default: "Opening Hours" },
            value: { type: String, default: null },   // e.g. "Mon–Sat : 8am to 9pm"
            visible: { type: Boolean, default: true },
        },
        socialLinks: [
            {
                icon: String,     // e.g. "facebook", "twitter"
                link: String,
                visible: { type: Boolean, default: true },
            }
        ],
        visible: { type: Boolean, default: true },
    },

    menu: [
        {
            name: String,
            link: String,
            visible: { type: Boolean, default: true },
            submenu: [
                {
                    name: String,
                    link: String,
                    visible: { type: Boolean, default: true },
                }
            ]
        },
    ],
    cta: {
        placeholder: String,
        infoText: String,
        link: String,
        visible: { type: Boolean, default: true },
    },
    address: {
        lable: String,
        value: String,
        visible: { type: Boolean, default: true },
    },
    contact: {
        lable: String,
        value: String,
        visible: { type: Boolean, default: true },
    },
    visible: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Header", HeaderSchema);
