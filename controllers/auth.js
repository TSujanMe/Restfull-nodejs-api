const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');



// custom token from the model .create cookie and sned response  
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJWTToken()
    const cookieOption = {
        expires: new Date(Date.now() + 30 + 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV) {
        cookieOption.secure = true
    }

    res.status(statusCode).cookie('token', token, cookieOption).json({
        success: true,
        token
    })

}









// @desc           Register user   
// @route          POST   api/v1/auth/register  
// @acccess        public  

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // create user 

    const user = await User.create({
        name, email, password, role
    });

    sendTokenResponse(user, 200, res)

})

// @desc           LOGIN user   
// @route          POST   api/v1/auth/login  
// @acccess        public  

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // create user 
    // validate emial and password  

    if (!email || !password) {
        return next(new ErrorResponse("PLease Provide an email and password ", 400
        ))
    }


    const user = await User.findOne({ email }).select('+password');


    if (!user) {
        return next(new ErrorResponse(" email and password donesnot exists ", 400))
    }


    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse(" email and password donesnot exists ", 400))
    }

    sendTokenResponse(user, 200, res)
})






// @desc           GET current logged in  user   
// @route          POST   api/v1/auth/me  
// @acccess        PRIVATE   

exports.getme = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })

})


// @desc           fOREGET PASSWROD    
// @route          POST   api/v1/auth/forgetPassword
// @acccess        PRIVATE   

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse("Thierei s not any user with this email ", 404))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })
    // create reset url  
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;


    const message = `you are recievcing this email bcus you(or something else_ has requested tthe reset of password .. please put a make request of the password ...  go
        to thus tlink ${resetUrl}`;

    try {
        await sendEmail({
            email,
            subject: "Passwrd ewawr token ",
            message
        })
        res.status(200).json({
            success: true,
            data: "Email has beeb send to your email "
        });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordEWxpires = undefined;
        await user.save({ validateBeforeSave: false })
        return next(new ErrorResponse("email couldnout be send  ", 500))

    }


})




// @desc           reset password    
// @route          PUT   api/v1/auth/resetPassword/:resetToken
// @acccess        PRIVATE   

exports.resetPassword = asyncHandler(async (req, res, next) => {

    // get hashed token 

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse("Invalid TOken", 404));
    }

    // set new password  

    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    sendTokenResponse(user, 200, res)
})





// @desc           update user details    
// @route          put   api/v1/auth/updatedetails  
// @acccess        PRIVATE   

exports.updateDetails = asyncHandler(async (req, res, next) => {
    const { name, email } = req.body;

    const fieldsToUpdate = {
        name, email
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        user
    })

})

// @desc           update password    
// @route          put   api/v1/auth/updatepassword  
// @acccess        PRIVATE   

exports.updatePassword = asyncHandler(async (req, res, next) => {
    const { newPassword } = req.body;

    
    const user = await User.findById(req.user.id ).select('+password');


    // check current password 

    if ( !(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse("Password is incorret",401))
    }

    user.password = newPassword


    await  user.save()
    
    sendTokenResponse(user,200,res)
})
