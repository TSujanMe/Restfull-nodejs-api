const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required for review   "]
    },
    text: {
        type: String,
        required: [true, "Please add a description "]
    },
    rating: {
        type: Number,
        required: [true, "Please add a number of weeks  "],
        min:1,
        max :10
    },


    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
});



module.exports = mongoose.model('User',ReviewSchema)