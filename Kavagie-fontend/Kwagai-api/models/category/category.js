const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    is_deleted:{
        type:Boolean,
        default:0
    }

});

module.exports = mongoose.model('Category', categorySchema);