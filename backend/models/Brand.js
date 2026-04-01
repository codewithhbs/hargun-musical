const mongoose = require('mongoose');

const Brand_Schema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true,
        trim: true,
    },
});

module.exports = mongoose.model('Brand', Brand_Schema);