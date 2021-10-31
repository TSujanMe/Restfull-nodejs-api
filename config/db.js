const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/DICTIONARY', {
            useNewUrlParser: true,
        });
        console.log('Mongodb COnnected !! ')
    } catch (error) {
        console.log('connectop failed ')
        console.log(error.message)
    };
};
module.exports = connectDB;