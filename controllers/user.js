const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');



// NOTE 

// THIS IS ONLY ACCISSABLE FOR ADMIN  



// @desc           get all user     
// @route          put   api/v1/auth/user 
// @acccess        PRIVATE   

exports.getUsers = asyncHandler(async (req, res, next) => {
    const user= await User.find({})
    res.status(200).json(user)
})


// @desc           get single user     
// @route          put   api/v1/auth/user 
// @acccess        PRIVATE   

exports.getUsers = asyncHandler(async (req, res, next) => {
    const user= await User.findById(req.params.id)

    if (!user){
        return next(new ErrorResponse("INvalid User Id",404))
    }
    res.status(200).json(user)
});





// @desc           create  user     
// @route          put   api/v1/auth/user 
// @acccess        PRIVATE   

exports.createUser = asyncHandler(async (req, res, next) => {
    const user= await User.create(req.body)
    
    res.status(201).json(user)
})



// @desc           update  user     
// @route          put   api/v1/auth/user 
// @acccess        PRIVATE   

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user= await User.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators : true
    })
    
    res.status(201).json(user)
})



// @desc           dlete  user     
// @route          put   api/v1/auth/user 
// @acccess        PRIVATE   

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user= await User.findByIdAndDelete(req.params.id)
    res.status(201).json({
        results : 'user deleted /....'
    })
})


