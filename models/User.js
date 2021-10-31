const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is reqired ..']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
        required: [true, "EMail is requirwed "],
        unique: true
    },
    role: {
        type: String, enum: ['user', 'publisher'],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "password is required "],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }



});



UserSchema.pre('save', async function (next) {
    // this refers to current documnt to save 
    if ( !this.isModified("password")) return next()
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)

    next()
});

// sign the jwt and return 

UserSchema.methods.getSignedJWTToken = function () {
    return jwt.sign({ id: this._id }, 'SECRET', {
        expiresIn: '30d'
    })
}
// match user entered password to hashed password in database 
UserSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
} 



UserSchema.methods.getResetPasswordToken = function (){
    // generate the token  
    const resetToken  = crypto.randomBytes(20).toString('hex');


    // hash the token and set to resetpasswordtoken fields  

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // set the expires date  
    this.resetPasswordExpires = Date.now() + 10 *10*60*1000
    return resetToken;
}



module.exports = mongoose.model("User", UserSchema);
